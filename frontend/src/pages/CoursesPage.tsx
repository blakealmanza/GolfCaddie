import HorizontalCard from '@/components/cards/HorizontalCard';
import VerticalCard from '@/components/cards/VerticalCard';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import Section from '@/components/Section';
import MainLayout from '@/layouts/MainLayout';

export default function CoursesPage() {
	return (
		<MainLayout>
			<Header title='Courses' />
			<Section title='Recently Played' isHorizontal={true}>
				<VerticalCard />
				<VerticalCard />
				<VerticalCard />
				<VerticalCard />
				<VerticalCard />
				<VerticalCard />
				<VerticalCard />
			</Section>
			<Section title='All Courses'>
				<HorizontalCard />
				<HorizontalCard />
				<HorizontalCard />
				<HorizontalCard />
				<HorizontalCard />
				<HorizontalCard />
			</Section>
			<NavBar />
		</MainLayout>
	);
}
