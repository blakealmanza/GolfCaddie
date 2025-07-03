import {
	APIProvider,
	Map as GoogleMap,
	type MapMouseEvent,
	Marker,
} from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { getDistance, type LatLng } from '../../util/geoUtils';
import { suggestClub } from '../../util/suggestClub';
import { Polyline } from './geometry';
import MapControls from './MapControls';

export default function RoundMap({
	userPosition,
	setUserPosition,
	shots,
	selectingMode,
	setSelectingMode,
	target,
	setTarget,
}: {
	userPosition: LatLng | null;
	setUserPosition: (position: LatLng) => void;
	shots: LatLng[];
	selectingMode: 'tee' | 'hole' | null;
	setSelectingMode: (mode: 'tee' | 'hole' | null) => void;
	target: LatLng | null;
	setTarget: (position: LatLng | null) => void;
}) {
	const [teePosition, setCustomTeePosition] = useState<LatLng | null>(null);
	const [holePosition, setCustomHolePosition] = useState<LatLng | null>(null);

	const [shotSuggestion, setShotSuggestion] = useState<{
		club: string;
		distance: number;
	} | null>(null);

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

	useEffect(() => {
		if (!teePosition) {
			setSelectingMode('tee');
		} else if (!holePosition) {
			setSelectingMode('hole');
		}
	}, [teePosition, holePosition]);

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
			{target && shotSuggestion
				? `${shotSuggestion.club} (${shotSuggestion.distance} yards)`
				: 'No target'}
		</>
	);
}
