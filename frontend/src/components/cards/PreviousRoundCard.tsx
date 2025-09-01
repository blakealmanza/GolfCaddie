import type { Course, Round } from '@shared/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useCustomAuth } from '@/context/AuthContext';
import { fetchCourseById } from '@/context/courseService';
import ScoreBox from '../ScoreBox';

type PreviousRoundCardProps = {
	roundData: Round;
};

export default function PreviousRoundCard({
	roundData,
}: PreviousRoundCardProps) {
	const queryClient = useQueryClient();
	const { idToken } = useCustomAuth();

	const { data: courseData } = useQuery<Course>({
		queryKey: ['course', roundData.courseId],
		queryFn: () => fetchCourseById(roundData.courseId, idToken!),
		initialData: () => queryClient.getQueryData(['course', roundData.courseId]),
	});

	const imageUrl = courseData?.images?.thumbnail?.img
		? `${import.meta.env.VITE_S3_COURSES_BUCKET}/${courseData.courseId}/${courseData.images.thumbnail.img}`
		: '/placeholder-course.png';

	const imageAlt = courseData?.images?.thumbnail?.alt || 'Course image';
	const courseName = courseData?.name || roundData.courseName;
	const courseLocation = courseData?.location || roundData.courseLocation;

	return (
		<Link
			to={`/`}
			className='h-20 w-full rounded-lg border-glass flex overflow-hidden'
		>
			<img src={imageUrl} alt={imageAlt} className='w-20 h-full object-cover' />
			<div className='flex-1 p-3 gap-3 bg-glass flex min-w-0'>
				<div className='self-stretch flex-1 min-w-0 flex flex-col justify-between'>
					<div className='flex flex-col gap-3'>
						<p className='text-black text-base font-semibold font-barlow whitespace-nowrap overflow-x-clip text-ellipsis'>
							{courseName}
						</p>
						<p className='text-black text-xs font-semibold font-barlow whitespace-nowrap overflow-x-clip text-ellipsis'>
							{courseLocation}
						</p>
					</div>
					<p className='text-black text-xs font-medium font-barlow whitespace-nowrap overflow-x-clip text-ellipsis'>
						{new Date(roundData.startedAt).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</p>
				</div>
				<ScoreBox
					score={roundData.holes.reduce(
						(acc, hole) => acc + hole.shots.length,
						0,
					)}
				/>
			</div>
		</Link>
	);
}
