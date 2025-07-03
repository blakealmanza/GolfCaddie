export default function HoleInfoPanel({
	handleMarkBall,
}: {
	handleMarkBall: () => void;
}) {
	return (
		<div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 1 }}>
			<button type='button' onClick={handleMarkBall}>
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
