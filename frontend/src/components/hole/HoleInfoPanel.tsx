import { useRound } from '../../context/RoundContext';

export default function HoleInfoPanel() {
	const { addShot } = useRound();

	return (
		<div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 1 }}>
			<button type='button' onClick={addShot}>
				Mark Ball Location
			</button>
			<button type='button' onClick={() => console.log('Finish Hole')}>
				Finish Hole
			</button>
			<button type='button' onClick={() => console.log('Next Hole')}>
				Next Hole
			</button>
		</div>
	);
}
