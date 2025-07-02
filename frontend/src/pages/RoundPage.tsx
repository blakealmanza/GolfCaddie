import {
	APIProvider,
	Map as GoogleMap,
	type MapMouseEvent,
	Marker,
} from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { Polyline } from '../components/map/geometry';
import { getDistance, type LatLng } from '../util/geoUtils';
import { suggestClub } from '../util/suggestClub';

export default function RoundPage() {
	const [userPosition, setUserPosition] = useState<LatLng | null>(null);
	const [target, setTarget] = useState<LatLng | null>(null);
	const [shotCount, setShotCount] = useState(0);
	const [shotSuggestion, setShotSuggestion] = useState<{
		club: string;
		distance: number;
	} | null>(null);

	const [mapCenter, setMapCenter] = useState<LatLng>({
		lat: 40,
		lng: -100,
	});

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				const coords = {
					lat: pos.coords.latitude,
					lng: pos.coords.longitude,
				};
				setUserPosition(coords);
				setMapCenter(coords);
			},
			(error) => {
				console.error('Geolocation failed', error);
			},
			{ enableHighAccuracy: true },
		);
	}, []);

	const handleMapClick = (e: MapMouseEvent) => {
		if (!e.detail.latLng) return;
		const newTarget: LatLng = {
			lat: e.detail.latLng.lat,
			lng: e.detail.latLng.lng,
		};
		setTarget(newTarget);
		if (userPosition) {
			const distance = Math.round(getDistance(userPosition, newTarget));
			const club = suggestClub(distance);
			setShotSuggestion({ club, distance });
		}
	};

	const handleMarkBall = () => {
		if (target) {
			setTarget(null);
			setShotCount((prev) => prev + 1);
		}
	};

	const lineCoords =
		userPosition && target
			? [
					{ lat: userPosition.lat, lng: userPosition.lng },
					{ lat: target.lat, lng: target.lng },
				]
			: [];

	return (
		<>
			<APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}>
				<GoogleMap
					defaultCenter={mapCenter}
					defaultZoom={3}
					disableDefaultUI={true}
					style={{ width: '100vw', height: '95vh' }}
					onClick={handleMapClick}
					mapTypeId='satellite'
				>
					{userPosition && (
						<Marker
							position={{ lat: userPosition.lat, lng: userPosition.lng }}
						/>
					)}
					{target && <Marker position={target} />}
					{lineCoords.length === 2 && (
						<Polyline
							path={lineCoords}
							strokeColor='#00ffff'
							strokeWeight={4}
						/>
					)}
				</GoogleMap>
			</APIProvider>

			<div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 1 }}>
				<button type='button' onClick={handleMarkBall}>
					Mark Ball Location
				</button>
				<button type='button' onClick={() => console.log('Finish Hole')}>
					Finish Hole
				</button>
				<button type='button' onClick={() => console.log('Next Hole')}>
					Next Hole
				</button>
				<div>Shots this hole: {shotCount}</div>
				<div>
					Suggested club:{' '}
					{target && shotSuggestion
						? `${shotSuggestion.club} (${shotSuggestion.distance} yards)`
						: 'No target'}
				</div>
			</div>
		</>
	);
}
