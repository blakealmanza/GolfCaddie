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
		const loadRound = async () => {
			if (!idToken || !roundId) return;
			const roundData = await fetchRoundById(roundId, idToken);
			dispatch({
				type: 'INITIALIZE_ROUND',
				payload: { round: roundData },
			});
		};

		loadRound();
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
