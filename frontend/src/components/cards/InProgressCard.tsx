import type { Course, Round } from '@shared/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useCustomAuth } from '@/context/AuthContext';
import { fetchCourseById } from '@/context/courseService';
import ScoreBox from '../ScoreBox';

type InProgressCardProps = {
	roundData: Round;
};

export default function InProgressCard({ roundData }: InProgressCardProps) {
	const queryClient = useQueryClient();
	const { idToken } = useCustomAuth();

	const { data: courseData } = useQuery<Course>({
		queryKey: ['course', roundData.courseId],
		queryFn: () => fetchCourseById(idToken!, roundData.courseId),
		initialData: () => queryClient.getQueryData(['course', roundData.courseId]),
	});

	const imageUrl = courseData?.images?.thumbnail?.img
		? `${import.meta.env.VITE_S3_COURSES_BUCKET}/${courseData.courseId}/${courseData.images.thumbnail.img}`
		: '/placeholder-course.png';

	const imageAlt = courseData?.images?.thumbnail?.alt || 'Course image';
	const courseName =
		courseData?.name || roundData.courseName || 'Unknown Course';
	const currentHole = `Hole ${roundData.holes.length}/${courseData?.holes.length ?? '?'}`;

	return (
		<Link
			to={`/`}
			className='self-stretch h-44 rounded-lg border-glass inline-flex flex-col justify-start items-start overflow-hidden shrink-0'
		>
			<img
				src={imageUrl}
				alt={imageAlt}
				className='self-stretch h-24 object-cover'
			/>
			<div className='self-stretch flex-1 p-3 bg-glass inline-flex justify-start items-start gap-4 overflow-hidden'>
				<div className='flex-1 self-stretch inline-flex flex-col justify-between items-start'>
					<p className='self-stretch justify-end text-black text-base font-semibold font-barlow'>
						{courseName}
					</p>
					<p className='text-black text-base font-medium font-barlow'>
						{currentHole}
					</p>
				</div>
				<ScoreBox
					score={
						roundData.holes.reduce((acc, hole) => acc + hole.shots.length, 0) ??
						0
					}
				/>
			</div>
		</Link>
	);
}
