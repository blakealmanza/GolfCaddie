import type { LatLng, RoundHole, Shot } from '@/types';

type HoleAction =
	| { type: 'SET_TEE'; payload: LatLng }
	| { type: 'SET_PIN'; payload: LatLng }
	| { type: 'SET_PAR'; payload: number }
	| {
			type: 'ADD_SHOT';
			payload: Shot;
	  }
	| { type: 'RESET_HOLE' };

export function holeReducer(hole: RoundHole, action: HoleAction): RoundHole {
	switch (action.type) {
		case 'SET_TEE':
			return { ...hole, tee: action.payload };

		case 'SET_PIN':
			return { ...hole, pin: action.payload };

		case 'SET_PAR':
			return { ...hole, par: action.payload };

		case 'ADD_SHOT':
			return {
				...hole,
				shots: [...hole.shots, action.payload],
			};

		case 'RESET_HOLE':
			return {
				tee: null,
				pin: null,
				par: 0,
				shots: [],
			};

		default:
			return hole;
	}
}
