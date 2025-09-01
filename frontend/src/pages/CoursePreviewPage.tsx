import type { Course } from '@shared/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import BackArrow from '@/assets/back-arrow.svg?react';
import Chip from '@/components/ui/Chip';
import GlassButton from '@/components/ui/GlassButton';
import GlassOutlineButton from '@/components/ui/GlassOutlineButton';
import { useCustomAuth } from '@/context/AuthContext';
import { fetchCourseById } from '@/context/courseService';
import { createRound } from '@/context/roundService';
import SecondaryLayout from '@/layouts/SecondaryLayout';

export default function CoursePreviewPage() {
	const { id: courseId } = useParams();
	const { idToken } = useCustomAuth();
	const navigate = useNavigate();

	const queryClient = useQueryClient();

	const { data: course } = useQuery<Course>({
		queryKey: ['course', courseId],
		queryFn: () => fetchCourseById(courseId!, idToken!),
		initialData: () => queryClient.getQueryData(['course', courseId]),
		enabled: typeof idToken === 'string',
		staleTime: 5 * 60 * 1000,
	});

	const courseName = course?.name || 'Unknown Course';
	const courseLocation = course?.location || 'Unknown Location';
	const courseHoles = course?.holes?.length || 18;
	const coursePar =
		course?.holes?.reduce((acc, hole) => acc + hole.par, 0) || 72;

	const backgroundImageUrl = course?.images?.thumbnail?.img
		? `${import.meta.env.VITE_S3_COURSES_BUCKET}/${course.courseId}/${course.images.thumbnail.img}`
		: '/placeholder-course.png';

	const backgroundImageAlt =
		course?.images?.thumbnail?.alt || 'Course background image';

	const handleStartRound = async (courseId: string) => {
		if (!idToken) return;
		const round = await createRound(courseId, idToken);
		navigate(`/round/${round.roundId}`);
	};

	if (!courseId || !idToken) return null;

	return (
		<SecondaryLayout
			background={{ src: backgroundImageUrl, alt: backgroundImageAlt }}
		>
			<button
				type='button'
				onClick={() => navigate(-1)}
				className='bg-glass rounded-lg drop-shadows border-glass blur-glass inline-flex flex-col justify-center items-center'
			>
				<div className='w-10 h-10 p-0 bg-glass rounded-lg border-glass flex flex-col justify-center items-center overflow-hidden'>
					<BackArrow className='text-black' />
				</div>
			</button>
			<div className='self-stretch p-2 bg-glass rounded-lg drop-shadows border-glass backdrop-blur-md inline-flex flex-col justify-start items-start gap-2 overflow-hidden'>
				<div className='self-stretch p-4 bg-glass rounded-lg border-glass flex flex-col justify-start items-start gap-3'>
					<p className='self-stretch justify-end text-black text-2xl font-semibold font-barlow leading-relaxed'>
						{courseName}
					</p>
					<p className='self-stretch justify-end text-black text-base font-semibold font-barlow'>
						{courseLocation}
					</p>
					<div className='self-stretch inline-flex justify-end items-start gap-1.5'>
						<Chip text={`${courseHoles} holes`} />
						<Chip text={`Par ${coursePar}`} />
					</div>
				</div>
				<div className='self-stretch inline-flex justify-start items-start gap-2.5'>
					<GlassOutlineButton text='Preview' />
					<GlassButton
						text='Start'
						onClick={() => handleStartRound(courseId)}
					/>
				</div>
			</div>
		</SecondaryLayout>
	);
}
