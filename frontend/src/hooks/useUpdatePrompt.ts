import { useRegisterSW } from 'virtual:pwa-register/react';
import { useEffect, useRef, useState } from 'react';

export function useUpdatePrompt() {
	const [showPrompt, setShowPrompt] = useState(false);
	const [isDismissed, setIsDismissed] = useState(false);
	const firstCheck = useRef(true); // track initial mount

	const { needRefresh, updateServiceWorker } = useRegisterSW();

	// Don't show update prompt on localhost during development
	const isLocalhost =
		window.location.hostname === 'localhost' ||
		window.location.hostname === '127.0.0.1';

	useEffect(() => {
		if (firstCheck.current) {
			// skip first mount (initial SW registration)
			firstCheck.current = false;
			return;
		}

		// Don't show prompt on localhost or if already dismissed
		if (needRefresh && !isLocalhost && !isDismissed) {
			setShowPrompt(true);
		}
	}, [needRefresh, isLocalhost, isDismissed]);

	const reloadApp = () => {
		if (!updateServiceWorker) return;
		updateServiceWorker(true).then(() => {
			window.location.reload();
		});
	};

	const dismissPrompt = () => {
		setShowPrompt(false);
		setIsDismissed(true);
		// Reset dismissed state after 5 minutes to allow future updates
		setTimeout(
			() => {
				setIsDismissed(false);
			},
			5 * 60 * 1000,
		);
	};

	return { showPrompt, reloadApp, dismissPrompt };
}
