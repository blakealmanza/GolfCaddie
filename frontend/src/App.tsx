import { useState } from 'react';
import appLogo from '/favicon.svg';
import reactLogo from './assets/react.svg';
import PWABadge from './PWABadge.tsx';
import './App.css';

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<div>
				<a href='https://vite.dev' target='_blank' rel='noopener'>
					<img src={appLogo} className='logo' alt='GolfCaddie logo' />
				</a>
				<a href='https://react.dev' target='_blank' rel='noopener'>
					<img src={reactLogo} className='logo react' alt='React logo' />
				</a>
			</div>
			<h1>GolfCaddie</h1>
			<div className='card'>
				<button type='button' onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className='read-the-docs'>
				Click on the Vite and React logos to learn more
			</p>
			<PWABadge />
		</>
	);
}

export default App;
