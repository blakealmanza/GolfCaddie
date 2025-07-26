import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import type { Course } from '@shared/types';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { dynamoClient } from '../shared/dynamoClient';
import response from '../shared/response';

export async function handler(event: APIGatewayProxyEvent) {
	try {
		if (event.body === null) {
			return response(400, { message: 'Missing body' });
		}
		const body = JSON.parse(event.body);
		const userId = event.requestContext.authorizer?.claims?.sub;
		const courseId = uuidv4();

		const docClient = DynamoDBDocumentClient.from(dynamoClient);

		const item: Course = {
			courseId,
			name: body.name,
			holes: body.holes || [],
			createdBy: userId,
			createdAt: new Date().toISOString(),
		};

		await docClient.send(
			new PutCommand({
				TableName: process.env.COURSES_TABLE,
				Item: item,
			}),
		);

		return response(201, { courseId });
	} catch (error) {
		return response(500, {
			message: 'Internal server error',
			error: (error as Error).message,
		});
	}
}
