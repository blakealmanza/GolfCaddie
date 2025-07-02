import { ControlPosition, MapControl, useMap } from '@vis.gl/react-google-maps';

export default function MapControls() {
	const map = useMap();

	const zoomIn = () => {
		if (map) map.setZoom((map.getZoom() ?? 0) + 1);
	};

	const zoomOut = () => {
		if (map) map.setZoom((map.getZoom() ?? 0) - 1);
	};

	return (
		<MapControl position={ControlPosition.RIGHT_TOP}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					background: 'white',
					borderRadius: '4px',
					boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
					overflow: 'hidden',
					marginBottom: '1rem',
					marginRight: '1rem',
				}}
			>
				<button type='button' style={{ padding: '8px' }} onClick={zoomIn}>
					➕
				</button>
				<button type='button' style={{ padding: '8px' }} onClick={zoomOut}>
					➖
				</button>
				<button
					type='button'
					style={{ padding: '8px' }}
					onClick={() => console.log('tracking')}
				>
					📍
				</button>
			</div>
		</MapControl>
	);
}
