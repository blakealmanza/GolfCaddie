import type { Round, RoundHole, Shot } from '@shared/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
	return data.round;
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
			method: 'PATCH',
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
