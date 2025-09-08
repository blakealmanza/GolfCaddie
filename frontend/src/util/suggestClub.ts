const clubSuggestions = [
	{ club: 'LW', max: 75 },
	{ club: 'SW', max: 90 },
	{ club: 'PW', max: 105 },
	{ club: '9i', max: 120 },
	{ club: '8i', max: 135 },
	{ club: '7i', max: 150 },
	{ club: '6i', max: 165 },
	{ club: '5i', max: 180 },
	{ club: '4i', max: 200 },
	{ club: '3W', max: 220 },
	{ club: 'D', max: 250 },
];

export function suggestClub(distanceYards: number): string {
	const suggestion =
		clubSuggestions.find((c) => distanceYards <= c.max) ??
		clubSuggestions[clubSuggestions.length - 1];
	return suggestion.club;
}
