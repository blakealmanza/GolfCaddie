import type { Round } from '@shared/types';
import { Link } from 'react-router-dom';

export default function VerticalCard({ roundData }: { roundData: Round }) {
	return (
		<Link
			to={`/courses/${roundData.courseId}`}
			className='w-32 h-44 rounded-lg border-glass inline-flex flex-col overflow-hidden'
		>
			<img src='/chambers.png' className='h-24 object-cover' />
			<div className='flex-1 p-3 bg-glass flex flex-col justify-between'>
				<p className='justify-end text-black text-base font-semibold font-barlow whitespace-normal'>
					{roundData.courseName}
				</p>
				<p className='justify-end text-black text-xs font-semibold font-barlow'>
					{roundData.courseLocation}
				</p>
			</div>
		</Link>
	);
}
