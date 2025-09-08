import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { dynamoClient } from '../shared/dynamoClient';
import response from '../shared/response';

export async function handler(event: APIGatewayProxyEvent) {
	try {
		if (event.pathParameters === null) {
			return response(400, { message: 'Missing path parameters' });
		}
		const roundId = event.pathParameters.roundId;
		const now = new Date().toISOString();

		const docClient = DynamoDBDocumentClient.from(dynamoClient);

		try {
			await docClient.send(
				new UpdateCommand({
					TableName: process.env.ROUNDS_TABLE,
					Key: { roundId },
					UpdateExpression: 'SET #state = :state, endedAt = :endedAt',
					ExpressionAttributeNames: { '#state': 'state' },
					ExpressionAttributeValues: {
						':state': 'finished',
						':endedAt': now,
					},
				}),
			);
		} catch (sendError) {
			console.error('Error updating round in DynamoDB:', sendError);

			return response(500, {
				message: 'Failed to end round',
				error:
					sendError instanceof Error
						? sendError.message
						: 'Unknown DynamoDB error',
			});
		}

		return response(200, { message: 'Round ended' });
	} catch (error) {
		console.error('Error ending round:', error);

		return response(500, {
			message: 'Failed to end round',
			error: error instanceof Error ? error.message : 'Unknown error occurred',
		});
	}
}
