import type { Course, Round } from '@shared/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import HorizontalCard from '@/components/cards/HorizontalCard';
import VerticalCard from '@/components/cards/VerticalCard';
import Header from '@/components/Header';
import CourseCreatorModal from '@/components/modals/CourseCreatorModal';
import Section from '@/components/Section';
import ColoredButton from '@/components/ui/ColoredButton';
import { useCustomAuth } from '@/context/AuthContext';
import { listCourses } from '@/context/courseService';
import { fetchUserRounds } from '@/context/roundService';

export default function CoursesPage() {
	const { idToken } = useCustomAuth();
	const [showCourseCreator, setShowCourseCreator] = useState(false);

	const queryClient = useQueryClient();

	const { data: allCourses = [], isLoading: isLoadingAllCourses } = useQuery<
		Course[]
	>({
		queryKey: ['courses'],
		queryFn: () => {
			if (!idToken) throw new Error('No authentication token');
			return listCourses(idToken);
		},
		enabled: typeof idToken === 'string' && idToken.length > 0,
		staleTime: 5 * 60 * 1000,
	});

	const { data: recentRounds = [], isLoading: isLoadingRecentRounds } =
		useQuery<Round[]>({
			queryKey: ['rounds'],
			queryFn: () => {
				if (!idToken) throw new Error('No authentication token');
				return fetchUserRounds(idToken);
			},
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
				{isLoadingRecentRounds ? (
					<div className='self-stretch px-4 py-8 bg-glass rounded-lg drop-shadows border-glass text-center'>
						<p className='text-gray-600 text-sm font-medium font-barlow'>
							Loading recent rounds...
						</p>
					</div>
				) : (() => {
					const uniqueRounds = recentRounds
						.reduce<Round[]>((acc, round) => {
							if (!acc.find((r) => r.courseId === round.courseId)) {
								acc.push(round);
							}
							return acc;
						}, [])
						.slice(0, 5);

					return uniqueRounds.length > 0 ? (
						uniqueRounds.map((round) => (
							<VerticalCard key={round.courseId} roundData={round} />
						))
					) : (
						<div className='self-stretch px-4 py-8 bg-glass rounded-lg drop-shadows border-glass text-center'>
							<p className='text-gray-600 text-sm font-medium font-barlow mb-2'>
								No recent rounds yet
							</p>
							<p className='text-gray-500 text-xs font-barlow'>
								Play a round to see it here!
							</p>
						</div>
					);
				})()}
			</Section>
			<ColoredButton
				text='Create New Course'
				onClick={() => setShowCourseCreator(true)}
			/>
			<Section title='All Courses'>
				{isLoadingAllCourses ? (
					<div className='self-stretch px-4 py-8 bg-glass rounded-lg drop-shadows border-glass text-center'>
						<p className='text-gray-600 text-sm font-medium font-barlow'>
							Loading courses...
						</p>
					</div>
				) : allCourses.length > 0 ? (
					allCourses.map((course) => (
						<HorizontalCard key={course.courseId} courseData={course} />
					))
				) : (
					<div className='self-stretch px-4 py-8 bg-glass rounded-lg drop-shadows border-glass text-center'>
						<p className='text-gray-600 text-sm font-medium font-barlow mb-2'>
							No courses available yet
						</p>
						<p className='text-gray-500 text-xs font-barlow mb-4'>
							Be the first to create a course!
						</p>
						<button
							type='button'
							onClick={() => setShowCourseCreator(true)}
							className='px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold font-barlow hover:bg-blue-600 transition-colors'
						>
							Create Course
						</button>
					</div>
				)}
			</Section>

			<CourseCreatorModal
				isOpen={showCourseCreator}
				onClose={() => setShowCourseCreator(false)}
			/>
		</>
	);
}
