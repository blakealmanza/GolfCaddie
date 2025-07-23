import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { dynamoClient } from '../shared/dynamoClient';
import response from '../shared/response';

export async function handler() {
	try {
		const result = await dynamoClient.send(
			new ScanCommand({
				TableName: process.env.COURSES_TABLE,
			}),
		);

		return response(200, { courses: result.Items || [] });
	} catch (error) {
		console.error('Error listing courses:', error);
		return response(500, {
			message: 'Internal server error',
			error: (error as Error).message,
		});
	}
}
