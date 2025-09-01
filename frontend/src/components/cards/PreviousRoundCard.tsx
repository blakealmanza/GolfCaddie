import type { Round } from '@shared/types';
import { Link } from 'react-router-dom';
import ScoreBox from '../ScoreBox';

export default function PreviousRoundCard({ roundData }: { roundData: Round }) {
	return (
		<Link
			to={`/`}
			className='h-20 w-full rounded-lg border-glass flex overflow-hidden'
		>
			<img
				src='/chambers.png'
				alt='Chambers Bay'
				className='w-20 h-full object-cover'
			/>
			<div className='flex-1 p-3 gap-3 bg-glass flex min-w-0'>
				<div className='self-stretch flex-1 min-w-0 flex flex-col justify-between'>
					<div className='flex flex-col gap-3'>
						<p className='text-black text-base font-semibold font-barlow whitespace-nowrap overflow-x-clip text-ellipsis'>
							{roundData.courseName}
						</p>
						<p className='text-black text-xs font-semibold font-barlow whitespace-nowrap overflow-x-clip text-ellipsis'>
							{roundData.courseLocation}
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
				<ScoreBox score={roundData.holes[0].shots.length} />
			</div>
		</Link>
	);
}
