import { ControlPosition, MapControl, useMap } from '@vis.gl/react-google-maps';
import { useEffect, useRef, useState } from 'react';
import type { LatLng } from '../../util/geoUtils';

export default function MapControls({
	setUserCoords,
	userCoords,
}: {
	setUserCoords: (position: LatLng) => void;
	userCoords: LatLng | null;
}) {
	const map = useMap();
	const [isTracking, setIsTracking] = useState(false);
	const watchIdRef = useRef<number | null>(null);

	useEffect(() => {
		if (!map) return;

		toggleTracking();

		// Stop tracking on map drag
		const dragListener = map.addListener('dragstart', () => {
			if (isTracking && watchIdRef.current !== null) {
				navigator.geolocation.clearWatch(watchIdRef.current);
				watchIdRef.current = null;
				setIsTracking(false);
			}
		});

		return () => {
			dragListener.remove();
			if (watchIdRef.current !== null) {
				navigator.geolocation.clearWatch(watchIdRef.current);
			}
		};
	}, [map]);

	const toggleTracking = () => {
		if (!map) return;

		if (!isTracking) {
			const id = navigator.geolocation.watchPosition(
				(pos) => {
					const coords = {
						lat: pos.coords.latitude,
						lng: pos.coords.longitude,
					};
					setUserCoords(coords);
					map.panTo(coords);
					map.setZoom(17);
				},
				(err) => {
					console.error('Geolocation error:', err);
				},
				{ enableHighAccuracy: true },
			);
			watchIdRef.current = id;
			setIsTracking(true);
		} else if (userCoords) {
			map.panTo(userCoords);
			map.setZoom(17);
		}
	};

	const zoomIn = () => {
		if (map) {
			const zoom = map.getZoom();
			if (zoom != null) map.setZoom(zoom + 1);
		}
	};

	const zoomOut = () => {
		if (map) {
			const zoom = map.getZoom();
			if (zoom != null) map.setZoom(zoom - 1);
		}
	};

	return (
		<MapControl position={ControlPosition.RIGHT_TOP}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					marginRight: '1rem',
				}}
			>
				<button type='button' style={{ padding: '8px' }} onClick={zoomIn}>
					+
				</button>
				<button type='button' style={{ padding: '8px' }} onClick={zoomOut}>
					-
				</button>
				<button
					type='button'
					style={{ padding: '8px' }}
					onClick={toggleTracking}
				>
					Track
				</button>
			</div>
		</MapControl>
	);
}
