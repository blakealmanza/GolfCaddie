import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './layouts/AppLayout.tsx';
import HomePage from './pages/HomePage.tsx';
import RoundPage from './pages/RoundPage.tsx';
import StartRoundPage from './pages/StartRoundPage.tsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <AppLayout />,
		children: [
			{ index: true, element: <HomePage /> },
			{
				path: 'start',
				element: <StartRoundPage />,
			},
			{
				path: 'round/:roundId',
				element: <RoundPage />,
			},
		],
	},
]);

const rootElement = document.getElementById('root');

if (rootElement) {
	createRoot(rootElement).render(
		// <StrictMode>
		<RouterProvider router={router} />,
		// </StrictMode>,
	);
} else {
	console.error('Root container not found');
}
