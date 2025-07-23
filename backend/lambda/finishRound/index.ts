import {
	type AttributeValue,
	UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
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

		await dynamoClient.send(
			new UpdateItemCommand({
				TableName: process.env.ROUNDS_TABLE,
				Key: { roundId: { S: roundId } as AttributeValue },
				UpdateExpression: 'SET #status = :status, finishedAt = :finishedAt',
				ExpressionAttributeNames: { '#status': 'status' },
				ExpressionAttributeValues: {
					':status': { S: 'COMPLETED' },
					':finishedAt': { S: now },
				},
			}),
		);

		return response(200, { message: 'Round finished' });
	} catch (error) {
		console.error('Error finishing round:', error);
		return response(500, {
			message: 'Internal server error',
			error: (error as Error).message,
		});
	}
}
