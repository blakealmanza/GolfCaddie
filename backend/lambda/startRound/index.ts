import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { dynamoClient } from '../shared/dynamoClient';

export async function handler(event: APIGatewayProxyEvent) {
	if (event.body === null) {
		return {
			statusCode: 400,
			body: JSON.stringify({ message: 'Missing body' }),
		};
	}
	const body = JSON.parse(event.body);
	const { courseId, userId } = body;

	const roundId = uuidv4();
	const now = new Date().toISOString();

	const item = {
		roundId: { S: roundId },
		courseId: { S: courseId },
		userId: { S: userId },
		holes: { L: [] }, // empty holes to start
		startedAt: { S: now },
		status: { S: 'IN_PROGRESS' },
	};

	await dynamoClient.send(
		new PutItemCommand({
			TableName: process.env.ROUNDS_TABLE,
			Item: item,
		}),
	);

	return {
		statusCode: 201,
		body: JSON.stringify({ roundId }),
	};
}
