import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import type { Course } from '@shared/types';
import { dynamoClient } from '../shared/dynamoClient';
import response from '../shared/response';

export async function handler() {
	try {
		const docClient = DynamoDBDocumentClient.from(dynamoClient);

		try {
			const result = await docClient.send(
				new ScanCommand({
					TableName: process.env.COURSES_TABLE,
				}),
			);

			const courses = (result.Items as Course[]) || undefined;

			if (!courses) {
				return response(404, { message: 'Courses not found' });
			}

			return response(200, {
				courses,
			});
		} catch (sendError) {
			console.error('Error fetching courses from DynamoDB:', sendError);

			return response(500, {
				message: 'Failed to fetch courses',
				error: sendError instanceof Error ? sendError.message : 'Unknown error',
			});
		}
	} catch (error) {
		console.error('Error listing courses:', error);

		return response(500, {
			message: 'Failed to list courses',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
}
