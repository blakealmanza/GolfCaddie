import { createContext, type ReactNode, useContext, useReducer } from 'react';
import {
	initialRoundState,
	type RoundAction,
	type RoundState,
	roundReducer,
} from './roundReducer';

// import { usePersistedReducer } from './usePersistedReducer';

interface RoundContextType {
	state: RoundState;
	dispatch: React.Dispatch<RoundAction>;
}

const RoundContext = createContext<RoundContextType | undefined>(undefined);

export function RoundProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(roundReducer, initialRoundState);

	return (
		<RoundContext.Provider value={{ state, dispatch }}>
			{children}
		</RoundContext.Provider>
	);
}

export function useRound() {
	const ctx = useContext(RoundContext);
	if (!ctx) throw new Error('useRound must be used inside a RoundProvider');
	return ctx;
}
