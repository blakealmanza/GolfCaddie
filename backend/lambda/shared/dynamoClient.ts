import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
export const dynamoClient = new DynamoDBClient({
	region: process.env.AWS_REGION || 'us-west-2',
});
