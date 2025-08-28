import { useRegisterSW } from 'virtual:pwa-register/react';
import { useEffect, useRef, useState } from 'react';

export function useUpdatePrompt() {
	const [showPrompt, setShowPrompt] = useState(false);
	const firstCheck = useRef(true); // track initial mount

	const { needRefresh, updateServiceWorker } = useRegisterSW();

	useEffect(() => {
		if (firstCheck.current) {
			// skip first mount (initial SW registration)
			firstCheck.current = false;
			return;
		}

		if (needRefresh) {
			setShowPrompt(true);
		}
	}, [needRefresh]);

	const reloadApp = () => {
		if (!updateServiceWorker) return;
		updateServiceWorker(true).then(() => {
			window.location.reload();
		});
	};

	return { showPrompt, reloadApp };
}
