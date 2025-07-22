import { ScanCommand } from '@aws-sdk/client-dynamodb';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { dynamoClient } from '../shared/dynamoClient';

export async function handler(event: APIGatewayProxyEvent) {
	const userId = event.queryStringParameters?.userId;

	if (!userId) {
		return {
			statusCode: 400,
			body: JSON.stringify({ message: 'Missing userId' }),
		};
	}

	// Example: scan rounds table for rounds by userId
	const result = await dynamoClient.send(
		new ScanCommand({
			TableName: process.env.ROUNDS_TABLE,
			FilterExpression: 'userId = :u',
			ExpressionAttributeValues: {
				':u': { S: userId },
			},
		}),
	);

	const rounds = result.Items || [];

	// Build stats summary here (simplified)
	const totalRounds = rounds.length;

	return {
		statusCode: 200,
		body: JSON.stringify({ totalRounds }),
	};
}
