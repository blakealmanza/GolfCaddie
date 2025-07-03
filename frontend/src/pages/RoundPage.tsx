import HoleInfoPanel from '../components/hole/HoleInfoPanel';
import HoleSetupPrompt from '../components/hole/HoleSetupPrompt';
import RoundMap from '../components/map/RoundMap';
import { RoundProvider } from '../context/RoundContext';

export default function RoundPage() {
	return (
		<RoundProvider>
			<RoundMap />
			<HoleInfoPanel />
			<HoleSetupPrompt />
		</RoundProvider>
	);
}
