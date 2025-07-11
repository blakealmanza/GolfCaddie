import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import HoleInfoPanel from '../components/hole/HoleInfoPanel';
import HoleSetupPrompt from '../components/hole/HoleSetupPrompt';
import RoundMap from '../components/map/RoundMap';
import { useRound } from '../context/RoundContext';
import { fetchRoundById } from './roundService';

export default function RoundContent() {
	const { roundId } = useParams();
	const { dispatch } = useRound();

	useEffect(() => {
		if (!roundId) return;

		const loadCourse = async () => {
			const roundData = await fetchRoundById(roundId);
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
			<HoleSetupPrompt />
		</>
	);
}
