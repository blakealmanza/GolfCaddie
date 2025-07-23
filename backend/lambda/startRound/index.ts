import { PutItemCommand } from '@aws-sdk/client-dynamodb';
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
		const { courseId } = body;

		const roundId = uuidv4();
		const userId = event.requestContext.authorizer?.claims?.sub || 'unknown';
		const now = new Date().toISOString();

		const item = {
			roundId: { S: roundId },
			courseId: { S: courseId },
			userId: { S: userId },
			startedAt: { S: now },
			status: { S: 'IN_PROGRESS' },
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
