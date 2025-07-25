import { GetItemCommand } from '@aws-sdk/client-dynamodb';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { dynamoClient } from '../shared/dynamoClient';
import response from '../shared/response';

export async function handler(event: APIGatewayProxyEvent) {
	try {
		const roundId = event.pathParameters?.roundId;

		if (!roundId) {
			return response(400, { message: 'Missing roundId in path' });
		}

		const result = await dynamoClient.send(
			new GetItemCommand({
				TableName: process.env.ROUNDS_TABLE,
				Key: {
					roundId: { S: roundId },
				},
			}),
		);

		if (!result.Item) {
			return response(404, { message: 'Round not found' });
		}

		return response(200, {
			round: result.Item,
		});
	} catch (error) {
		console.error('Error fetching round:', error);
		return response(500, { message: 'Internal server error' });
	}
}
