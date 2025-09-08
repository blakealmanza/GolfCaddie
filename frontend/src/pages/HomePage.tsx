import type { Round } from '@shared/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import InProgressCard from '@/components/cards/InProgressCard';
import PreviousRoundCard from '@/components/cards/PreviousRoundCard';
import Header from '@/components/Header';
import Section from '@/components/Section';
import ColoredButton from '@/components/ui/ColoredButton';
import { useCustomAuth } from '@/context/AuthContext';
import { fetchUserRounds } from '@/context/roundService';

export default function HomePage() {
	const { idToken } = useCustomAuth();

	const queryClient = useQueryClient();

	const { data: rounds = [], isLoading } = useQuery<Round[]>({
		queryKey: ['rounds'],
		queryFn: () => {
			if (!idToken) throw new Error('No authentication token');
			return fetchUserRounds(idToken);
		},
		enabled: !!idToken, // only run query if idToken exists
		staleTime: 5 * 60 * 1000,
	});

	useEffect(() => {
		if (rounds.length > 0) {
			rounds.forEach((round) => {
				queryClient.setQueryData(['round', round.roundId], round);
			});
		}
	}, [rounds, queryClient]);

	if (!idToken) return null;

	// Filter rounds by state
	const activeRounds = rounds.filter(
		(round) => round.state === 'in_progress' || round.state === 'paused',
	);
	const finishedRounds = rounds.filter((round) => round.state === 'finished');

	return (
		<>
			<Header title='Home' />
			{activeRounds.length > 0 && (
				<Section title='Currently Playing'>
					{activeRounds.map((round) => (
						<InProgressCard key={round.roundId} roundData={round} />
					))}
				</Section>
			)}
			<ColoredButton text='Start New Round' />
			<Section title='Previous Rounds'>
				{!isLoading &&
					finishedRounds.map((round) => (
						<PreviousRoundCard key={round.roundId} roundData={round} />
					))}
			</Section>
		</>
	);
}
