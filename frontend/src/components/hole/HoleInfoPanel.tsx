import { useRound } from '../../context/RoundContext';

export default function HoleInfoPanel() {
	const { dispatch } = useRound();

	const addShot = () => {
		dispatch({ type: 'ADD_SHOT' });
	};

	const nextHole = () => {
		dispatch({ type: 'NEXT_HOLE' });
	};

	return (
		<div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 1 }}>
			<button type='button' onClick={addShot}>
				Mark Ball Location
			</button>
			<button type='button' onClick={() => console.log('Previous Hole')}>
				Previous Hole
			</button>
			<button type='button' onClick={nextHole}>
				Next Hole
			</button>
		</div>
	);
}
