import type { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
	return (
		<main className='min-h-screen w-screen px-8 pt-16 pb-32 bg-background inline-flex flex-col justify-start items-center gap-8 overflow-y-auto'>
			{children}
		</main>
	);
}
