import BackArrow from '@/assets/back-arrow.svg?react';
import ForwardArrow from '@/assets/forward-arrow.svg?react';
import { useCustomAuth } from '@/context/AuthContext';
import { useMap } from '@/context/MapContext';
import { updateHoleInRound } from '@/context/roundService';
import { useRound } from '../../context/RoundContext';
import ScoreBox from '../ScoreBox';

export default function HoleInfoPanel() {
	const { state, dispatch } = useRound();
	const { state: mapState, dispatch: mapDispatch } = useMap();
	const { selectedHoleIndex, holes, roundId } = state;
	const { idToken } = useCustomAuth();

	const selectedCourseHole = holes[selectedHoleIndex];

	const nextHole = async () => {
		try {
			if (!idToken || !roundId) return;
			await updateHoleInRound(
				roundId,
				selectedHoleIndex,
				selectedCourseHole,
				idToken,
			);
		} catch (error) {
			console.error('Failed to save hole:', error);
		}

		dispatch({ type: 'NEXT_HOLE' });
		mapDispatch({ type: 'SET_SELECTING_MODE', payload: 'tee' });
	};

	const previousHole = () => {
		dispatch({ type: 'PREVIOUS_HOLE' });
	};

	const addShot = () => {
		if (!mapState.userCoords) return;
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
									321
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
					<ScoreBox score='+12' />
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
