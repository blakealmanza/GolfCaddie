const clubSuggestions = [
	{ club: 'Lob Wedge', max: 60 },
	{ club: 'Sand Wedge', max: 90 },
	{ club: 'Pitching Wedge', max: 110 },
	{ club: '9 Iron', max: 130 },
	{ club: '7 Iron', max: 160 },
	{ club: '5 Iron', max: 200 },
	{ club: '3 Wood', max: 230 },
	{ club: 'Driver', max: 250 },
];

export function suggestClub(distanceYards: number): string {
	const suggestion =
		clubSuggestions.find((c) => distanceYards <= c.max) ?? clubSuggestions[0];
	return suggestion.club;
}
