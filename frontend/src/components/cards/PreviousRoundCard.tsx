export default function PreviousRoundCard() {
	return (
		<div className='self-stretch rounded-lg border-glass inline-flex justify-start items-start overflow-hidden'>
			<div className='w-20 self-stretch inline-flex flex-col justify-start items-center overflow-hidden'>
				<div className='w-24 flex-1 relative'>
					<img
						className='w-24 h-20 left-0 top-0 absolute'
						src='https://placehold.co/89x80'
					/>
				</div>
			</div>
			<div className='flex-1 self-stretch p-3 bg-glass flex justify-start items-start overflow-hidden'>
				<div className='flex-1 self-stretch inline-flex flex-col justify-between items-start'>
					<div className='self-stretch flex flex-col justify-start items-start gap-3'>
						<div className='self-stretch justify-end text-black text-base font-semibold font-barlow'>
							Chambers Bay
						</div>
						<div className='self-stretch justify-end text-black text-xs font-semibold font-barlow'>
							Seattle, WA
						</div>
					</div>
					<div className='self-stretch inline-flex justify-start items-start gap-2.5'>
						<div className='flex-1 justify-end text-black text-xs font-medium font-barlow'>
							June 30th, 2025
						</div>
					</div>
				</div>
				<div className='h-full aspect-square p-1.5 rounded shadow-[inset_0px_3px_4px_0px_rgba(0,0,0,0.10)] shadow-[inset_0px_1px_1px_0px_rgba(0,0,0,0.25)] inline-flex flex-col justify-center items-center'>
					<div className='justify-end text-black text-4xl font-semibold font-barlow'>
						92
					</div>
				</div>
			</div>
		</div>
	);
}
