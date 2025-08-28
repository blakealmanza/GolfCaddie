import { useInstallPrompt } from '@/hooks/useInstallPrompt';

export default function InstallPrompt() {
	const { isInstallable, promptInstall, showSafariPrompt, hideSafariPrompt } =
		useInstallPrompt();

	return (
		<>
			{/* Chrome/Chromium install prompt */}
			{isInstallable && (
				<button type='button' onClick={promptInstall}>
					Add GolfCaddie to Home Screen
				</button>
			)}

			{/* Safari manual install banner */}
			{showSafariPrompt && (
				<div className='safari-install-banner'>
					<p>Install GolfCaddie on Safari: tap Share → Add to Home Screen</p>
					<button type='button' onClick={hideSafariPrompt}>
						Dismiss
					</button>
				</div>
			)}
		</>
	);
}
