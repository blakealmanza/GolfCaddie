import {
	APIProvider,
	Map as GoogleMap,
	type MapMouseEvent,
	Marker,
} from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { Polyline } from '../components/map/geometry';
import MapControls from '../components/map/MapControls';
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
	const [shots, setShots] = useState<LatLng[]>([]);

	const [selectingMode, setSelectingMode] = useState<'tee' | 'hole' | null>(
		null,
	);
	const [teePosition, setCustomTeePosition] = useState<LatLng | null>(null);
	const [holePosition, setCustomHolePosition] = useState<LatLng | null>(null);

	useEffect(() => {
		if (!teePosition) {
			setSelectingMode('tee');
		} else if (!holePosition) {
			setSelectingMode('hole');
		}
	}, [teePosition, holePosition]);

	const handleMapClick = (e: MapMouseEvent) => {
		if (!e.detail.latLng) return;
		const clicked: LatLng = {
			lat: e.detail.latLng.lat,
			lng: e.detail.latLng.lng,
		};

		if (selectingMode === 'tee') {
			setCustomTeePosition(clicked);
			setSelectingMode('hole');
			return;
		}
		if (selectingMode === 'hole') {
			setCustomHolePosition(clicked);
			setSelectingMode(null);
			return;
		}

		setTarget(clicked);
		if (userPosition) {
			const distance = Math.round(getDistance(userPosition, clicked));
			const club = suggestClub(distance);
			setShotSuggestion({ club, distance });
		}
	};

	const handleMarkBall = () => {
		if (userPosition) {
			setShots((prev) => [...prev, userPosition]);
			setTarget(null);
			setShotCount((prev) => prev + 1);
		}
	};

	const lineCoords: LatLng[] = [];
	if (teePosition) {
		lineCoords.push(teePosition);
	}
	if (shots.length > 0) {
		lineCoords.push(...shots);
	}
	if (target) {
		lineCoords.push(target);
	}
	if (holePosition) {
		lineCoords.push(holePosition);
	}

	return (
		<>
			<APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}>
				<GoogleMap
					defaultCenter={teePosition || { lat: 40, lng: -120 }}
					defaultZoom={17}
					minZoom={15}
					maxZoom={20}
					disableDefaultUI={true}
					style={{ width: '100vw', height: '95vh' }}
					onClick={handleMapClick}
					mapTypeId='satellite'
				>
					{/* Course markers */}
					{teePosition && <Marker position={teePosition} />}
					{holePosition && <Marker position={holePosition} />}

					{/* Live user location */}
					{userPosition && (
						<Marker
							position={{ lat: userPosition.lat, lng: userPosition.lng }}
						/>
					)}

					{/* Most recent shot marker */}
					{shots.length > 0 && <Marker position={shots[shots.length - 1]} />}

					{/* Target marker */}
					{target && <Marker position={target} />}

					{/* Shot path */}
					<Polyline path={lineCoords} strokeColor='#00ffff' strokeWeight={4} />

					<MapControls
						userPosition={userPosition}
						setUserPosition={setUserPosition}
					/>
				</GoogleMap>
			</APIProvider>

			{selectingMode && (
				<div
					style={{
						position: 'absolute',
						top: 10,
						left: 10,
						zIndex: 2,
						background: 'black',
						padding: '0.5rem 1rem',
						borderRadius: '4px',
					}}
				>
					{selectingMode === 'tee' && 'Tap the map to set the tee location'}
					{selectingMode === 'hole' && 'Tap the map to set the hole location'}
				</div>
			)}

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
