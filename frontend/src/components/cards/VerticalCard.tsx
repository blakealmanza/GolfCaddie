import type { Course, Round } from '@shared/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useCustomAuth } from '@/context/AuthContext';
import { fetchCourseById } from '@/context/courseService';

type VerticalCardProps = {
	roundData: Round;
};

export default function VerticalCard({ roundData }: VerticalCardProps) {
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
			to={`/courses/${roundData.courseId}`}
			className='w-32 h-44 rounded-lg border-glass inline-flex flex-col overflow-hidden'
		>
			<img src={imageUrl} alt={imageAlt} className='h-24 object-cover' />
			<div className='flex-1 p-3 bg-glass flex flex-col justify-between'>
				<p className='text-black text-base font-semibold font-barlow whitespace-normal'>
					{courseName}
				</p>
				<p className='text-black text-xs font-semibold font-barlow'>
					{courseLocation}
				</p>
			</div>
		</Link>
	);
}
