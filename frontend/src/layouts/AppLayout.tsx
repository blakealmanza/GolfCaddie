import { useAuth } from 'react-oidc-context';
import { NavLink, Outlet } from 'react-router-dom';

export default function AppLayout() {
	const auth = useAuth();

	if (auth.isLoading) {
		return <div>Loading...</div>; // TODO: change to splash
	}

	if (auth.error) {
		return <div>Error: {auth.error.message}</div>;
	}

	if (!auth.isAuthenticated) {
		auth.signinRedirect();
		return null;
	}

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
