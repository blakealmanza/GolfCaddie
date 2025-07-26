import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import type { Course } from '@shared/types';
import { dynamoClient } from '../shared/dynamoClient';
import response from '../shared/response';

export async function handler() {
	try {
		const docClient = DynamoDBDocumentClient.from(dynamoClient);

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
	} catch (error) {
		console.error('Error listing courses:', error);
		return response(500, {
			message: 'Internal server error',
			error: (error as Error).message,
		});
	}
}
