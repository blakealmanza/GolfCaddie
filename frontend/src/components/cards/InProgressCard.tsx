import chambers from '../../../public/chambers.png';

export default function InProgressCard() {
	return (
		<div className='self-stretch h-44 rounded-lg border-glass inline-flex flex-col justify-start items-start overflow-hidden shrink-0'>
			<img src={chambers} className='self-stretch h-24 object-cover' />
			<div className='self-stretch flex-1 p-3 bg-glass inline-flex justify-start items-start gap-4 overflow-hidden'>
				<div className='flex-1 self-stretch inline-flex flex-col justify-between items-start'>
					<p className='self-stretch justify-end text-black text-base font-semibold font-barlow'>
						Wine Valley Golf Club
					</p>
					<p className='self-stretch justify-end text-black text-base font-medium font-barlow'>
						Hole 5/18
					</p>
				</div>
				<div className='h-14 aspect-square p-1.5 bg-lime-50 rounded inset-shadows inline-flex flex-col justify-center items-center'>
					<p className='justify-end text-black text-4xl font-semibold font-barlow'>
						+8
					</p>
				</div>
			</div>
		</div>
	);
}
