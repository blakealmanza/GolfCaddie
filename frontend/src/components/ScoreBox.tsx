export default function ScoreBox({ score }: { score: string }) {
	return (
		<div className='h-14 aspect-square p-1.5 rounded inset-shadows inline-flex flex-col justify-center items-center'>
			<p className='justify-end text-black text-4xl font-semibold font-barlow'>
				{score}
			</p>
		</div>
	);
}
