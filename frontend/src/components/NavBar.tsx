import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Courses from '@/assets/courses.svg?react';
import Home from '@/assets/home.svg?react';
import Stats from '@/assets/stats.svg?react';

export default function NavBar() {
	const location = useLocation();
	const navigate = useNavigate();

	return (
		<>
			<div className='fixed bottom-0 left-0 w-screen h-16 bg-gradient-to-b from-transparent to-background' />
			<nav className='fixed bottom-[32px] left-1/2 -translate-x-1/2 w-80 p-1 bg-glass border-glass blur-glass drop-shadows rounded-full inline-flex justify-between items-start overflow-hidden'>
				<NavBarPiece
					icon={<Home />}
					text='Home'
					isActive={location.pathname === '/'}
					onClick={() => navigate('/')}
				/>
				<NavBarPiece
					icon={<Courses />}
					text='Courses'
					isActive={location.pathname === '/courses'}
					onClick={() => navigate('/courses')}
				/>
				<NavBarPiece
					icon={<Stats />}
					text='Stats'
					isActive={location.pathname === '/stats'}
					onClick={() => navigate('/stats')}
				/>
			</nav>
		</>
	);
}

function NavBarPiece({
	icon,
	text,
	isActive,
	onClick,
}: {
	icon: ReactNode;
	text: string;
	isActive: boolean;
	onClick: () => void;
}) {
	let classes =
		'flex-1 p-2 rounded-full inline-flex flex-col justify-center items-center gap-1.5 overflow-hidden';
	if (isActive) {
		classes += ' bg-glass border-glass';
	}

	return (
		<button type='button' onClick={onClick} className={classes}>
			<div className='w-6 h-6 relative overflow-hidden'>{icon}</div>
			<p className='justify-end text-black text-xs font-medium font-barlow'>
				{text}
			</p>
		</button>
	);
}
