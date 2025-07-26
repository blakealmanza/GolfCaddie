import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { dynamoClient } from '../shared/dynamoClient';
import response from '../shared/response';

export async function handler(event: APIGatewayProxyEvent) {
	try {
		if (event.body === null) {
			return response(400, { message: 'Missing body' });
		}
		const body = JSON.parse(event.body);
		const { email, name } = body;
		const userId = event.requestContext.authorizer?.claims?.sub;

		const docClient = DynamoDBDocumentClient.from(dynamoClient);

		const item = {
			userId,
			email,
			name: name || 'Anonymous',
			updatedAt: new Date().toISOString(),
		};

		await docClient.send(
			new PutCommand({
				TableName: process.env.USERS_TABLE,
				Item: item,
			}),
		);

		return response(200, { message: 'User saved' });
	} catch (error) {
		console.error('Error saving user:', error);
		return response(500, {
			message: 'Internal server error',
			error: (error as Error).message,
		});
	}
}
