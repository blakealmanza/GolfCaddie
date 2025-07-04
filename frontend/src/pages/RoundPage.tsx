import RoundContent from '../context/RoundContent';
import { RoundProvider } from '../context/RoundContext';

export default function RoundPage() {
	return (
		<RoundProvider>
			<RoundContent />
		</RoundProvider>
	);
}
