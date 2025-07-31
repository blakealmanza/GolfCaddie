import type { LatLng, SelectingMode, ShotSuggestion } from '@shared/types';
import { createContext, type ReactNode, useContext, useReducer } from 'react';

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

const initialState: MapState = {
	target: null,
	suggestion: null,
	userCoords: null,
	selectingMode: 'tee',
};

function mapReducer(state: MapState, action: MapAction): MapState {
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

const MapContext = createContext<{
	state: MapState;
	dispatch: React.Dispatch<MapAction>;
} | null>(null);

export function MapProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(mapReducer, initialState);
	return (
		<MapContext.Provider value={{ state, dispatch }}>
			{children}
		</MapContext.Provider>
	);
}

export function useMap() {
	const context = useContext(MapContext);
	if (!context) throw new Error('useMap must be used within a MapProvider');
	return context;
}
