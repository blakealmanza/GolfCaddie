import { useEffect, useReducer } from 'react';

export function usePersistedReducer<R extends React.Reducer<any, any>>(
	reducer: R,
	key: string,
	initialState: React.ReducerState<R>,
): [React.ReducerState<R>, React.Dispatch<any>] {
	const persisted = localStorage.getItem(key);
	const parsed = persisted ? JSON.parse(persisted) : null;
	const mergedState = parsed
		? { ...initialState, roundShots: parsed.roundShots }
		: initialState;

	const [state, dispatch] = useReducer(reducer, mergedState);

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify({ roundShots: state.roundShots }));
	}, [state.roundShots, key]);

	return [state, dispatch];
}
