import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import BackArrow from '@/assets/back-arrow.svg?react';
import HoleInfoPanel from '@/components/hole/HoleInfoPanel';
import RoundMap from '@/components/map/RoundMap';
import ExitRoundModal from '@/components/modals/ExitRoundModal';
import { useCustomAuth } from '@/context/AuthContext';
import { createPreviewRound, fetchCourseById } from '@/context/courseService';
import { MapProvider } from '@/context/MapContext';
import { RoundProvider, useRound } from '@/context/RoundContext';
import {
	fetchRoundById,
	useEndRound,
	usePauseRound,
} from '@/context/roundService';
import SecondaryLayout from '@/layouts/SecondaryLayout';

export default function RoundPage() {
	return (
		<MapProvider>
			<RoundProvider>
				<RoundPageContent />
			</RoundProvider>
		</MapProvider>
	);
}

function RoundPageContent() {
	const { id } = useParams();
	const { idToken } = useCustomAuth();
	const { dispatch } = useRound();
	const navigate = useNavigate();
	const location = useLocation();
	const [showExitModal, setShowExitModal] = useState(false);

	const endRoundMutation = useEndRound();
	const pauseRoundMutation = usePauseRound();

	const isPreviewMode = location.pathname.includes('/preview');
	const isReviewMode = location.pathname.includes('/review');

	useEffect(() => {
		const loadRound = async () => {
			if (!id) return;

			if (isPreviewMode) {
				// Load course data for preview mode
				if (!idToken) return;
				const courseData = await fetchCourseById(id, idToken);
				const previewRound = createPreviewRound(courseData);
				dispatch({
					type: 'INITIALIZE_ROUND',
					payload: {
						round: previewRound,
						isPreviewMode: true,
						isReviewMode: false,
					},
				});
			} else {
				// Load regular round data
				if (!idToken) return;
				const roundData = await fetchRoundById(id, idToken);
				dispatch({
					type: 'INITIALIZE_ROUND',
					payload: { round: roundData, isPreviewMode: false, isReviewMode },
				});
			}
		};

		loadRound();
	}, [id, idToken, dispatch, isPreviewMode, isReviewMode]);

	const handleBackClick = () => {
		// Don't show modal for preview or review modes
		if (isPreviewMode || isReviewMode) {
			navigate(-1);
			return;
		}

		// Show exit modal for active rounds
		setShowExitModal(true);
	};

	const handleEndRound = async () => {
		if (!idToken || !id) return;

		try {
			await endRoundMutation.mutateAsync({ roundId: id, idToken });
			setShowExitModal(false);
		} catch (error) {
			console.error('Failed to end round:', error);
		}
	};

	const handlePauseRound = async () => {
		if (!idToken || !id) return;

		try {
			await pauseRoundMutation.mutateAsync({ roundId: id, idToken });
			setShowExitModal(false);
		} catch (error) {
			console.error('Failed to pause round:', error);
		}
	};

	return (
		<div className='relative h-screen w-screen'>
			<div className='relative z-10 pointer-events-none'>
				<SecondaryLayout>
					<div className='self-stretch inline-flex justify-between items-start pointer-events-auto'>
						<button
							type='button'
							onClick={handleBackClick}
							className='bg-glass rounded-lg drop-shadows border-glass blur-glass inline-flex flex-col justify-center items-center pointer-events-auto'
						>
							<div className='w-10 h-10 p-0 bg-glass rounded-lg border-glass flex flex-col justify-center items-center overflow-hidden'>
								<BackArrow className='text-black' />
							</div>
						</button>
						<div id='map-controls-portal' className='pointer-events-auto' />
					</div>
					<HoleInfoPanel />
				</SecondaryLayout>
			</div>
			<div className='absolute inset-0 z-0'>
				<RoundMap />
			</div>

			<ExitRoundModal
				isOpen={showExitModal}
				onClose={() => setShowExitModal(false)}
				onEndRound={handleEndRound}
				onPauseRound={handlePauseRound}
				isEndingRound={endRoundMutation.isPending}
				isPausingRound={pauseRoundMutation.isPending}
			/>
		</div>
	);
}
