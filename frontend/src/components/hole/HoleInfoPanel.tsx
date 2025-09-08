import BackArrow from '@/assets/back-arrow.svg?react';
import ForwardArrow from '@/assets/forward-arrow.svg?react';
import { useCustomAuth } from '@/context/AuthContext';
import { useMap } from '@/context/MapContext';
import { updateHoleInRound } from '@/context/roundService';
import { useRound } from '../../context/RoundContext';
import { getDistance } from '../../util/geoUtils';
import ScoreBox from '../ScoreBox';

export default function HoleInfoPanel() {
	const { state, dispatch } = useRound();
	const { state: mapState, dispatch: mapDispatch } = useMap();
	const {
		selectedHoleIndex,
		holes,
		roundId,
		isPreviewMode,
		isReviewMode,
		savedScores,
	} = state;
	const { idToken } = useCustomAuth();

	const selectedCourseHole = holes[selectedHoleIndex];

	// Calculate dynamic yards from tee to pin
	const calculateYards = () => {
		if (selectedCourseHole.tee && selectedCourseHole.pin) {
			return getDistance(selectedCourseHole.tee, selectedCourseHole.pin);
		}
		return 0;
	};

	// Calculate dynamic score using saved scores
	const calculateScore = (): `+${number}` | `-${number}` | 'E' | 0 => {
		// In preview mode, always show 0
		if (isPreviewMode) return 0;

		// Calculate cumulative score from saved scores
		let totalScoreToPar = 0;
		let hasAnySavedScores = false;

		// Sum up saved scores for all holes up to current hole
		for (let i = 0; i <= selectedHoleIndex; i++) {
			const savedScore = savedScores[i];
			if (savedScore !== null) {
				totalScoreToPar += savedScore;
				hasAnySavedScores = true;
			}
		}

		// If no scores have been saved yet, show 0
		if (!hasAnySavedScores) return 0;

		if (totalScoreToPar === 0) return 'E';
		if (totalScoreToPar > 0) return `+${totalScoreToPar}` as `+${number}`;
		return `${totalScoreToPar}` as `-${number}`;
	};

	const yards = calculateYards();
	const score = calculateScore();

	// Calculate and save the score for the current hole
	const saveCurrentHoleScore = () => {
		if (isPreviewMode || isReviewMode) return;

		const currentHole = holes[selectedHoleIndex];
		if (currentHole && currentHole.shots.length > 0) {
			// Only save score if this hole doesn't already have a saved score
			const hasExistingScore =
				currentHole.score !== null && currentHole.score !== undefined;

			if (!hasExistingScore) {
				const shotsTaken = currentHole.shots.length;
				const par = currentHole.par;
				const scoreToPar = shotsTaken - par;

				dispatch({
					type: 'SAVE_HOLE_SCORE',
					payload: {
						holeIndex: selectedHoleIndex,
						score: scoreToPar,
					},
				});
			}
		}
	};

	const nextHole = async () => {
		// Save the current hole score before moving to next hole
		saveCurrentHoleScore();

		if (!isPreviewMode && !isReviewMode) {
			try {
				if (!idToken || !roundId) return;

				// Get the saved score for this hole
				const holeScore = savedScores[selectedHoleIndex];

				// Only save to database if this hole doesn't already have a saved score
				// This prevents overwriting previously saved hole data
				const currentHole = holes[selectedHoleIndex];
				const hasExistingScore =
					currentHole.score !== null && currentHole.score !== undefined;

				if (!hasExistingScore && holeScore !== null) {
					// Create hole data with score included
					const holeDataWithScore = {
						...selectedCourseHole,
						score: holeScore,
					};

					await updateHoleInRound(
						roundId,
						selectedHoleIndex,
						holeDataWithScore,
						idToken,
					);
				}
			} catch (error) {
				console.error('Failed to save hole:', error);
			}
		}

		dispatch({ type: 'NEXT_HOLE' });
		if (!isPreviewMode && !isReviewMode) {
			mapDispatch({ type: 'SET_SELECTING_MODE', payload: 'tee' });
		}
	};

	const previousHole = () => {
		dispatch({ type: 'PREVIOUS_HOLE' });
	};

	const addShot = () => {
		if (!mapState.userCoords || isReviewMode) return;
		dispatch({
			type: 'ADD_SHOT',
			payload: {
				position: mapState.userCoords,
				target: mapState.target,
				suggestion: mapState.suggestion,
			},
		});
		mapDispatch({ type: 'SET_TARGET', payload: null });
		mapDispatch({ type: 'SET_SUGGESTION', payload: null });
	};
	// const handleParChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	dispatch({
	// 		type: 'SET_PAR',
	// 		payload: parseInt(e.target.value, 10),
	// 	});
	// };

	return (
		<div className='pointer-events-auto self-stretch p-2 bg-glass rounded-lg drop-shadows border-glass backdrop-blur-md inline-flex flex-col justify-center items-center gap-2 overflow-hidden'>
			{isPreviewMode && (
				<div className='self-stretch px-3 py-2 bg-transparent rounded-lg border border-black inline-flex justify-center items-center'>
					<p className='text-black text-sm font-semibold font-barlow'>
						Preview Mode - View Only
					</p>
				</div>
			)}
			{isReviewMode && (
				<div className='self-stretch px-3 py-2 bg-transparent rounded-lg border border-black inline-flex justify-center items-center'>
					<p className='text-black text-sm font-semibold font-barlow'>
						Review Mode - View Only
					</p>
				</div>
			)}
			{!isPreviewMode && !isReviewMode && mapState.selectingMode !== 'none' && (
				<div className='self-stretch px-3 py-2 bg-blue-500/20 rounded-lg border border-blue-500/50 inline-flex justify-center items-center'>
					<p className='text-blue-700 text-sm font-semibold font-barlow'>
						{mapState.selectingMode === 'tee' && 'Click to set tee location'}
						{mapState.selectingMode === 'pin' && 'Click to set pin location'}
						{mapState.selectingMode === 'target' &&
							'Click to set target location'}
					</p>
				</div>
			)}
			{!isPreviewMode && !isReviewMode && (
				<div className='self-stretch inline-flex justify-start items-start gap-2'>
					<button
						type='button'
						className='flex-1 self-stretch py-2.5 bg-glass rounded-md drop-shadows border-glass inline-flex flex-col justify-center items-center'
					>
						<p className='justify-end text-black text-base font-semibold font-barlow'>
							Scorecard
						</p>
					</button>
					<button
						type='button'
						className='flex-1 self-stretch py-2.5 bg-glass rounded-md drop-shadows border-glass inline-flex flex-col justify-center items-center'
					>
						<p className='justify-end text-black text-base font-semibold font-barlow'>
							Lock Target
						</p>
					</button>
					<button
						type='button'
						onClick={addShot}
						className='flex-1 self-stretch py-2.5 bg-glass rounded-md drop-shadows border-glass inline-flex flex-col justify-center items-center'
					>
						<p className='justify-end text-black text-base font-semibold font-barlow'>
							Mark Ball
						</p>
					</button>
				</div>
			)}
			<div className='self-stretch p-4 bg-glass rounded-md border-glass inline-flex justify-start items-center gap-6 overflow-hidden'>
				<button
					type='button'
					onClick={previousHole}
					className='w-6 self-stretch rounded-md inline-flex flex-col justify-center items-center overflow-hidden'
				>
					<BackArrow className='text-black' />
				</button>
				<div className='flex-1 rounded-xl flex justify-between items-start'>
					<div className='inline-flex flex-col justify-center items-start gap-4'>
						<p className='justify-end text-black text-4xl font-semibold font-barlow'>
							Hole {selectedHoleIndex + 1}
						</p>
						<div className='inline-flex justify-start items-start gap-4'>
							<div className='flex justify-start items-end gap-1.5'>
								<p className='justify-end text-black text-2xl font-semibold font-barlow leading-relaxed'>
									{yards > 0 ? yards : '--'}
								</p>
								<p className='justify-end text-black text-base font-semibold font-barlow'>
									yds
								</p>
							</div>
							<div className='flex justify-start items-end gap-1.5'>
								<p className='justify-end text-black text-2xl font-semibold font-barlow'>
									{selectedCourseHole.par}
								</p>
								<p className='justify-end text-black text-base font-semibold font-barlow'>
									par
								</p>
							</div>
						</div>
					</div>
					<ScoreBox score={score} />
				</div>
				<button
					type='button'
					onClick={nextHole}
					className='self-stretch px-1.5 py-0.5 rounded-md inline-flex flex-col justify-center items-start overflow-hidden'
				>
					<ForwardArrow className='text-black' />
				</button>
			</div>
		</div>
	);
}
