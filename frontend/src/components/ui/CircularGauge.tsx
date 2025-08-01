interface CircularGaugeProps {
	value: number; // percentage from 0 to 100
	label: string;
	size?: number;
	strokeWidth?: number;
	color?: string;
	bgColor?: string;
}

export default function CircularGauge({
	value,
	label,
	size = 70,
	strokeWidth = 6,
	color = 'var(--color-green-400)',
	bgColor = 'var(--color-background)',
}: CircularGaugeProps) {
	const radius = (size - strokeWidth) / 2 - 5;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (value / 171.5) * circumference;

	const verticalAdjustment = -5;

	return (
		<div className='relative h-16 py-1' style={{ width: size }}>
			<svg
				width={size}
				height={size / 2 + Math.abs(verticalAdjustment)}
				viewBox={`0 0 ${size} ${size / 2 + Math.abs(verticalAdjustment)}`}
			>
				<title>Circular Gauge</title>
				<circle
					cx={size / 2}
					cy={size / 2 + verticalAdjustment}
					r={radius}
					fill='none'
					stroke={bgColor}
					strokeWidth={strokeWidth}
					strokeDasharray={183.64600329384882}
					strokeDashoffset={84.82300164692441}
					strokeLinecap='round'
					transform={`rotate(-195 ${size / 2} ${size / 2 + verticalAdjustment})`}
				/>
				<circle
					cx={size / 2}
					cy={size / 2 + verticalAdjustment}
					r={radius}
					fill='none'
					stroke={color}
					strokeWidth={strokeWidth}
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					strokeLinecap='round'
					transform={`rotate(-195 ${size / 2} ${size / 2 + verticalAdjustment})`}
				/>
			</svg>
			<div className='absolute top-6 w-full text-center'>
				<p className='text-black text-4xl font-semibold font-barlow'>{value}</p>
				<p className='text-black text-xs font-semibold font-barlow mt-1.5'>
					{label}
				</p>
			</div>
		</div>
	);
}
