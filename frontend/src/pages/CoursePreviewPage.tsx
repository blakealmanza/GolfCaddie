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

	if (!courseId || !idToken) return null;

	const { data: course } = useQuery({
		queryKey: ['course', courseId],
		queryFn: () => fetchCourseById(courseId, idToken),
		initialData: () => {
			const courses = queryClient.getQueryData(['courses']) as
				| Course[]
				| undefined;
			return courses?.find((c) => c.courseId === courseId);
		},
		enabled: typeof idToken === 'string',
		staleTime: 5 * 60 * 1000,
	});

	const handleStartRound = async (courseId: string) => {
		if (!idToken) return;
		const round = await createRound(courseId, idToken);
		navigate(`/round/${round.roundId}`);
	};

	return (
		<SecondaryLayout>
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
						{course?.name}
					</p>
					<p className='self-stretch justify-end text-black text-base font-semibold font-barlow'>
						Seattle, WA
					</p>
					<div className='self-stretch inline-flex justify-end items-start gap-1.5'>
						<Chip text='18 holes' />
						<Chip text='Par 72' />
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
