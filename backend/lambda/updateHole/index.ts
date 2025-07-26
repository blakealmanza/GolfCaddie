import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { RoundHole } from '@shared/types';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { dynamoClient } from '../shared/dynamoClient';
import response from '../shared/response';

export async function handler(event: APIGatewayProxyEvent) {
	try {
		if (event.body === null) {
			return response(400, { message: 'Missing body' });
		}
		if (!event.pathParameters?.roundId || !event.pathParameters?.holeIndex) {
			return response(400, { message: 'Missing path parameters' });
		}

		const roundId = event.pathParameters.roundId;
		const holeIndex = Number(event.pathParameters.holeIndex);
		const holeData: RoundHole = JSON.parse(event.body);

		const docClient = DynamoDBDocumentClient.from(dynamoClient);

		try {
			await docClient.send(
				new UpdateCommand({
					TableName: process.env.ROUNDS_TABLE,
					Key: { roundId },
					UpdateExpression: `SET holes[${holeIndex}] = :holeData`,
					ExpressionAttributeValues: {
						':holeData': holeData,
					},
				}),
			);

			return response(200, { message: 'Hole updated' });
		} catch (sendError) {
			console.error('Error updating hole in DynamoDB:', sendError);

			return response(500, {
				message: 'Failed to update hole',
				error: sendError instanceof Error ? sendError.message : 'Unknown error',
			});
		}
	} catch (error) {
		console.error('Error updating hole:', error);

		return response(500, {
			message: 'Failed to update hole',
			error: error instanceof Error ? error.message : 'Unknown error occurred',
		});
	}
}
