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
		queryFn: () => {
			if (!idToken) throw new Error('No authentication token');
			return fetchCourseById(roundData.courseId, idToken);
		},
		initialData: () => queryClient.getQueryData(['course', roundData.courseId]),
	});

	const imageUrl = courseData?.images?.thumbnail?.img
		? `${import.meta.env.VITE_S3_COURSES_BUCKET}/${courseData.courseId}/${courseData.images.thumbnail.img}`
		: '/placeholder-course.png';

	const imageAlt = courseData?.images?.thumbnail?.alt || 'Course image';
	const courseName =
		courseData?.name || roundData.courseName || 'Unknown Course';
	// Find the current hole (first hole with no shots or incomplete)
	const currentHoleIndex = roundData.holes.findIndex(
		(hole) =>
			hole.shots.length === 0 ||
			hole.score === null ||
			hole.score === undefined,
	);
	const currentHoleNumber =
		currentHoleIndex >= 0 ? currentHoleIndex + 1 : roundData.holes.length;
	const totalHoles = courseData?.holes.length ?? roundData.holes.length;
	const currentHole = `Hole ${currentHoleNumber}/${totalHoles}`;

	return (
		<Link
			to={`/round/${roundData.roundId}`}
			className='self-stretch h-44 rounded-lg border-glass inline-flex flex-col justify-start items-start overflow-hidden shrink-0'
		>
			<img
				src={imageUrl}
				alt={imageAlt}
				className='self-stretch h-24 object-cover'
			/>
			<div className='self-stretch flex-1 p-3 bg-glass inline-flex justify-start items-start gap-4 overflow-hidden'>
				<div className='flex-1 self-stretch inline-flex flex-col justify-between items-start'>
					<div className='self-stretch inline-flex justify-between items-center'>
						<p className='justify-end text-black text-base font-semibold font-barlow'>
							{courseName}
						</p>
						{roundData.state === 'paused' && (
							<span className='px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full'>
								Paused
							</span>
						)}
					</div>
					<p className='text-black text-base font-medium font-barlow'>
						{currentHole}
					</p>
				</div>
				<ScoreBox
					score={(() => {
						// Calculate total score to par from saved scores
						const totalScoreToPar = roundData.holes.reduce((acc, hole) => {
							if (hole.score !== null && hole.score !== undefined) {
								return acc + hole.score;
							}
							return acc;
						}, 0);

						if (totalScoreToPar === 0) return 'E';
						if (totalScoreToPar > 0)
							return `+${totalScoreToPar}` as `+${number}`;
						return `${totalScoreToPar}` as `-${number}`;
					})()}
				/>
			</div>
		</Link>
	);
}
