import { useEffect, useReducer } from 'react';

export function usePersistedReducer<R extends React.Reducer<any, any>>(
	reducer: R,
	key: string,
	initialState: React.ReducerState<R>,
): [React.ReducerState<R>, React.Dispatch<any>] {
	const persisted = localStorage.getItem(key);
	const parsed = persisted ? JSON.parse(persisted) : null;
	const mergedState = parsed
		? { ...initialState, holes: parsed.holes }
		: initialState;

	const [state, dispatch] = useReducer(reducer, mergedState);

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify({ holes: state.holes }));
	}, [state.holes, key]);

	return [state, dispatch];
}
