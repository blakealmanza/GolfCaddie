import type { Round, RoundHole, Shot } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function parseDynamoRound(item: any): Round {
	return {
		roundId: item.roundId.S,
		userId: item.userId.S,
		startedAt: item.startedAt.S,
		courseId: item.courseId?.S ?? null,
		holes:
			item.holes?.L.map(
				(hole: any): RoundHole => ({
					tee: hole.M.tee.NULL
						? null
						: {
								lat: parseFloat(hole.M.tee.M.lat.N),
								lng: parseFloat(hole.M.tee.M.lng.N),
							},
					pin: hole.M.pin.NULL
						? null
						: {
								lat: parseFloat(hole.M.pin.M.lat.N),
								lng: parseFloat(hole.M.pin.M.lng.N),
							},
					par: parseInt(hole.M.par.N),
					shots: hole.M.shots.L.map(
						(shot: any): Shot => ({
							position: {
								lat: parseFloat(shot.M.position.M.lat.N),
								lng: parseFloat(shot.M.position.M.lng.N),
							},
							target: shot.M.target.NULL
								? null
								: {
										lat: parseFloat(shot.M.target.M.lat.N),
										lng: parseFloat(shot.M.target.M.lng.N),
									},
							suggestion: {
								club: shot.M.suggestion.M.club.S,
								distance: parseFloat(shot.M.suggestion.M.distance.N),
							},
						}),
					),
				}),
			) ?? [],
	};
}

export async function createRound(
	courseId: string | null,
	idToken: string,
): Promise<Round> {
	const response = await fetch(`${API_BASE_URL}/rounds`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${idToken}`,
		},
		body: JSON.stringify({ courseId }),
	});

	if (!response.ok) {
		throw new Error(`Failed to create round: ${response}`);
	}

	const data = await response.json();
	return data;
}

export async function fetchRoundById(
	roundId: string,
	idToken: string,
): Promise<Round> {
	const response = await fetch(`${API_BASE_URL}/rounds/${roundId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${idToken}`,
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch round: ${response.statusText}`);
	}

	const data = await response.json();
	return parseDynamoRound(data.round);
}

export async function updateHoleInRound(
	roundId: string,
	holeIndex: number,
	holeData: RoundHole,
	idToken: string,
): Promise<void> {
	const response = await fetch(
		`${API_BASE_URL}/rounds/${roundId}/holes/${holeIndex}`,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${idToken}`,
			},
			body: JSON.stringify(holeData),
		},
	);

	if (!response.ok) {
		throw new Error(
			`Failed to update hole ${holeIndex} in round ${roundId}: ${response.statusText}`,
		);
	}
}

export async function endRound(
	roundId: string,
	idToken: string,
): Promise<void> {
	const response = await fetch(`${API_BASE_URL}/rounds/${roundId}/end`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${idToken}`,
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to end round ${roundId}: ${response.statusText}`);
	}
}
