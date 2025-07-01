import { NavLink, Outlet } from 'react-router-dom';

export default function AppLayout() {
	return (
		<div>
			<nav>
				<NavLink to='/'>Home</NavLink>
			</nav>
			<main>
				<Outlet />
			</main>
		</div>
	);
}
