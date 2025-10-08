import { Outlet } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import InstallPrompt from '@/components/pwa/InstallPrompt';
import UpdatePrompt from '@/components/pwa/UpdatePrompt';

export default function MainLayout() {
	return (
		<div className='min-h-screen w-full bg-background flex justify-center'>
			<main className='w-full max-w-xl min-w-xs min-h-screen px-8 pt-16 pb-32 inline-flex flex-col justify-start items-center gap-8 overflow-y-auto'>
				<Outlet />
				<NavBar />
				<InstallPrompt />
				<UpdatePrompt />
			</main>
		</div>
	);
}
