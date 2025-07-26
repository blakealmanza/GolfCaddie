import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import type { Course } from '@shared/types';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { dynamoClient } from '../shared/dynamoClient';
import response from '../shared/response';

export async function handler(event: APIGatewayProxyEvent) {
	try {
		if (event.pathParameters === null) {
			return response(400, { message: 'Missing path parameters' });
		}
		const courseId = event.pathParameters.id;

		const docClient = DynamoDBDocumentClient.from(dynamoClient);

		try {
			const result = await docClient.send(
				new GetCommand({
					TableName: process.env.COURSES_TABLE,
					Key: { courseId },
				}),
			);

			const course = result.Item as Course | undefined;

			if (!course) {
				return response(404, { message: 'Course not found' });
			}

			return response(200, { course });
		} catch (sendError) {
			console.error('Error fetching course from DynamoDB:', sendError);

			return response(500, {
				message: 'Failed to fetch course',
				error: sendError instanceof Error ? sendError.message : 'Unknown error',
			});
		}
	} catch (error) {
		console.error('Error fetching course:', error);

		return response(500, {
			message: 'Failed to fetch course',
			error: error instanceof Error ? error.message : 'Unknown error occurred',
		});
	}
}
