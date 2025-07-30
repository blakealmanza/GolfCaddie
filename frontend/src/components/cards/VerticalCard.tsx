export default function VerticalCard() {
	return (
		<div className='w-32 h-44 rounded-lg border-glass inline-flex flex-col justify-start items-start overflow-hidden shrink-0'>
			<div className='self-stretch h-24 flex flex-col justify-start items-center overflow-hidden'>
				<div className='self-stretch h-28 relative'>
					<img
						className='w-32 h-28 left-0 top-0 absolute'
						src='https://placehold.co/128x115'
					/>
				</div>
			</div>
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
