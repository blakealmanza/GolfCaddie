export default function GlassOutlineButton({
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
			className='flex-1 px-2 py-3 rounded-lg drop-shadows outline-2 outline-offset-[-2px] outline-white/70 inline-flex flex-col justify-center items-center overflow-hidden'
		>
			<p className='justify-end text-background text-base font-semibold font-barlow'>
				{text}
			</p>
		</button>
	);
}
