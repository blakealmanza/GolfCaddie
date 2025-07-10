import { useRound } from '../../context/RoundContext';

export default function HoleSetupPrompt() {
	const { state } = useRound();
	const { selectingMode } = state;

	return (
		<div
			style={{
				position: 'absolute',
				top: 10,
				left: 10,
				zIndex: 2,
				background: 'black',
				padding: '0.5rem 1rem',
				borderRadius: '4px',
			}}
		>
			{selectingMode === 'tee' && 'Tap the map to set the tee location'}
			{selectingMode === 'pin' && 'Tap the map to set the pin location'}
			{selectingMode === 'target' && 'Tap the map to set the target location'}
			{selectingMode === 'none' && 'Unable to tap the map'}
		</div>
	);
}
