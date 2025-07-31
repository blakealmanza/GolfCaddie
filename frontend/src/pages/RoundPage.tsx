import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BackArrow from '@/assets/back-arrow.svg?react';
import HoleInfoPanel from '@/components/hole/HoleInfoPanel';
import RoundMap from '@/components/map/RoundMap';
import { useCustomAuth } from '@/context/AuthContext';
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

	useEffect(() => {
		const loadRound = async () => {
			if (!idToken || !id) return;
			const roundData = await fetchRoundById(id, idToken);
			dispatch({
				type: 'INITIALIZE_ROUND',
				payload: { round: roundData },
			});
		};

		loadRound();
	}, [id, idToken, dispatch]);

	return (
		<div className='relative h-screen w-screen'>
			<div className='absolute inset-0 z-0'>
				<RoundMap />
			</div>
			<div className='relative z-10'>
				<SecondaryLayout>
					<div className='bg-glass rounded-lg drop-shadows border-glass blur-glass inline-flex flex-col justify-center items-center'>
						<div className='w-10 h-10 p-0 bg-glass rounded-lg border-glass flex flex-col justify-center items-center overflow-hidden'>
							<BackArrow className='text-black' />
						</div>
					</div>
					<HoleInfoPanel />
				</SecondaryLayout>
			</div>
		</div>
	);
}
