import {
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
} from '@aws-sdk/lib-dynamodb';
import type { Course, CourseHole, RoundHole } from '@shared/types';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { dynamoClient } from '../shared/dynamoClient';
import response from '../shared/response';

const generateEmptyHole = (): RoundHole => ({
	tee: null,
	pin: null,
	par: 0,
	shots: [],
});

export async function handler(event: APIGatewayProxyEvent) {
	try {
		if (event.body === null) {
			return response(400, { message: 'Missing body' });
		}

		const body = JSON.parse(event.body);
		const { courseId } = body;

		const roundId = uuidv4();
		const userId = event.requestContext.authorizer?.claims?.sub;
		const now = new Date().toISOString();

		const docClient = DynamoDBDocumentClient.from(dynamoClient);

		let holes = Array.from({ length: 18 }, generateEmptyHole);

		if (courseId) {
			const result = await docClient.send(
				new GetCommand({
					TableName: process.env.COURSES_TABLE,
					Key: { courseId },
				}),
			);

			const courseData = result.Item as Course | undefined;

			const courseHoles = courseData?.holes;
			if (courseHoles) {
				holes = courseHoles.map((hole: CourseHole) => ({
					tee: hole.tee ?? null,
					pin: hole.pin ?? null,
					par: hole.par ?? 0,
					shots: [],
				}));
			}
		}

		const item = {
			roundId,
			userId,
			startedAt: now,
			status: 'IN_PROGRESS',
			courseId: courseId ?? null,
			holes,
		};

		await docClient.send(
			new PutCommand({
				TableName: process.env.ROUNDS_TABLE,
				Item: item,
			}),
		);

		return response(201, { roundId });
	} catch (error) {
		console.error('Error starting round:', error);
		return response(500, { message: 'Internal server error' });
	}
}
