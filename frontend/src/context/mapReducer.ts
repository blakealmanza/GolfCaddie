import type { LatLng, SelectingMode, ShotSuggestion } from '@shared/types';

type MapState = {
	target: LatLng | null;
	suggestion: ShotSuggestion | null;
	userCoords: LatLng | null;
	selectingMode: SelectingMode;
};

type MapAction =
	| { type: 'SET_TARGET'; payload: LatLng | null }
	| { type: 'SET_SUGGESTION'; payload: ShotSuggestion | null }
	| { type: 'SET_USER_COORDS'; payload: LatLng | null }
	| { type: 'SET_SELECTING_MODE'; payload: SelectingMode };

export function mapReducer(state: MapState, action: MapAction): MapState {
	switch (action.type) {
		case 'SET_TARGET':
			return { ...state, target: action.payload };
		case 'SET_SUGGESTION':
			return { ...state, suggestion: action.payload };
		case 'SET_USER_COORDS':
			return { ...state, userCoords: action.payload };
		case 'SET_SELECTING_MODE':
			return { ...state, selectingMode: action.payload };
		default:
			return state;
	}
}
