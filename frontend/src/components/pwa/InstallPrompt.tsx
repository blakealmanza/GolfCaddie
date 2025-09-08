import GlassButton from '@/components/ui/GlassButton';
import GlassOutlineButton from '@/components/ui/GlassOutlineButton';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';

export default function InstallPrompt() {
	const { isInstallable, promptInstall, showSafariPrompt, hideSafariPrompt } =
		useInstallPrompt();

	return (
		<>
			{/* Chrome/Chromium install prompt */}
			{isInstallable && (
				<div className='fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 w-4/5 max-w-sm'>
					<div className='bg-glass rounded-lg drop-shadows border-glass backdrop-blur-md p-4'>
						<div className='flex flex-col gap-3'>
							<div className='text-center'>
								<p className='text-black text-lg font-semibold font-barlow'>
									Install GolfCaddie
								</p>
								<p className='text-black text-sm font-medium font-barlow mt-1'>
									Add to your home screen for quick access
								</p>
							</div>
							<div className='flex gap-2'>
								<GlassButton
									text='Install'
									onClick={promptInstall}
									className='flex-1'
								/>
								<GlassOutlineButton
									text='Later'
									onClick={hideSafariPrompt}
									className='flex-1'
									textColor='black'
								/>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Safari manual install banner */}
			{showSafariPrompt && (
				<div className='fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 w-4/5 max-w-sm'>
					<div className='bg-glass rounded-lg drop-shadows border-glass backdrop-blur-md p-4'>
						<div className='flex flex-col gap-3'>
							<div className='text-center gap-4 flex flex-col'>
								<p className='text-black text-lg font-semibold font-barlow'>
									Install GolfCaddie
								</p>
								<p className='text-black text-sm font-medium font-barlow'>
									Tap Share → Add to Home Screen
								</p>
							</div>
							<GlassOutlineButton
								text='Got it'
								onClick={hideSafariPrompt}
								className='w-full'
								textColor='black'
							/>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
