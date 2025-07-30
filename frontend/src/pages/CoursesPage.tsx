import type { Course } from '@shared/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import ColoredButton from '@/components/ColoredButton';
import HorizontalCard from '@/components/cards/HorizontalCard';
import VerticalCard from '@/components/cards/VerticalCard';
import Header from '@/components/Header';
import Section from '@/components/Section';
import { useCustomAuth } from '@/context/AuthContext';
import { listCourses } from '@/context/courseService';

export default function CoursesPage() {
	const { idToken } = useCustomAuth();
	if (!idToken) return null;

	const queryClient = useQueryClient();

	const { data: courses = [], isLoading } = useQuery<Course[]>({
		queryKey: ['courses'],
		queryFn: () => listCourses(idToken),
		enabled: typeof idToken === 'string' && idToken.length > 0,
		staleTime: 5 * 60 * 1000,
	});

	useEffect(() => {
		if (courses.length > 0) {
			courses.forEach((course) => {
				queryClient.setQueryData(['course', course.courseId], course);
				console.log(queryClient.getQueryData(['course', course.courseId]));
			});
		}
	}, [courses, queryClient]);

	return (
		<>
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
				{!isLoading &&
					courses.map((course) => (
						<HorizontalCard key={course.courseId} courseData={course} />
					))}
			</Section>
		</>
	);
}
