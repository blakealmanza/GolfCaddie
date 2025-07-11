import { NavLink, Outlet } from 'react-router-dom';

export default function AppLayout() {
	return (
		<div>
			<nav style={{ display: 'flex', gap: '2rem' }}>
				<NavLink to='/'>Home</NavLink>
				<NavLink to='/start'>Start Round</NavLink>
			</nav>
			<main>
				<Outlet />
			</main>
		</div>
	);
}
