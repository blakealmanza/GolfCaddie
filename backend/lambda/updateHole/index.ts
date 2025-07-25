import {
	type AttributeValue,
	UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import type { RoundHole } from '@shared/types';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { dynamoClient } from '../shared/dynamoClient';
import response from '../shared/response';

export async function handler(event: APIGatewayProxyEvent) {
	try {
		if (event.body === null) {
			return response(400, { message: 'Missing body' });
		}
		if (event.pathParameters === null) {
			return response(400, { message: 'Missing path parameters' });
		}
		const roundId = event.pathParameters.roundId;
		const holeIndex = event.pathParameters.holeIndex;
		const holeData = JSON.parse(event.body);

		const updateExpr = `SET holes[${holeIndex}] = :holeData`;
		const exprValues: Record<string, AttributeValue> = {
			':holeData': convertHoleToDynamo(holeData),
		};

		await dynamoClient.send(
			new UpdateItemCommand({
				TableName: process.env.ROUNDS_TABLE,
				Key: { roundId: { S: roundId } as AttributeValue },
				UpdateExpression: updateExpr,
				ExpressionAttributeValues: exprValues,
			}),
		);

		return response(200, { message: 'Hole updated' });
	} catch (error) {
		console.error('Error updating hole:', error);
		return response(500, {
			message: 'Internal server error',
			error: (error as Error).message,
		});
	}
}

function convertHoleToDynamo(hole: RoundHole): AttributeValue {
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
			shots: {
				L: hole.shots.map((shot) => ({
					M: {
						position: {
							M: {
								lat: { N: shot.position.lat.toString() },
								lng: { N: shot.position.lng.toString() },
							},
						},
						target: shot.target
							? {
									M: {
										lat: { N: shot.target.lat.toString() },
										lng: { N: shot.target.lng.toString() },
									},
								}
							: { NULL: true },
						suggestion: shot.suggestion
							? {
									M: {
										club: { S: shot.suggestion.club },
										distance: {
											N: shot.suggestion.distance.toString(),
										},
									},
								}
							: { NULL: true },
					},
				})),
			},
		},
	};
}
