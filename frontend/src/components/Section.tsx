import type { ReactNode } from 'react';

export default function Section({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<section className='w-full inline-flex flex-col justify-start items-start gap-3 overflow-hidden'>
			<h2 className='justify-end text-black text-base font-medium font-barlow'>
				{title}
			</h2>
			{children}
		</section>
	);
}
