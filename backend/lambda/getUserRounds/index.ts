import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import type { Round } from '@shared/types';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { dynamoClient } from '../shared/dynamoClient';
import response from '../shared/response';
import { validateUserId } from '../shared/validation';

export async function handler(event: APIGatewayProxyEvent) {
	try {
		const userId = validateUserId(event);

		const docClient = DynamoDBDocumentClient.from(dynamoClient);

		const result = await docClient.send(
			new QueryCommand({
				TableName: process.env.ROUNDS_TABLE,
				IndexName: 'userIdIndex',
				KeyConditionExpression: 'userId = :userId',
				ExpressionAttributeValues: {
					':userId': userId,
				},
				ScanIndexForward: false, // most recent rounds first
				Limit: 20,
			}),
		);

		const rounds = (result.Items as Round[]) || [];

		if (rounds.length === 0) {
			return response(404, { message: 'No previous rounds found' });
		}

		return response(200, { rounds });
	} catch (error) {
		console.error('Error fetching user rounds:', error);
		return response(500, {
			message: 'Failed to fetch previous rounds',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
}
