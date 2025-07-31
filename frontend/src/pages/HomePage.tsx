import InProgressCard from '@/components/cards/InProgressCard';
import PreviousRoundCard from '@/components/cards/PreviousRoundCard';
import Header from '@/components/Header';
import Section from '@/components/Section';
import ColoredButton from '@/components/ui/ColoredButton';

export default function HomePage() {
	return (
		<>
			<Header title='Home' />
			<Section title='Currently Playing'>
				<InProgressCard />
			</Section>
			<ColoredButton text='Start New Round' />
			<Section title='Previous Rounds'>
				<PreviousRoundCard />
				<PreviousRoundCard />
				<PreviousRoundCard />
				<PreviousRoundCard />
				<PreviousRoundCard />
				<PreviousRoundCard />
			</Section>
		</>
	);
}
