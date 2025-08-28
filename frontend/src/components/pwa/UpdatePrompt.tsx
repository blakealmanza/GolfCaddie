import { useUpdatePrompt } from '@/hooks/useUpdatePrompt';

export default function UpdatePrompt() {
	const { showPrompt, reloadApp } = useUpdatePrompt();

	return (
		<>
			{showPrompt && (
				<div className='update-banner'>
					<p>A new version is available!</p>
					<button type='button' onClick={reloadApp}>
						Update
					</button>
				</div>
			)}
		</>
	);
}
