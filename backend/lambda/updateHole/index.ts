import {
	type AttributeValue,
	UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import type { RoundHole } from '../../../frontend/src/types/round';
import { dynamoClient } from '../shared/dynamoClient';

export async function handler(event: APIGatewayProxyEvent) {
	if (event.body === null) {
		return {
			statusCode: 400,
			body: JSON.stringify({ message: 'Missing body' }),
		};
	}
	if (event.pathParameters === null) {
		return {
			statusCode: 400,
			body: JSON.stringify({ message: 'Missing path parameters' }),
		};
	}
	const roundId = event.pathParameters.roundId;
	const holeData = JSON.parse(event.body);
	const holeIndex = holeData.index; // expected

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

	return {
		statusCode: 200,
		body: JSON.stringify({ message: 'Hole updated' }),
	};
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
