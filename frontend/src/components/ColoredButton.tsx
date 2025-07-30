export default function ColoredButton({ text }: { text: string }) {
	return (
		<button
			type='button'
			className='self-stretch py-3 bg-primary rounded-lg shadow-[0px_2px_5px_1px_rgba(0,0,0,0.15)] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.15)] inline-flex flex-col justify-center items-center overflow-hidden'
		>
			<p className='text-white text-base font-semibold font-barlow'>{text}</p>
		</button>
	);
}
