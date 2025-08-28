import { useEffect, useState } from 'react';

export function useInstallPrompt() {
	const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
	const [isInstallable, setIsInstallable] = useState(false);
	const [showSafariPrompt, setShowSafariPrompt] = useState(false);

	useEffect(() => {
		const ua = window.navigator.userAgent.toLowerCase();
		const isChrome = /chrome|chromium|crios/i.test(ua) && !/edge|edg/i.test(ua);
		const isSafari = /safari/i.test(ua) && !isChrome && !/android/i.test(ua);

		// Chrome/Edge only
		if (isChrome) {
			const handler = (e: Event) => {
				e.preventDefault();
				setDeferredPrompt(e);
				setIsInstallable(true);
			};
			window.addEventListener('beforeinstallprompt', handler);
			return () => window.removeEventListener('beforeinstallprompt', handler);
		}

		// Safari only (desktop or iOS)
		if (isSafari) {
			const isInStandaloneMode =
				'standalone' in window.navigator &&
				(window.navigator as any).standalone;
			if (!isInStandaloneMode) setShowSafariPrompt(true);
		}
	}, []);

	const promptInstall = async (): Promise<boolean> => {
		if (!deferredPrompt) return false;
		deferredPrompt.prompt();
		const choice = await deferredPrompt.userChoice;
		setDeferredPrompt(null);
		setIsInstallable(false);
		return choice.outcome === 'accepted';
	};

	const hideSafariPrompt = () => setShowSafariPrompt(false);

	return { isInstallable, promptInstall, showSafariPrompt, hideSafariPrompt };
}
