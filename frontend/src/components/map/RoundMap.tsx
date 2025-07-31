import type { LatLng, RoundHole, Shot } from '@shared/types';
import {
	APIProvider,
	Map as GoogleMap,
	type MapMouseEvent,
	Marker,
} from '@vis.gl/react-google-maps';
import { useEffect } from 'react';
import { useMap } from '@/context/MapContext';
import { useRound } from '../../context/RoundContext';
import { getDistance } from '../../util/geoUtils';
import { suggestClub } from '../../util/suggestClub';
import { Polyline } from './geometry';
import MapControls from './MapControls';

export default function RoundMap() {
	const { state, dispatch } = useRound();
	const { holes, currentHoleIndex, selectedHoleIndex } = state;

	const { state: mapState, dispatch: mapDispatch } = useMap();

	const selectedHole = holes[selectedHoleIndex] || ({} as Partial<RoundHole>);

	useEffect(() => {
		if (selectedHole.tee && selectedHole.pin) {
			mapDispatch({ type: 'SET_SELECTING_MODE', payload: 'target' });
		}
	}, [selectedHole.tee, selectedHole.pin]);

	const teeCoords = selectedHole.tee;
	const pinCoords = selectedHole.pin;
	const shots: Shot[] = selectedHole.shots || [];

	useEffect(() => {
		if (mapState.target && mapState.userCoords) {
			const distance = getDistance(mapState.userCoords, mapState.target);
			mapDispatch({
				type: 'SET_SUGGESTION',
				payload: {
					club: suggestClub(distance),
					distance,
				},
			});
		} else {
			mapDispatch({ type: 'SET_SUGGESTION', payload: null });
		}
	}, [mapState.target, mapState.userCoords]);

	useEffect(() => {
		// Clear target when switching to a new hole
		mapDispatch({ type: 'SET_TARGET', payload: null });
		mapDispatch({ type: 'SET_SUGGESTION', payload: null });
	}, [selectedHoleIndex]);

	const handleClick = (e: MapMouseEvent) => {
		if (!e.detail.latLng || selectedHoleIndex !== currentHoleIndex) return;

		const pos: LatLng = {
			lat: e.detail.latLng.lat,
			lng: e.detail.latLng.lng,
		};

		if (mapState.selectingMode === 'tee') {
			dispatch({ type: 'SET_TEE', payload: pos });
			mapDispatch({ type: 'SET_SELECTING_MODE', payload: 'pin' });
		} else if (mapState.selectingMode === 'pin') {
			dispatch({ type: 'SET_PIN', payload: pos });
			mapDispatch({ type: 'SET_SELECTING_MODE', payload: 'target' });
		} else if (mapState.selectingMode === 'target') {
			mapDispatch({ type: 'SET_TARGET', payload: pos });
		}
	};

	const lineCoords: LatLng[] = [
		...(teeCoords ? [teeCoords] : []),
		...shots.map((s) => s.position),
		...(selectedHoleIndex === currentHoleIndex && mapState.target
			? [mapState.target]
			: []),
		...(pinCoords ? [pinCoords] : []),
	];

	return (
		<>
			<APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}>
				<GoogleMap
					defaultCenter={teeCoords || { lat: 40, lng: -120 }}
					defaultZoom={17}
					minZoom={15}
					maxZoom={20}
					disableDefaultUI
					onClick={handleClick}
					mapTypeId='satellite'
				>
					{teeCoords && <Marker position={teeCoords} />}
					{pinCoords && <Marker position={pinCoords} />}
					{mapState.userCoords && <Marker position={mapState.userCoords} />}
					{shots.length > 0 && (
						<Marker position={shots[shots.length - 1].position} />
					)}
					{selectedHoleIndex === currentHoleIndex && mapState.target && (
						<Marker position={mapState.target} />
					)}
					<Polyline path={lineCoords} strokeColor='#00ffff' strokeWeight={4} />
					<MapControls
						userCoords={mapState.userCoords}
						setUserCoords={(coords) =>
							mapDispatch({ type: 'SET_USER_COORDS', payload: coords })
						}
					/>
				</GoogleMap>
			</APIProvider>
		</>
	);
}
