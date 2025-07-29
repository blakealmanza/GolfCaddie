import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import HoleInfoPanel from '../components/hole/HoleInfoPanel';
import RoundMap from '../components/map/RoundMap';
import { useRound } from '../context/RoundContext';
import { useCustomAuth } from './AuthContext';
import { fetchRoundById } from './roundService';

export default function RoundContent() {
	const { id } = useParams();
	const { dispatch } = useRound();
	const { idToken } = useCustomAuth();

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
	}, [id, dispatch]);

	return (
		<RoundMap>
			{({ addShot, setSelectingMode }) => (
				<HoleInfoPanel addShot={addShot} setSelectingMode={setSelectingMode} />
			)}
		</RoundMap>
	);
}
