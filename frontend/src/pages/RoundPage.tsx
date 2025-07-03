import { useState } from 'react';
import HoleInfoPanel from '../components/hole/HoleInfoPanel';
import HoleSetupPrompt from '../components/hole/HoleSetupPrompt';
import RoundMap from '../components/map/RoundMap';
import type { LatLng } from '../util/geoUtils';

export default function RoundPage() {
	const [shots, setShots] = useState<LatLng[]>([]);
	const [userPosition, setUserPosition] = useState<LatLng | null>(null);
	const [selectingMode, setSelectingMode] = useState<'tee' | 'hole' | null>(
		null,
	);
	const [target, setTarget] = useState<LatLng | null>(null);

	const handleMarkBall = () => {
		if (userPosition) {
			setShots((prev) => [...prev, userPosition]);
			setTarget(null);
		}
	};

	return (
		<>
			<RoundMap
				userPosition={userPosition}
				setUserPosition={setUserPosition}
				shots={shots}
				selectingMode={selectingMode}
				setSelectingMode={setSelectingMode}
				target={target}
				setTarget={setTarget}
			/>
			<HoleInfoPanel handleMarkBall={handleMarkBall} />

			{selectingMode && <HoleSetupPrompt selectingMode={selectingMode} />}
		</>
	);
}
