import { getDistance, type LatLng } from '../util/geoUtils';
import { suggestClub } from '../util/suggestClub';

export type SelectingMode = 'tee' | 'pin' | null;

export type ShotSuggestion = {
	club: string;
	distance: number;
} | null;

export type CourseHole = {
	tee: LatLng | null;
	pin: LatLng | null;
	par: number;
};

export type Hole = {
	shots: LatLng[];
};

export interface RoundState {
	selectedCourseId: string | null;
	courseHoles: CourseHole[];
	roundShots: Hole[];
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
			payload: { courseId: string; courseHoles: CourseHole[] };
	  };

export const initialRoundState: RoundState = {
	selectedCourseId: null,
	courseHoles: [],
	roundShots: [],
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
	// const currentCourseHole = state.courseHoles[state.currentHoleIndex];
	// const currentRoundShots = state.roundShots[state.currentHoleIndex];

	switch (action.type) {
		case 'LOAD_COURSE': {
			const roundShots = action.payload.courseHoles.map(() => ({ shots: [] }));
			return {
				...state,
				selectedCourseId: action.payload.courseId,
				courseHoles: action.payload.courseHoles,
				roundShots,
				currentHoleIndex: 0,
				selectedHoleIndex: 0,
				selectingMode: roundShots.length === 0 ? 'tee' : null,
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
			const updatedCourseHoles = [...state.courseHoles];
			updatedCourseHoles[state.currentHoleIndex] = {
				...updatedCourseHoles[state.currentHoleIndex],
				tee: action.payload,
			};
			return {
				...state,
				courseHoles: updatedCourseHoles,
				selectingMode: 'pin',
			};
		}

		case 'SET_PIN': {
			const updatedCourseHoles = [...state.courseHoles];
			updatedCourseHoles[state.currentHoleIndex] = {
				...updatedCourseHoles[state.currentHoleIndex],
				pin: action.payload,
			};
			return {
				...state,
				courseHoles: updatedCourseHoles,
				selectingMode: null,
			};
		}

		case 'SET_PAR': {
			const { index, par } = action.payload;
			const updatedCourseHoles = [...state.courseHoles];
			updatedCourseHoles[index] = { ...updatedCourseHoles[index], par };
			return { ...state, courseHoles: updatedCourseHoles };
		}

		case 'ADD_SHOT': {
			if (!state.userCoords) return state;
			const updatedRoundShots = [...state.roundShots];
			const currentShots =
				updatedRoundShots[state.currentHoleIndex]?.shots || [];
			updatedRoundShots[state.currentHoleIndex] = {
				shots: [...currentShots, state.userCoords],
			};
			return { ...state, roundShots: updatedRoundShots, targetCoords: null };
		}

		case 'NEXT_HOLE': {
			const current = state.courseHoles[state.currentHoleIndex];
			if (
				(!current.tee || !current.pin) &&
				state.currentHoleIndex === state.selectedHoleIndex
			) {
				// Cannot proceed to next hole until tee and pin are set
				return state;
			}

			const nextIndex = state.selectedHoleIndex + 1;
			const withinBounds = nextIndex < state.courseHoles.length;

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
				courseHoles: [...state.courseHoles, { tee: null, pin: null, par: 0 }],
				roundShots: [...state.roundShots, { shots: [] }],
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
