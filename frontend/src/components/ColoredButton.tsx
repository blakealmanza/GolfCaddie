export default function ColoredButton({
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
			className='self-stretch py-3 bg-primary rounded-lg drop-shadows inline-flex flex-col justify-center items-center overflow-hidden'
		>
			<p className='text-white text-base font-semibold font-barlow'>{text}</p>
		</button>
	);
}
