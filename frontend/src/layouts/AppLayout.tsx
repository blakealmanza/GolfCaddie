import { NavLink, Outlet } from 'react-router-dom';

export default function AppLayout() {
	return (
		<div>
			<nav>
				<NavLink to='/'>Home</NavLink>
				<NavLink to='/round/abc'>Round</NavLink>
			</nav>
			<main>
				<Outlet />
			</main>
		</div>
	);
}
