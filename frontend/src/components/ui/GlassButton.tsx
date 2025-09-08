export default function GlassButton({
	text,
	onClick,
	loading = false,
	disabled = false,
}: {
	text: string;
	onClick?: () => void;
	loading?: boolean;
	disabled?: boolean;
}) {
	return (
		<button
			type='button'
			onClick={onClick}
			disabled={disabled || loading}
			className='flex-1 px-2 py-3 bg-glass rounded-lg drop-shadows border-glass inline-flex flex-col justify-center items-center overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed'
		>
			{loading ? (
				<div className='flex items-center gap-2'>
					<div className='w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin' />
					<p className='justify-end text-black text-base font-semibold font-barlow'>
						Starting...
					</p>
				</div>
			) : (
				<p className='justify-end text-black text-base font-semibold font-barlow'>
					{text}
				</p>
			)}
		</button>
	);
}
