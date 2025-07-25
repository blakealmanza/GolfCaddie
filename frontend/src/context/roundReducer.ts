import type { Round, RoundHole, SelectingMode, Shot } from '@shared/types';
import type { LatLng } from '../util/geoUtils';
import { holeReducer } from './holeReducer';

export interface RoundState {
	holes: RoundHole[];
	currentHoleIndex: number;
	selectedHoleIndex: number;
}

export type RoundAction =
	| { type: 'SET_USER_COORDS'; payload: LatLng }
	| { type: 'SET_SELECTING_MODE'; payload: SelectingMode }
	| { type: 'SET_TARGET'; payload: LatLng | null }
	| { type: 'SET_TEE'; payload: LatLng }
	| { type: 'SET_PIN'; payload: LatLng }
	| { type: 'ADD_SHOT'; payload: Shot }
	| { type: 'NEXT_HOLE' }
	| { type: 'PREVIOUS_HOLE' }
	| { type: 'SET_PAR'; payload: number }
	| {
			type: 'INITIALIZE_ROUND';
			payload: {
				round: Round;
			};
	  };

export const initialRoundState: RoundState = {
	holes: [
		{
			tee: null,
			pin: null,
			par: 4,
			shots: [] as Shot[],
		},
	],
	currentHoleIndex: 0,
	selectedHoleIndex: 0,
};

export function roundReducer(
	state: RoundState,
	action: RoundAction,
): RoundState {
	switch (action.type) {
		case 'INITIALIZE_ROUND': {
			const initialRoundHoles = action.payload.round.holes;
			return {
				...state,
				holes: initialRoundHoles,
				currentHoleIndex: 0,
				selectedHoleIndex: 0,
			};
		}

		case 'SET_TEE': {
			const updatedHoles = [...state.holes];
			updatedHoles[state.currentHoleIndex] = holeReducer(
				updatedHoles[state.currentHoleIndex],
				{ type: 'SET_TEE', payload: action.payload },
			);
			return {
				...state,
				holes: updatedHoles,
			};
		}

		case 'SET_PIN': {
			const updatedHoles = [...state.holes];
			updatedHoles[state.currentHoleIndex] = holeReducer(
				updatedHoles[state.currentHoleIndex],
				{ type: 'SET_PIN', payload: action.payload },
			);
			return {
				...state,
				holes: updatedHoles,
			};
		}

		case 'SET_PAR': {
			const updatedHoles = [...state.holes];
			updatedHoles[state.currentHoleIndex] = holeReducer(
				updatedHoles[state.currentHoleIndex],
				{
					type: 'SET_PAR',
					payload: action.payload,
				},
			);
			return { ...state, holes: updatedHoles };
		}

		case 'ADD_SHOT': {
			const { position, target, suggestion } = action.payload;

			const updatedHoles = [...state.holes];
			updatedHoles[state.currentHoleIndex] = holeReducer(
				updatedHoles[state.currentHoleIndex],
				{
					type: 'ADD_SHOT',
					payload: {
						position,
						target,
						suggestion,
					},
				},
			);
			return {
				...state,
				holes: updatedHoles,
			};
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
				holes: [
					...state.holes,
					{ tee: null, pin: null, par: 0, shots: [] as Shot[] },
				],
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
