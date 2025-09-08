import { createRoot } from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from 'react-oidc-context';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthWrapper } from './context/AuthContext.tsx';
import MainLayout from './layouts/MainLayout.tsx';
import CoursePreviewPage from './pages/CoursePreviewPage.tsx';
import CoursesPage from './pages/CoursesPage.tsx';
import HomePage from './pages/HomePage.tsx';
import RoundPage from './pages/RoundPage.tsx';
import StatsPage from './pages/StatsPage.tsx';

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
		element: <MainLayout />,
		children: [
			{ path: '/', element: <HomePage /> },
			{ path: '/courses', element: <CoursesPage /> },
			{ path: '/stats', element: <StatsPage /> },
		],
	},
	{ path: '/courses/:id', element: <CoursePreviewPage /> },
	{ path: '/courses/:id/preview', element: <RoundPage /> },
	{ path: 'round/:id', element: <RoundPage /> },
]);

const queryClient = new QueryClient();

const rootElement = document.getElementById('root');

if (rootElement) {
	createRoot(rootElement).render(
		// <React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<AuthProvider {...cognitoAuthConfig}>
				<AuthWrapper>
					<RouterProvider router={router} />
				</AuthWrapper>
			</AuthProvider>
		</QueryClientProvider>,
		// </React.StrictMode>
	);
} else {
	console.error('Root container not found');
}
