import type { Course, Round } from '@shared/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import HorizontalCard from '@/components/cards/HorizontalCard';
import VerticalCard from '@/components/cards/VerticalCard';
import Header from '@/components/Header';
import Section from '@/components/Section';
import ColoredButton from '@/components/ui/ColoredButton';
import { useCustomAuth } from '@/context/AuthContext';
import { listCourses } from '@/context/courseService';
import { fetchUserRounds } from '@/context/roundService';

export default function CoursesPage() {
	const { idToken } = useCustomAuth();

	const queryClient = useQueryClient();

	const { data: allCourses = [], isLoading: isLoadingAllCourses } = useQuery<
		Course[]
	>({
		queryKey: ['courses'],
		queryFn: () => listCourses(idToken!),
		enabled: typeof idToken === 'string' && idToken.length > 0,
		staleTime: 5 * 60 * 1000,
	});

	const { data: recentRounds = [], isLoading: isLoadingRecentRounds } =
		useQuery<Round[]>({
			queryKey: ['rounds'],
			queryFn: () => fetchUserRounds(idToken!),
			enabled: !!idToken,
			staleTime: 5 * 60 * 1000,
		});

	useEffect(() => {
		if (recentRounds.length > 0) {
			recentRounds.forEach((round) => {
				queryClient.setQueryData(['round', round.roundId], round);
			});
		}
	}, [recentRounds, queryClient]);

	useEffect(() => {
		if (allCourses.length > 0) {
			allCourses.forEach((course) => {
				queryClient.setQueryData(['course', course.courseId], course);
			});
		}
	}, [allCourses, queryClient]);

	if (!idToken) return null;

	return (
		<>
			<Header title='Courses' />
			<Section title='Recently Played' isHorizontal={true}>
				{!isLoadingRecentRounds &&
					recentRounds
						.reduce<Round[]>((acc, round) => {
							if (!acc.find((r) => r.courseId === round.courseId)) {
								acc.push(round);
							}
							return acc;
						}, [])
						.slice(0, 5)
						.map((round) => (
							<VerticalCard key={round.courseId} roundData={round} />
						))}
			</Section>
			<ColoredButton text='Create New Course' onClick={() => {}} />
			<Section title='All Courses'>
				{!isLoadingAllCourses &&
					allCourses.map((course) => (
						<HorizontalCard key={course.courseId} courseData={course} />
					))}
			</Section>
		</>
	);
}
