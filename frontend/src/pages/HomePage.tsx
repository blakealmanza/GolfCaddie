import type { Round } from '@shared/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InProgressCard from '@/components/cards/InProgressCard';
import PreviousRoundCard from '@/components/cards/PreviousRoundCard';
import Header from '@/components/Header';
import Section from '@/components/Section';
import ColoredButton from '@/components/ui/ColoredButton';
import { useCustomAuth } from '@/context/AuthContext';
import { fetchUserRounds } from '@/context/roundService';

export default function HomePage() {
	const { idToken } = useCustomAuth();
	const navigate = useNavigate();

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

	const handleStartNewRound = () => {
		navigate('/courses');
	};

	// Get the most recently played course for quick start option
	const getLastPlayedCourse = () => {
		if (finishedRounds.length === 0) return null;
		// Sort by startedAt date and get the most recent
		const sortedRounds = [...finishedRounds].sort(
			(a, b) =>
				new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
		);
		return sortedRounds[0];
	};

	const lastPlayedRound = getLastPlayedCourse();

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
			<div className='self-stretch flex flex-col gap-3'>
				<ColoredButton text='Start New Round' onClick={handleStartNewRound} />
				{lastPlayedRound && (
					<button
						type='button'
						onClick={() => navigate(`/courses/${lastPlayedRound.courseId}`)}
						className='self-stretch py-3 bg-glass rounded-lg drop-shadows border-glass inline-flex flex-col justify-center items-center overflow-hidden'
					>
						<p className='text-black text-base font-semibold font-barlow'>
							Quick Start: {lastPlayedRound.courseName}
						</p>
					</button>
				)}
			</div>
			<Section title='Previous Rounds'>
				{isLoading ? (
					<div className='self-stretch px-4 py-8 bg-glass rounded-lg drop-shadows border-glass text-center'>
						<p className='text-gray-600 text-sm font-medium font-barlow'>
							Loading your rounds...
						</p>
					</div>
				) : finishedRounds.length > 0 ? (
					finishedRounds.map((round) => (
						<PreviousRoundCard key={round.roundId} roundData={round} />
					))
				) : (
					<div className='self-stretch px-4 py-8 bg-glass rounded-lg drop-shadows border-glass text-center'>
						<p className='text-gray-600 text-sm font-medium font-barlow mb-2'>
							No previous rounds yet
						</p>
						<p className='text-gray-500 text-xs font-barlow'>
							Start your first round to see it here!
						</p>
					</div>
				)}
			</Section>
		</>
	);
}
