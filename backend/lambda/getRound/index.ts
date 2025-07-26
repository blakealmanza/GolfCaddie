import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { Round } from '@shared/types';
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
	} catch (error) {
		console.error('Error fetching round:', error);
		return response(500, { message: 'Internal server error' });
	}
}
