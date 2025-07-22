import { type AttributeValue, GetItemCommand } from '@aws-sdk/client-dynamodb';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { dynamoClient } from '../shared/dynamoClient';

export async function handler(event: APIGatewayProxyEvent) {
	if (event.pathParameters === null) {
		return {
			statusCode: 400,
			body: JSON.stringify({ message: 'Missing path parameters' }),
		};
	}
	const courseId = event.pathParameters.id;

	const result = await dynamoClient.send(
		new GetItemCommand({
			TableName: process.env.COURSES_TABLE,
			Key: { courseId: { S: courseId } as AttributeValue },
		}),
	);

	if (!result.Item) {
		return {
			statusCode: 404,
			body: JSON.stringify({ message: 'Course not found' }),
		};
	}

	return {
		statusCode: 200,
		body: JSON.stringify({ course: result.Item }),
	};
}
