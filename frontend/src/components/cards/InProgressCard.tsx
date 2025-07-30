import { Link } from 'react-router-dom';
import ScoreBox from '../ScoreBox';

export default function InProgressCard() {
	return (
		<Link
			to={`/`}
			className='self-stretch h-44 rounded-lg border-glass inline-flex flex-col justify-start items-start overflow-hidden shrink-0'
		>
			<img src='/chambers.png' className='self-stretch h-24 object-cover' />
			<div className='self-stretch flex-1 p-3 bg-glass inline-flex justify-start items-start gap-4 overflow-hidden'>
				<div className='flex-1 self-stretch inline-flex flex-col justify-between items-start'>
					<p className='self-stretch justify-end text-black text-base font-semibold font-barlow'>
						Wine Valley Golf Club
					</p>
					<p className='self-stretch justify-end text-black text-base font-medium font-barlow'>
						Hole 5/18
					</p>
				</div>
				<ScoreBox score='+8' />
			</div>
		</Link>
	);
}
