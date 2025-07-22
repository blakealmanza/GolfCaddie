import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import type { CourseHole } from '../../../frontend/src/types/course';
import { dynamoClient } from '../shared/dynamoClient';

export async function handler(event: APIGatewayProxyEvent) {
	if (event.body === null) {
		return {
			statusCode: 400,
			body: JSON.stringify({ message: 'Missing body' }),
		};
	}
	const body = JSON.parse(event.body);
	const courseId = uuidv4();

	const item = {
		courseId: { S: courseId },
		name: { S: body.name },
		holes: { L: (body.holes || []).map(convertHoleToDynamo) },
		createdBy: { S: body.userId || 'unknown' },
	};

	await dynamoClient.send(
		new PutItemCommand({
			TableName: process.env.COURSES_TABLE,
			Item: item,
		}),
	);

	return {
		statusCode: 201,
		body: JSON.stringify({ courseId }),
	};
}

function convertHoleToDynamo(hole: CourseHole) {
	return {
		M: {
			tee: hole.tee
				? {
						M: {
							lat: { N: hole.tee.lat.toString() },
							lng: { N: hole.tee.lng.toString() },
						},
					}
				: { NULL: true },
			pin: hole.pin
				? {
						M: {
							lat: { N: hole.pin.lat.toString() },
							lng: { N: hole.pin.lng.toString() },
						},
					}
				: { NULL: true },
			par: { N: hole.par.toString() },
		},
	};
}
