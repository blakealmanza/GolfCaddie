export default function Graph() {
	return (
		<>
			<div className='self-stretch p-2 inline-flex justify-between items-center overflow-hidden'>
				<div className='w-16 h-16 p-2 rounded-lg outline-2 outline-offset-[-2px] outline-text inline-flex flex-col justify-center items-center gap-2 overflow-hidden'>
					<p className='justify-end text-black text-4xl font-semibold font-barlow'>
						31
					</p>
					<p className='justify-end text-black text-xs font-semibold font-barlow'>
						HCI
					</p>
				</div>
				<div className='flex justify-center items-center gap-1 overflow-hidden'>
					<div className='p-2 inline-flex flex-col justify-center items-center gap-2 overflow-hidden'>
						<p className='justify-end text-black text-2xl font-semibold font-barlow leading-relaxed'>
							43
						</p>
						<p className='justify-end text-black text-xs font-semibold font-barlow'>
							high
						</p>
					</div>
					<div className='w-px h-7 relative bg-zinc-300' />
					<div className='p-2 inline-flex flex-col justify-center items-center gap-2 overflow-hidden'>
						<p className='justify-end text-black text-2xl font-semibold font-barlow leading-relaxed'>
							27
						</p>
						<p className='justify-end text-black text-xs font-semibold font-barlow'>
							low
						</p>
					</div>
				</div>
			</div>
			<div className='self-stretch py-2 flex flex-col justify-start items-start gap-2.5 overflow-hidden'>
				<div className='self-stretch h-10 outline-2 outline-offset-[-1px] outline-black' />
				<div className='self-stretch inline-flex justify-start items-start overflow-hidden'>
					<div className='flex-1 p-1 inline-flex flex-col justify-center items-center gap-2.5'>
						<p className='justify-end text-black text-xs font-semibold font-barlow'>
							Apr.
						</p>
					</div>
					<div className='flex-1 p-1 inline-flex flex-col justify-center items-center gap-2.5'>
						<p className='justify-end text-black text-xs font-semibold font-barlow'>
							May
						</p>
					</div>
					<div className='flex-1 p-1 inline-flex flex-col justify-center items-center gap-2.5'>
						<p className='justify-end text-black text-xs font-semibold font-barlow'>
							June
						</p>
					</div>
					<div className='flex-1 p-1 inline-flex flex-col justify-center items-center gap-2.5'>
						<p className='justify-end text-black text-xs font-semibold font-barlow'>
							July
						</p>
					</div>
					<div className='flex-1 p-1 inline-flex flex-col justify-center items-center gap-2.5'>
						<p className='justify-end text-black text-xs font-semibold font-barlow'>
							Aug.
						</p>
					</div>
					<div className='flex-1 p-1 inline-flex flex-col justify-center items-center gap-2.5'>
						<p className='justify-end text-black text-xs font-semibold font-barlow'>
							Sept.
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
