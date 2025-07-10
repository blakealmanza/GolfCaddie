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
};

export type Round = {
	roundId: string;
	userId: string;
	courseId: string;
	startedAt: number;
	endedAt: number;
	holes: RoundHole[];
};
