import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { dynamoClient } from '../shared/dynamoClient';

export async function handler(event: APIGatewayProxyEvent) {
	if (event.body === null) {
		return {
			statusCode: 400,
			body: JSON.stringify({ message: 'Missing body' }),
		};
	}
	const body = JSON.parse(event.body);
	const { userId, email, name } = body;

	const item = {
		userId: { S: userId },
		email: { S: email },
		name: { S: name || 'Anonymous' },
		updatedAt: { S: new Date().toISOString() },
	};

	await dynamoClient.send(
		new PutItemCommand({
			TableName: process.env.USERS_TABLE,
			Item: item,
		}),
	);

	return {
		statusCode: 200,
		body: JSON.stringify({ message: 'User saved' }),
	};
}
