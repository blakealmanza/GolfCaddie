import type { ReactNode } from 'react';

type SecondaryLayoutProps = {
	children: ReactNode;
	background?: {
		src: string;
		alt: string;
	};
};

export default function SecondaryLayout({
	children,
	background,
}: SecondaryLayoutProps) {
	return (
		<main
			className='min-h-screen w-screen px-6 py-12 inline-flex flex-col justify-between items-start overflow-hidden bg-cover bg-center'
			style={
				background ? { backgroundImage: `url(${background.src})` } : undefined
			}
		>
			{background?.alt && <span className='sr-only'>{background.alt}</span>}
			{children}
		</main>
	);
}
