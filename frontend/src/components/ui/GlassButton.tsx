export default function GlassButton({
	text,
	onClick,
}: {
	text: string;
	onClick?: () => void;
}) {
	return (
		<button
			type='button'
			onClick={onClick}
			className='flex-1 px-2 py-3 bg-glass rounded-lg drop-shadows border-glass inline-flex flex-col justify-center items-center overflow-hidden'
		>
			<p className='justify-end text-black text-base font-semibold font-barlow'>
				{text}
			</p>
		</button>
	);
}
