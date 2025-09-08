import type { LatLng } from './geo';

export type ShotSuggestion = {
	club: string;
	distance: number;
} | null;

export type Shot = {
	position: LatLng;
	target: LatLng | null;
	suggestion: ShotSuggestion;
};

export type RoundHole = {
	tee: LatLng | null;
	pin: LatLng | null;
	par: number;
	shots: Shot[];
	score?: number | null; // Score to par for this hole
};

export type RoundState = 'in_progress' | 'finished' | 'paused';

export type Round = {
	roundId: string;
	userId: string;
	courseId: string;
	courseName: string;
	courseLocation: string;
	startedAt: string;
	endedAt?: string;
	state: RoundState;
	holes: RoundHole[];
};
