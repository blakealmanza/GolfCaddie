import type { Round, RoundHole } from '@shared/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
			'Content-Type': 'application/json',
			Authorization: `Bearer ${idToken}`,
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to end round ${roundId}: ${response.statusText}`);
	}
}

export async function pauseRound(
	roundId: string,
	idToken: string,
): Promise<void> {
	const response = await fetch(`${API_BASE_URL}/rounds/${roundId}/pause`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${idToken}`,
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to pause round ${roundId}: ${response.statusText}`);
	}
}

// Mutation hooks for ending and pausing rounds
export function useEndRound() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ roundId, idToken }: { roundId: string; idToken: string }) =>
			endRound(roundId, idToken),
		onSuccess: () => {
			// Invalidate and refetch rounds list
			queryClient.invalidateQueries({ queryKey: ['rounds'] });
		},
	});
}

export function usePauseRound() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ roundId, idToken }: { roundId: string; idToken: string }) =>
			pauseRound(roundId, idToken),
		onSuccess: () => {
			// Invalidate and refetch rounds list
			queryClient.invalidateQueries({ queryKey: ['rounds'] });
		},
	});
}

export async function fetchUserRounds(idToken: string): Promise<Round[]> {
	const response = await fetch(`${API_BASE_URL}/rounds`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${idToken}`,
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch rounds: ${response.statusText}`);
	}

	const data = await response.json();
	return data.rounds;
}
