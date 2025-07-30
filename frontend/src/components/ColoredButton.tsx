export default function ColoredButton({ text }: { text: string }) {
	return (
		<button
			type='button'
			className='self-stretch py-3 bg-primary rounded-lg drop-shadows inline-flex flex-col justify-center items-center overflow-hidden'
		>
			<p className='text-white text-base font-semibold font-barlow'>{text}</p>
		</button>
	);
}
