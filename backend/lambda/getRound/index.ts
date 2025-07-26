import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import type { Round } from '@shared/types';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { dynamoClient } from '../shared/dynamoClient';
import response from '../shared/response';

export async function handler(event: APIGatewayProxyEvent) {
	try {
		const roundId = event.pathParameters?.roundId;

		if (!roundId) {
			return response(400, { message: 'Missing roundId in path' });
		}

		const docClient = DynamoDBDocumentClient.from(dynamoClient);

		try {
			const result = await docClient.send(
				new GetCommand({
					TableName: process.env.ROUNDS_TABLE,
					Key: {
						roundId,
					},
				}),
			);

			const round = result.Item as Round | undefined;

			if (!round) {
				return response(404, { message: 'Round not found' });
			}

			return response(200, {
				round,
			});
		} catch (sendError) {
			console.error('Error fetching round from DynamoDB:', sendError);

			return response(500, {
				message: 'Failed to fetch round',
				error: sendError instanceof Error ? sendError.message : 'Unknown error',
			});
		}
	} catch (error) {
		console.error('Error fetching round:', error);

		return response(500, {
			message: 'Failed to fetch round',
			error: error instanceof Error ? error.message : 'Unknown error occurred',
		});
	}
}
