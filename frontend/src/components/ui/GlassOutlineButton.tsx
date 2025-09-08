export default function GlassOutlineButton({
	text,
	onClick,
	className,
	disabled = false,
}: {
	text: string;
	onClick?: () => void;
	className?: string;
	disabled?: boolean;
}) {
	const classes = `flex-1 px-2 py-3 rounded-lg drop-shadows outline-2 outline-offset-[-2px] outline-white/70 inline-flex flex-col justify-center items-center overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed ${className}`;
	return (
		<button
			type='button'
			onClick={onClick}
			className={classes}
			disabled={disabled}
		>
			<p className='justify-end text-background text-base font-semibold font-barlow'>
				{text}
			</p>
		</button>
	);
}
