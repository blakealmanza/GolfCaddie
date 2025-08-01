import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Courses from '@/assets/courses.svg?react';
import Home from '@/assets/home.svg?react';
import Stats from '@/assets/stats.svg?react';

export default function NavBar() {
	return (
		<>
			<div className='fixed bottom-0 left-0 w-screen h-16 bg-gradient-to-b from-transparent to-background' />
			<nav className='fixed bottom-[32px] left-1/2 -translate-x-1/2 w-80 p-1 bg-glass border-glass blur-glass drop-shadows rounded-full inline-flex justify-between items-start overflow-hidden'>
				<NavBarPiece
					icon={<Home className='text-black' />}
					text='Home'
					to='/'
				/>
				<NavBarPiece
					icon={<Courses className='text-black' />}
					text='Courses'
					to='/courses'
				/>
				<NavBarPiece
					icon={<Stats className='text-black' />}
					text='Stats'
					to='/stats'
				/>
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
	const location = useLocation();
	const isActive = location.pathname === to;

	return (
		<div className='relative flex-1'>
			{isActive && (
				<motion.div
					layoutId='nav-highlight'
					className='absolute inset-0 bg-glass border-glass rounded-full z-0'
					transition={{ type: 'tween', duration: 0.25 }}
				/>
			)}
			<NavLink
				to={to}
				className='relative z-10 flex flex-1 p-2 rounded-full flex-col justify-center items-center gap-1.5 overflow-hidden'
			>
				<div className='w-6 h-6 relative overflow-hidden'>{icon}</div>
				<p className='justify-end text-black text-xs font-medium font-barlow'>
					{text}
				</p>
			</NavLink>
		</div>
	);
}
