import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import Courses from '@/assets/courses.svg?react';
import Home from '@/assets/home.svg?react';
import Stats from '@/assets/stats.svg?react';

export default function NavBar() {
	return (
		<>
			<div className='fixed bottom-0 left-0 w-screen h-16 bg-gradient-to-b from-transparent to-background' />
			<nav className='fixed bottom-[32px] left-1/2 -translate-x-1/2 w-80 p-1 bg-glass border-glass blur-glass drop-shadows rounded-full inline-flex justify-between items-start overflow-hidden'>
				<NavBarPiece icon={<Home />} text='Home' to='/' />
				<NavBarPiece icon={<Courses />} text='Courses' to='/courses' />
				<NavBarPiece icon={<Stats />} text='Stats' to='/stats' />
			</nav>
		</>
	);
}

function NavBarPiece({
	icon,
	text,
	to,
}: {
	icon: ReactNode;
	text: string;
	to: string;
}) {
	return (
		<NavLink
			to={to}
			className={({ isActive }) =>
				[
					'flex-1 p-2 rounded-full inline-flex flex-col justify-center items-center gap-1.5 overflow-hidden',
					isActive ? 'bg-glass border-glass' : '',
				].join(' ')
			}
		>
			<div className='w-6 h-6 relative overflow-hidden'>{icon}</div>
			<p className='justify-end text-black text-xs font-medium font-barlow'>
				{text}
			</p>
		</NavLink>
	);
}
