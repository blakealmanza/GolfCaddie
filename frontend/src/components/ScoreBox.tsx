type Score = `+${number}` | `-${number}` | number | 'E' | 0;

const COLORS = {
	RED: {
		bg: 'bg-red-200',
		text: 'text-red-900',
	},
	YELLOW: {
		bg: 'bg-yellow-100',
		text: 'text-yellow-900',
	},
	GREEN: {
		bg: 'bg-green-200',
		text: 'text-green-900',
	},
};

function getColorByScore(score: Score): { bg: string; text: string } {
	// Handle 'E' (even par) case
	if (score === 'E') return COLORS.GREEN;

	// Handle 0 case (no score yet)
	if (score === 0) return COLORS.GREEN;

	const parsed =
		typeof score === 'string'
			? parseInt(score.slice(1)) * (score.startsWith('-') ? -1 : 1)
			: score;

	if (typeof score === 'string') {
		if (parsed >= 10) return COLORS.RED;
		if (parsed >= 4) return COLORS.YELLOW;
		return COLORS.GREEN;
	} else {
		if (parsed >= 100) return COLORS.RED;
		if (parsed >= 85) return COLORS.YELLOW;
		return COLORS.GREEN;
	}
}

export default function ScoreBox({ score }: { score: Score }) {
	const color = getColorByScore(score);

	return (
		<div
			className={`h-14 aspect-square p-1.5 rounded inset-shadows inline-flex flex-col justify-center items-center overflow-hidden ${color.bg}`}
		>
			<p
				className={`justify-end ${color.text} text-4xl font-semibold font-barlow`}
			>
				{score}
			</p>
		</div>
	);
}
