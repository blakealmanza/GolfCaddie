import type { ReactNode } from 'react';
import Courses from '@/assets/courses.svg?react';
import Home from '@/assets/home.svg?react';
import Stats from '@/assets/stats.svg?react';

export default function NavBar() {
	return (
		<>
			<div className='fixed bottom-0 left-0 w-screen h-16 bg-gradient-to-b from-transparent to-background' />
			<nav className='fixed bottom-[32px] left-1/2 -translate-x-1/2 w-80 p-1 bg-glass rounded-full shadow-[0px_2px_5px_1px_rgba(0,0,0,0.15)] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.15)] border-glass backdrop-blur-md inline-flex justify-between items-start overflow-hidden'>
				<NavBarPiece icon={<Home />} text='Home' isActive={true} />
				<NavBarPiece icon={<Courses />} text='Courses' isActive={false} />
				<NavBarPiece icon={<Stats />} text='Stats' isActive={false} />
			</nav>
		</>
	);
}

function NavBarPiece({
	icon,
	text,
	isActive,
}: {
	icon: ReactNode;
	text: string;
	isActive: boolean;
}) {
	let classes =
		'flex-1 p-2 rounded-full inline-flex flex-col justify-center items-center gap-1.5 overflow-hidden';
	if (isActive) {
		classes += ' bg-glass border-glass';
	}

	return (
		<button type='button' className={classes}>
			<div className='w-6 h-6 relative overflow-hidden'>{icon}</div>
			<p className='justify-end text-black text-xs font-medium font-barlow'>
				{text}
			</p>
		</button>
	);
}
