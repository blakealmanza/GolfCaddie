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
	if (!idToken) return null;

	const queryClient = useQueryClient();

	const { data: rounds = [], isLoading } = useQuery<Round[]>({
		queryKey: ['rounds'],
		queryFn: () => fetchUserRounds(idToken),
		enabled: typeof idToken === 'string' && idToken.length > 0,
		staleTime: 5 * 60 * 1000,
	});

	useEffect(() => {
		if (rounds.length > 0) {
			rounds.forEach((round) => {
				queryClient.setQueryData(['round', round.roundId], round);
			});
		}
	}, [rounds, queryClient]);

	return (
		<>
			<Header title='Home' />
			<Section title='Currently Playing'>
				<InProgressCard />
			</Section>
			<ColoredButton text='Start New Round' />
			<Section title='Previous Rounds'>
				{!isLoading &&
					rounds.map((round) => (
						<PreviousRoundCard key={round.roundId} roundData={round} />
					))}
			</Section>
		</>
	);
}
