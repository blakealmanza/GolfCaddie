import type { ReactNode } from 'react';

export default function SecondaryLayout({ children }: { children: ReactNode }) {
	return (
		<main className='min-h-screen w-screen px-6 py-12 bg-background inline-flex flex-col justify-between items-start overflow-hidden'>
			{children}
		</main>
	);
}
