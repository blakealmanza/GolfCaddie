import chambers from '../../../public/chambers.png';

export default function PreviousRoundCard() {
	return (
		<div className='self-stretch h-20 rounded-lg border-glass inline-flex justify-start items-start overflow-hidden shrink-0'>
			<img src={chambers} className='w-20 h-full object-cover' />
			<div className='flex-1 h-full  p-3 bg-glass flex justify-start items-start overflow-hidden'>
				<div className='flex-1 self-stretch inline-flex flex-col justify-between items-start'>
					<div className='self-stretch flex flex-col justify-start items-start gap-3'>
						<p className='self-stretch justify-end text-black text-base font-semibold font-barlow'>
							Chambers Bay
						</p>
						<p className='self-stretch justify-end text-black text-xs font-semibold font-barlow'>
							Seattle, WA
						</p>
					</div>
					<div className='self-stretch inline-flex justify-start items-start gap-2.5'>
						<p className='flex-1 justify-end text-black text-xs font-medium font-barlow'>
							June 30th, 2025
						</p>
					</div>
				</div>
				<div className='h-14 aspect-square p-1.5 rounded inset-shadows inline-flex flex-col justify-center items-center'>
					<p className='justify-end text-black text-4xl font-semibold font-barlow'>
						92
					</p>
				</div>
			</div>
		</div>
	);
}
