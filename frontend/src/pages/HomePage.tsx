import ColoredButton from '@/components/ColoredButton';
import InProgressCard from '@/components/cards/InProgressCard';
import PreviousRoundCard from '@/components/cards/PreviousRoundCard';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import Section from '@/components/Section';
import MainLayout from '@/layouts/MainLayout';

export default function HomePage() {
	return (
		<MainLayout>
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
			<NavBar />
		</MainLayout>
	);
}
