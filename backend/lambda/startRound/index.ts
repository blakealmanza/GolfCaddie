import { GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { dynamoClient } from '../shared/dynamoClient';
import response from '../shared/response';

const generateEmptyHole = () => ({
	M: {
		tee: { NULL: true },
		pin: { NULL: true },
		par: { N: '0' },
		shots: { L: [] },
	},
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

		let holes: { L: any[] } = {
			L: Array.from({ length: 18 }, generateEmptyHole),
		};

		if (courseId) {
			const courseData = await dynamoClient.send(
				new GetItemCommand({
					TableName: process.env.COURSES_TABLE,
					Key: { courseId: { S: courseId } },
				}),
			);

			const courseHoles = courseData.Item?.holes?.L;
			if (courseHoles) {
				holes = {
					L: courseHoles.map((hole) => ({
						M: {
							tee: hole.M?.tee ?? { NULL: true },
							pin: hole.M?.pin ?? { NULL: true },
							par: hole.M?.par ?? { N: '0' },
							shots: { L: [] },
						},
					})),
				};
			}
		}

		const item: Record<string, any> = {
			roundId: { S: roundId },
			userId: { S: userId },
			startedAt: { S: now },
			status: { S: 'IN_PROGRESS' },
			courseId: courseId ? { S: courseId } : { NULL: true },
			holes,
		};

		await dynamoClient.send(
			new PutItemCommand({
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
