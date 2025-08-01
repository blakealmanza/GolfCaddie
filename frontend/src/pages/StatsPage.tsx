import GlassCard from '@/components/cards/GlassCard';
import Header from '@/components/Header';
import Section from '@/components/Section';
import CircularGauge from '@/components/ui/CircularGauge';
import Graph from '@/components/ui/Graph';

export default function StatsPage() {
	return (
		<>
			<Header title='Stats' />
			<Section title='Trends'>
				<GlassCard
					className='inline-flex flex-col justify-start items-start'
					noPadding
				>
					<Graph />
				</GlassCard>
				<GlassCard className='inline-flex justify-around items-center'>
					<CircularGauge value={68} label='% fairways hit' />
					<CircularGauge value={44} label='% GIR' />
					<CircularGauge value={75} label='% 2-putts' />
				</GlassCard>
			</Section>
		</>
	);
}
