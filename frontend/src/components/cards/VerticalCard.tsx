import chambers from '../../../public/chambers.png';

export default function VerticalCard() {
	return (
		<div className='w-32 h-44 rounded-lg border-glass inline-flex flex-col justify-start items-start overflow-hidden shrink-0'>
			<img src={chambers} className='self-stretch h-24 object-cover' />
			<div className='self-stretch flex-1 p-3 bg-glass flex flex-col justify-between items-start overflow-hidden'>
				<p className='self-stretch justify-end text-black text-base font-semibold font-barlow'>
					Chambers Bay
				</p>
				<p className='self-stretch justify-end text-black text-xs font-semibold font-barlow'>
					Seattle, WA
				</p>
			</div>
		</div>
	);
}
