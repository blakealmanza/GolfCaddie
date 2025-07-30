import type { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
	return (
		<main className='h-screen w-screen px-8 pt-16 pb-6 bg-background inline-flex flex-col justify-start items-center gap-8 overflow-hidden'>
			{children}
		</main>
	);
}
