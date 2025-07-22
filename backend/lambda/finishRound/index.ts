import {
	type AttributeValue,
	UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { dynamoClient } from '../shared/dynamoClient';

export async function handler(event: APIGatewayProxyEvent) {
	if (event.pathParameters === null) {
		return {
			statusCode: 400,
			body: JSON.stringify({ message: 'Missing path parameters' }),
		};
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

	return {
		statusCode: 200,
		body: JSON.stringify({ message: 'Round finished' }),
	};
}
