export default function HorizontalCard() {
	return (
		<div className='w-80 rounded-lg border-glass inline-flex justify-start items-start overflow-hidden shrink-0'>
			<div className='w-20 h-20 inline-flex flex-col justify-start items-center overflow-hidden'>
				<div className='w-24 flex-1 relative'>
					<img
						className='w-24 h-20 left-0 top-0 absolute'
						src='https://placehold.co/89x80'
					/>
				</div>
			</div>
			<div className='flex-1 h-20 p-3 bg-glass flex justify-start items-start gap-3 overflow-hidden'>
				<div className='flex-1 self-stretch inline-flex flex-col justify-between items-start'>
					<div className='self-stretch flex flex-col justify-start items-start gap-3'>
						<p className='self-stretch justify-end text-black text-base font-semibold font-barlow'>
							Chambers Bay
						</p>
						<p className='self-stretch justify-end text-black text-xs font-semibold font-barlow'>
							Seattle, WA
						</p>
					</div>
					<div className='self-stretch inline-flex justify-end items-start gap-1.5'>
						<div className='px-3 py-1.5 bg-glass rounded-full border-glass inline-flex flex-col justify-center items-center'>
							<p className='justify-end text-black text-xs font-medium font-barlow'>
								18 holes
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
		</div>
	);
}
