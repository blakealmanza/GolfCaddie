import { NavLink, Outlet } from 'react-router-dom';

export default function AppLayout() {
	return (
		<div>
			<nav style={{ display: 'flex', gap: '2rem' }}>
				<NavLink to='/'>Home</NavLink>
				<NavLink to='/round/abc'>Play Exisiting Course</NavLink>
				<NavLink to='/round/123'>Play New Course</NavLink>
			</nav>
			<main>
				<Outlet />
			</main>
		</div>
	);
}
