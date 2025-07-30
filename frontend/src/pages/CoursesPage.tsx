import { useQuery } from '@tanstack/react-query';
import ColoredButton from '@/components/ColoredButton';
import HorizontalCard from '@/components/cards/HorizontalCard';
import VerticalCard from '@/components/cards/VerticalCard';
import Header from '@/components/Header';
import NavBar from '@/components/NavBar';
import Section from '@/components/Section';
import { useCustomAuth } from '@/context/AuthContext';
import { listCourses } from '@/context/courseService';
import MainLayout from '@/layouts/MainLayout';

export default function CoursesPage() {
	const { idToken } = useCustomAuth();
	if (!idToken) return null;

	const { data: courses = [], isLoading } = useQuery({
		queryKey: ['courses', idToken],
		queryFn: () => listCourses(idToken),
		enabled: typeof idToken === 'string' && idToken.length > 0,
		staleTime: 5 * 60 * 1000,
	});

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
			<ColoredButton text='Create New Course' onClick={() => {}} />
			<Section title='All Courses'>
				{courses.length > 0 &&
					courses.map((course) => (
						<HorizontalCard key={course.courseId} courseData={course} />
					))}
			</Section>
			<NavBar />
		</MainLayout>
	);
}
