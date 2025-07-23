import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useParams } from 'react-router-dom';
import HoleInfoPanel from '../components/hole/HoleInfoPanel';
import RoundMap from '../components/map/RoundMap';
import { useRound } from '../context/RoundContext';
import { fetchRoundById } from './roundService';

export default function RoundContent() {
	const { roundId } = useParams();
	const { dispatch } = useRound();
	const auth = useAuth();
	const idToken = auth.user?.id_token;

	useEffect(() => {
		if (!roundId) return;

		const loadCourse = async () => {
			if (!idToken) return;
			const roundData = await fetchRoundById(roundId, idToken);
			dispatch({
				type: 'LOAD_COURSE',
				payload: { holes: roundData.holes },
			});
		};

		loadCourse();
	}, [roundId, dispatch]);

	return (
		<>
			<RoundMap>
				{({ addShot, setSelectingMode }) => (
					<HoleInfoPanel
						addShot={addShot}
						setSelectingMode={setSelectingMode}
					/>
				)}
			</RoundMap>
		</>
	);
}
