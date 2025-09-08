import GlassButton from '@/components/ui/GlassButton';
import GlassOutlineButton from '@/components/ui/GlassOutlineButton';
import { useUpdatePrompt } from '@/hooks/useUpdatePrompt';

export default function UpdatePrompt() {
	const { showPrompt, reloadApp, dismissPrompt } = useUpdatePrompt();

	return (
		<>
			{showPrompt && (
				<div className='fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-4/5 max-w-sm'>
					<div className='bg-glass rounded-lg drop-shadows border-glass backdrop-blur-md p-4'>
						<div className='flex flex-col gap-3'>
							<div className='text-center gap-4 flex flex-col'>
								<p className='text-black text-lg font-semibold font-barlow'>
									Update Available
								</p>
								<p className='text-black text-sm font-medium font-barlow'>
									A new version of GolfCaddie is ready
								</p>
							</div>
							<div className='flex gap-2'>
								<GlassButton
									text='Update Now'
									onClick={reloadApp}
									className='flex-1'
								/>
								<GlassOutlineButton
									text='Later'
									onClick={dismissPrompt}
									className='flex-1'
									textColor='black'
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
