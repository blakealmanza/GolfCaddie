import type { Round } from '@shared/types';
import { Link } from 'react-router-dom';
import ScoreBox from '../ScoreBox';

export default function PreviousRoundCard({ roundData }: { roundData: Round }) {
	return (
		<Link
			to={`/`}
			className='self-stretch h-20 rounded-lg border-glass inline-flex justify-start items-start overflow-hidden shrink-0'
		>
			<img src='/chambers.png' className='w-20 h-full object-cover' />
			<div className='flex-1 h-full  p-3 bg-glass flex justify-start items-start overflow-hidden'>
				<div className='flex-1 self-stretch inline-flex flex-col justify-between items-start'>
					<div className='self-stretch flex flex-col justify-start items-start gap-3'>
						<p className='self-stretch justify-end text-black text-base font-semibold font-barlow'>
							{roundData.courseName}
						</p>
						<p className='self-stretch justify-end text-black text-xs font-semibold font-barlow'>
							{roundData.courseLocation}
						</p>
					</div>
					<div className='self-stretch inline-flex justify-start items-start gap-2.5'>
						<p className='flex-1 justify-end text-black text-xs font-medium font-barlow'>
							{new Date(roundData.startedAt).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</p>
					</div>
				</div>
				<ScoreBox score={roundData.holes[0].shots.length} />
			</div>
		</Link>
	);
}
