import { getDistance, type LatLng } from '../util/geoUtils';
import { suggestClub } from '../util/suggestClub';

export type SelectingMode = 'tee' | 'pin' | null;

export type ShotSuggestion = {
	club: string;
	distance: number;
} | null;

export type Hole = {
	tee: LatLng | null;
	pin: LatLng | null;
	par: number;
	shots: LatLng[];
};

export interface RoundState {
	selectedCourseId: string | null;
	holes: Hole[];
	currentHoleIndex: number;
	selectedHoleIndex: number;
	selectingMode: SelectingMode;
	targetCoords: LatLng | null;
	suggestion: ShotSuggestion;
	userCoords: LatLng | null;
}

export type RoundAction =
	| { type: 'SET_USER_COORDS'; payload: LatLng }
	| { type: 'SET_SELECTING_MODE'; payload: SelectingMode }
	| { type: 'SET_TARGET'; payload: LatLng | null }
	| { type: 'SET_TEE'; payload: LatLng }
	| { type: 'SET_PIN'; payload: LatLng }
	| { type: 'ADD_SHOT' }
	| { type: 'NEXT_HOLE' }
	| { type: 'PREVIOUS_HOLE' }
	| { type: 'SET_PAR'; payload: { index: number; par: number } }
	| {
			type: 'LOAD_COURSE';
			payload: {
				courseId: string;
				holes: { tee: LatLng | null; pin: LatLng | null; par: number }[];
			};
	  };

export const initialRoundState: RoundState = {
	selectedCourseId: null,
	holes: [
		{
			tee: null,
			pin: null,
			par: 4,
			shots: [],
		},
	],
	currentHoleIndex: 0,
	selectedHoleIndex: 0,
	selectingMode: 'tee',
	targetCoords: null,
	suggestion: null,
	userCoords: null,
};

export function roundReducer(
	state: RoundState,
	action: RoundAction,
): RoundState {
	switch (action.type) {
		case 'LOAD_COURSE': {
			const holes = action.payload.holes.map((hole) => ({
				tee: hole.tee,
				pin: hole.pin,
				par: hole.par,
				shots: [],
			}));
			return {
				...state,
				selectedCourseId: action.payload.courseId,
				holes,
				currentHoleIndex: 0,
				selectedHoleIndex: 0,
				selectingMode: holes.length === 0 ? 'tee' : null,
				targetCoords: null,
				suggestion: null,
			};
		}

		case 'SET_USER_COORDS':
			return { ...state, userCoords: action.payload };

		case 'SET_SELECTING_MODE':
			return { ...state, selectingMode: action.payload };

		case 'SET_TARGET': {
			const target = action.payload;
			let suggestion = null;
			if (target && state.userCoords) {
				const distance = Math.round(getDistance(state.userCoords, target));
				suggestion = {
					club: suggestClub(distance),
					distance,
				};
			}
			return { ...state, targetCoords: target, suggestion };
		}

		case 'SET_TEE': {
			const updatedHoles = [...state.holes];
			updatedHoles[state.currentHoleIndex] = {
				...updatedHoles[state.currentHoleIndex],
				tee: action.payload,
			};
			return {
				...state,
				holes: updatedHoles,
				selectingMode: 'pin',
			};
		}

		case 'SET_PIN': {
			const updatedHoles = [...state.holes];
			updatedHoles[state.currentHoleIndex] = {
				...updatedHoles[state.currentHoleIndex],
				pin: action.payload,
			};
			return {
				...state,
				holes: updatedHoles,
				selectingMode: null,
			};
		}

		case 'SET_PAR': {
			const { index, par } = action.payload;
			const updatedHoles = [...state.holes];
			updatedHoles[index] = { ...updatedHoles[index], par };
			return { ...state, holes: updatedHoles };
		}

		case 'ADD_SHOT': {
			if (!state.userCoords) return state;
			const updatedHoles = [...state.holes];
			const currentHole = updatedHoles[state.currentHoleIndex];
			updatedHoles[state.currentHoleIndex] = {
				...currentHole,
				shots: [...currentHole.shots, state.userCoords],
			};
			return { ...state, holes: updatedHoles, targetCoords: null };
		}

		case 'NEXT_HOLE': {
			const current = state.holes[state.currentHoleIndex];
			if (
				(!current.tee || !current.pin) &&
				state.currentHoleIndex === state.selectedHoleIndex
			) {
				// Cannot proceed to next hole until tee and pin are set
				return state;
			}

			const nextIndex = state.selectedHoleIndex + 1;
			const withinBounds = nextIndex < state.holes.length;

			if (withinBounds) {
				return {
					...state,
					selectedHoleIndex: nextIndex,
					currentHoleIndex:
						nextIndex > state.currentHoleIndex
							? nextIndex
							: state.currentHoleIndex,
				};
			}

			// Only create a new hole if moving past the last index
			return {
				...state,
				currentHoleIndex: nextIndex,
				selectedHoleIndex: nextIndex,
				holes: [...state.holes, { tee: null, pin: null, par: 0, shots: [] }],
				selectingMode: 'tee',
				targetCoords: null,
				suggestion: null,
			};
		}

		case 'PREVIOUS_HOLE': {
			const newIndex = Math.max(0, state.selectedHoleIndex - 1);
			return {
				...state,
				selectedHoleIndex: newIndex,
			};
		}

		default:
			return state;
	}
}
