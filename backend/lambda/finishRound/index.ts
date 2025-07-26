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
					UpdateExpression: 'SET #status = :status, finishedAt = :finishedAt',
					ExpressionAttributeNames: { '#status': 'status' },
					ExpressionAttributeValues: {
						':status': 'COMPLETED',
						':finishedAt': now,
					},
				}),
			);
		} catch (sendError) {
			console.error('Error updating round in DynamoDB:', sendError);

			return response(500, {
				message: 'Failed to update round',
				error:
					sendError instanceof Error
						? sendError.message
						: 'Unknown DynamoDB error',
			});
		}

		return response(200, { message: 'Round finished' });
	} catch (error) {
		console.error('Error finishing round:', error);

		return response(500, {
			message: 'Failed to finish round',
			error: error instanceof Error ? error.message : 'Unknown error occurred',
		});
	}
}
