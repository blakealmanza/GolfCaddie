export default function Chip({ text }: { text: string }) {
	return (
		<div className='px-3 py-1.5 bg-glass rounded-[10px] border-glass inline-flex flex-col justify-center items-center'>
			<p className='justify-end text-black text-xs font-medium font-barlow'>
				{text}
			</p>
		</div>
	);
}
