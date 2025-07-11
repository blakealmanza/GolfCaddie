import type { CourseHole, Round } from '@/types';

const ROUNDS: Record<string, Round> = {};

export async function createRound(
	courseId: string,
	holes: CourseHole[],
): Promise<Round> {
	const roundId = `round_${Date.now()}`;
	const roundHoles = holes.map((hole) => ({
		tee: hole.tee,
		pin: hole.pin,
		par: hole.par,
		shots: [],
	}));

	const newRound: Round = {
		roundId,
		userId: '123',
		courseId,
		holes: roundHoles,
		startedAt: Date.now(),
	};

	ROUNDS[roundId] = newRound;
	return Promise.resolve(newRound);
}

export async function fetchRoundById(roundId: string): Promise<Round> {
	const round = ROUNDS[roundId];
	if (!round) {
		throw new Error(`Round with ID "${roundId}" not found.`);
	}
	return Promise.resolve(round);
}
