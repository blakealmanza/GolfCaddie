import { createRoot } from 'react-dom/client';
import './index.css';
import { AuthProvider } from 'react-oidc-context';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './layouts/AppLayout.tsx';
import HomePage from './pages/HomePage.tsx';
import RoundPage from './pages/RoundPage.tsx';
import StartRoundPage from './pages/StartRoundPage.tsx';

const cognitoAuthConfig = {
	authority: import.meta.env.VITE_COGNITO_AUTHORITY,
	client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
	redirect_uri:
		import.meta.env.MODE === 'development'
			? import.meta.env.VITE_COGNITO_REDIRECT_URI_DEV
			: import.meta.env.VITE_COGNITO_REDIRECT_URI_PROD,
	response_type: 'code',
	scope: 'aws.cognito.signin.user.admin email openid',
};

const router = createBrowserRouter([
	{
		path: '/',
		element: <AppLayout />,
		children: [
			{ index: true, element: <HomePage /> },
			{ path: 'start', element: <StartRoundPage /> },
			{ path: 'round/:roundId', element: <RoundPage /> },
		],
	},
]);

const rootElement = document.getElementById('root');

if (rootElement) {
	createRoot(rootElement).render(
		// <React.StrictMode>
		<AuthProvider {...cognitoAuthConfig}>
			<RouterProvider router={router} />
		</AuthProvider>,
		// </React.StrictMode>
	);
} else {
	console.error('Root container not found');
}
