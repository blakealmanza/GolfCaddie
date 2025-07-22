import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { dynamoClient } from '../shared/dynamoClient';

export async function handler() {
	const result = await dynamoClient.send(
		new ScanCommand({
			TableName: process.env.COURSES_TABLE,
		}),
	);

	return {
		statusCode: 200,
		body: JSON.stringify({ courses: result.Items || [] }),
	};
}
