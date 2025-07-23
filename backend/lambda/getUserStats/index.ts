import { ScanCommand } from '@aws-sdk/client-dynamodb';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { dynamoClient } from '../shared/dynamoClient';
import response from '../shared/response';

export async function handler(event: APIGatewayProxyEvent) {
	try {
		const userId = event.requestContext.authorizer?.claims?.sub;

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
		const totalRounds = rounds.length;

		return response(200, { totalRounds });
	} catch (error) {
		console.error('Error fetching user stats:', error);
		return response(500, {
			message: 'Internal server error',
			error: (error as Error).message,
		});
	}
}
