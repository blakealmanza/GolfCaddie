import { useRound } from '../../context/RoundContext';

export default function HoleInfoPanel() {
	const { state, dispatch } = useRound();
	const { currentHoleIndex, selectedHoleIndex } = state;

	const addShot = () => {
		dispatch({ type: 'ADD_SHOT' });
	};

	const nextHole = () => {
		dispatch({ type: 'NEXT_HOLE' });
	};

	const previousHole = () => {
		dispatch({ type: 'PREVIOUS_HOLE' });
	};

	return (
		<div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 1 }}>
			<button type='button' onClick={addShot}>
				Mark Ball Location
			</button>
			<button type='button' onClick={previousHole}>
				Previous Hole
			</button>
			<button type='button' onClick={nextHole}>
				Next Hole
			</button>
			<p>Selected Hole: {selectedHoleIndex + 1}</p>
			<p>Current Hole: {currentHoleIndex + 1}</p>
		</div>
	);
}
