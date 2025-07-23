import { type AttributeValue, GetItemCommand } from '@aws-sdk/client-dynamodb';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { dynamoClient } from '../shared/dynamoClient';
import response from '../shared/response';

export async function handler(event: APIGatewayProxyEvent) {
	try {
		if (event.pathParameters === null) {
			return response(400, { message: 'Missing path parameters' });
		}
		const courseId = event.pathParameters.id;

		const result = await dynamoClient.send(
			new GetItemCommand({
				TableName: process.env.COURSES_TABLE,
				Key: { courseId: { S: courseId } as AttributeValue },
			}),
		);

		if (!result.Item) {
			return response(404, { message: 'Course not found' });
		}

		return response(200, { course: result.Item });
	} catch (error) {
		console.error('Error fetching course:', error);
		return response(500, {
			message: 'Internal server error',
			error: (error as Error).message,
		});
	}
}
