import {
	GeolocateControl,
	Layer,
	Map as MapLibre,
	Marker,
	Source,
} from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useState } from 'react';
import { createGeojsonLine, getDistance, type LatLng } from '../util/geoUtils';
import { suggestClub } from '../util/suggestClub';

export default function RoundPage() {
	const [userPosition, setUserPosition] = useState<LatLng | null>(null);
	const [target, setTarget] = useState<LatLng | null>(null);
	const [shotCount, setShotCount] = useState(0);
	const [shotSuggestion, setShotSuggestion] = useState<{
		club: string;
		distance: number;
	} | null>(null);

	const handleMapClick = (e: maplibregl.MapLayerMouseEvent) => {
		const lngLat = e.lngLat;
		const newTarget: LatLng = { lat: lngLat.lat, lng: lngLat.lng };
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

	const geojsonLine =
		userPosition && target ? createGeojsonLine(userPosition, target) : null;

	return (
		<>
			<MapLibre
				initialViewState={{
					latitude: 40,
					longitude: -100,
					zoom: 3,
				}}
				mapStyle={`https://api.maptiler.com/maps/satellite/style.json?key=${import.meta.env.VITE_MAPTILER_API_KEY}`}
				style={{ width: '100vw', height: '95vh' }}
				onClick={handleMapClick}
			>
				<GeolocateControl
					trackUserLocation={true}
					fitBoundsOptions={{ zoom: 17, offset: [0, 100] }}
					positionOptions={{ enableHighAccuracy: true }}
					onGeolocate={(e) => {
						const coords = {
							lat: e.coords.latitude,
							lng: e.coords.longitude,
						};
						setUserPosition(coords);
					}}
					onError={(e) => console.log(e)}
				/>
				{geojsonLine && (
					<Source id='line' type='geojson' data={geojsonLine}>
						<Layer
							id='lineLayer'
							type='line'
							paint={{
								'line-color': '#00ffff',
								'line-width': 4,
							}}
						/>
					</Source>
				)}
				{target && <Marker longitude={target.lng} latitude={target.lat} />}
			</MapLibre>

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
