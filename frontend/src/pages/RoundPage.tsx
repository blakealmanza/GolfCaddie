import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import BackArrow from '@/assets/back-arrow.svg?react';
import HoleInfoPanel from '@/components/hole/HoleInfoPanel';
import RoundMap from '@/components/map/RoundMap';
import { useCustomAuth } from '@/context/AuthContext';
import { createPreviewRound, fetchCourseById } from '@/context/courseService';
import { MapProvider } from '@/context/MapContext';
import { RoundProvider, useRound } from '@/context/RoundContext';
import { fetchRoundById } from '@/context/roundService';
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

	const isPreviewMode = location.pathname.includes('/preview');

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
					payload: { round: previewRound, isPreviewMode: true },
				});
			} else {
				// Load regular round data
				if (!idToken) return;
				const roundData = await fetchRoundById(id, idToken);
				dispatch({
					type: 'INITIALIZE_ROUND',
					payload: { round: roundData, isPreviewMode: false },
				});
			}
		};

		loadRound();
	}, [id, idToken, dispatch, isPreviewMode]);

	return (
		<div className='relative h-screen w-screen'>
			<div className='relative z-10 pointer-events-none'>
				<SecondaryLayout>
					<div className='self-stretch inline-flex justify-between items-start pointer-events-auto'>
						<button
							type='button'
							onClick={() => navigate(-1)}
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
		</div>
	);
}
