const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient();
const db = DynamoDBDocumentClient.from(client);

exports.handler = async (event: { body: string }) => {
	const { roundId, timestamp, lat, lng, club } = JSON.parse(event.body);

	await db.send(
		new PutCommand({
			TableName: process.env.SHOTS_TABLE,
			Item: { roundId, timestamp, lat, lng, club },
		}),
	);

	return {
		statusCode: 200,
		body: JSON.stringify({ success: true }),
	};
};
