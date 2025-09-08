import { useNavigate } from 'react-router-dom';
import GlassButton from '@/components/ui/GlassButton';
import GlassOutlineButton from '@/components/ui/GlassOutlineButton';

type ExitRoundModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onEndRound: () => void;
	onPauseRound: () => void;
	isEndingRound?: boolean;
	isPausingRound?: boolean;
};

export default function ExitRoundModal({
	isOpen,
	onClose,
	onEndRound,
	onPauseRound,
	isEndingRound = false,
	isPausingRound = false,
}: ExitRoundModalProps) {
	const navigate = useNavigate();

	if (!isOpen) return null;

	const handleEndRound = () => {
		onEndRound();
		navigate('/');
	};

	const handlePauseRound = () => {
		onPauseRound();
		navigate('/');
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
			<div className='pointer-events-auto  p-4 bg-glass rounded-lg drop-shadows border-glass backdrop-blur-md inline-flex flex-col justify-center items-center gap-8 overflow-hidden max-w-sm mx-4'>
				<div className='self-stretch inline-flex flex-col justify-center items-center gap-4'>
					<p className='text-black text-xl font-semibold font-barlow text-center'>
						Exit Round
					</p>
					<p className='text-black text-sm font-medium font-barlow text-center'>
						What would you like to do with this round?
					</p>
				</div>

				<div className='self-stretch inline-flex flex-col justify-start items-start gap-3'>
					<div className='self-stretch inline-flex justify-center items-center gap-2'>
						<GlassButton
							text='End Round'
							onClick={handleEndRound}
							loading={isEndingRound}
							disabled={isEndingRound || isPausingRound}
						/>
						<GlassButton
							text='Pause Round'
							onClick={handlePauseRound}
							loading={isPausingRound}
							disabled={isEndingRound || isPausingRound}
						/>
					</div>
					<GlassOutlineButton
						text='Cancel'
						onClick={onClose}
						className='w-full'
						disabled={isEndingRound || isPausingRound}
						textColor='black'
					/>
				</div>
			</div>
		</div>
	);
}
