import { Outlet } from 'react-router-dom';
import NavBar from '@/components/NavBar';

export default function MainLayout() {
	return (
		<main className='min-h-screen w-screen px-8 pt-16 pb-32 bg-background inline-flex flex-col justify-start items-center gap-8 overflow-y-auto'>
			<Outlet />
			<NavBar />
		</main>
	);
}
