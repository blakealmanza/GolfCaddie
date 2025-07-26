import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { dynamoClient } from '../shared/dynamoClient';
import response from '../shared/response';

export async function handler(event: APIGatewayProxyEvent) {
	try {
		const userId = event.requestContext.authorizer?.claims?.sub;

		const docClient = DynamoDBDocumentClient.from(dynamoClient);

		try {
			const result = await docClient.send(
				new ScanCommand({
					TableName: process.env.ROUNDS_TABLE,
					FilterExpression: 'userId = :u',
					ExpressionAttributeValues: {
						':u': userId,
					},
				}),
			);

			const rounds = result.Items || [];
			const totalRounds = rounds.length;

			return response(200, { totalRounds });
		} catch (sendError) {
			console.error('Error fetching user stats from DynamoDB:', sendError);

			return response(500, {
				message: 'Failed to fetch user stats',
				error: sendError instanceof Error ? sendError.message : 'Unknown error',
			});
		}
	} catch (error) {
		console.error('Error fetching user stats:', error);

		return response(500, {
			message: 'Failed to fetch user stats',
			error: error instanceof Error ? error.message : 'Unknown error occurred',
		});
	}
}
