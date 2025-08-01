import type { ReactNode } from 'react';

export default function GlassCard({
	children,
	className,
	noPadding,
}: {
	children: ReactNode;
	className?: string;
	noPadding?: boolean;
}) {
	const padding = noPadding ? '' : 'p-2';

	return (
		<div
			className={`${className} self-stretch ${padding} bg-glass rounded-lg border-glass overflow-hidden`}
		>
			{children}
		</div>
	);
}
