import type { Course } from '@shared/types';
import { Link } from 'react-router-dom';

export default function HorizontalCard({ courseData }: { courseData: Course }) {
	return (
		<Link
			to={`/courses/${courseData.courseId}`}
			className='self-stretch h-20 rounded-lg border-glass inline-flex justify-start items-start overflow-hidden shrink-0'
		>
			<img src='/chambers.png' className='w-20 h-full object-cover' />
			<div className='flex-1 h-full p-3 bg-glass flex justify-start items-start gap-3 overflow-hidden'>
				<div className='flex-1 self-stretch inline-flex flex-col justify-between items-start'>
					<div className='self-stretch flex flex-col justify-start items-start gap-3'>
						<p className='self-stretch justify-end text-black text-base font-semibold font-barlow'>
							{courseData.name}
						</p>
						<p className='self-stretch justify-end text-black text-xs font-semibold font-barlow'>
							Seattle, WA
						</p>
					</div>
					<div className='self-stretch inline-flex justify-end items-start gap-1.5'>
						<div className='px-3 py-1.5 bg-glass rounded-full border-glass inline-flex flex-col justify-center items-center'>
							<p className='justify-end text-black text-xs font-medium font-barlow'>
								{courseData.holes.length}
							</p>
						</div>
						<div className='px-3 py-1.5 bg-glass rounded-full border-glass inline-flex flex-col justify-center items-center'>
							<p className='justify-end text-black text-xs font-medium font-barlow'>
								Par 72
							</p>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}
