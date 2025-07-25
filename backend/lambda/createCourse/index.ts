import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import type { CourseHole } from '@shared/types';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { dynamoClient } from '../shared/dynamoClient';
import response from '../shared/response';

export async function handler(event: APIGatewayProxyEvent) {
	try {
		if (event.body === null) {
			return response(400, { message: 'Missing body' });
		}
		const body = JSON.parse(event.body);
		const userId = event.requestContext.authorizer?.claims?.sub;
		const courseId = uuidv4();

		const item = {
			courseId: { S: courseId },
			name: { S: body.name },
			holes: { L: (body.holes || []).map(convertHoleToDynamo) },
			createdBy: { S: userId },
		};

		await dynamoClient.send(
			new PutItemCommand({
				TableName: process.env.COURSES_TABLE,
				Item: item,
			}),
		);

		return response(201, { courseId });
	} catch (error) {
		return response(500, {
			message: 'Internal server error',
			error: (error as Error).message,
		});
	}
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
