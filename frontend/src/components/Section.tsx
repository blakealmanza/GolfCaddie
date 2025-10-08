import type { ReactNode } from 'react';

export default function Section({
	title,
	isHorizontal = false,
	children,
}: {
	title: string;
	isHorizontal?: boolean;
	children: ReactNode;
}) {
	const classes = isHorizontal
		? 'w-full inline-flex justify-start items-start gap-3 overflow-x-auto overflow-y-hidden whitespace-nowrap'
		: 'w-full inline-flex flex-col justify-start items-start gap-3';

	return (
		<section className='w-full inline-flex flex-col justify-start items-start gap-3'>
			<h2 className='justify-end text-black text-base font-medium font-barlow'>
				{title}
			</h2>
			<div className={classes}>{children}</div>
		</section>
	);
}
