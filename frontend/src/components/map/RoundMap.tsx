import type { LatLng, RoundHole, Shot } from '@shared/types';
import {
	AdvancedMarker,
	APIProvider,
	Map as GoogleMap,
	type MapMouseEvent,
} from '@vis.gl/react-google-maps';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useMap } from '@/context/MapContext';
import { useRound } from '../../context/RoundContext';
import { getDistance } from '../../util/geoUtils';
import { suggestClub } from '../../util/suggestClub';
import { Polyline } from './geometry';
import MapControls from './MapControls';

function getMapCenter(tee: LatLng | null, pin: LatLng | null): LatLng {
	if (!tee || !pin) return { lat: 40, lng: -120 };

	return {
		lat: tee.lat * 0.7 + pin.lat * 0.3,
		lng: (tee.lng + pin.lng) / 2,
	};
}

function getMapHeading(
	tee: LatLng | null,
	pin: LatLng | null,
): number | undefined {
	if (!tee || !pin) return undefined;

	const dx = pin.lng - tee.lng;
	const dy = pin.lat - tee.lat;
	const angleRad = Math.atan2(dx, dy);
	const angleDeg = (angleRad * 180) / Math.PI;
	const heading = (angleDeg + 360) % 360;

	return heading;
}

export default function RoundMap() {
	const { state, dispatch } = useRound();
	const { holes, currentHoleIndex, selectedHoleIndex } = state;
	const controlsPortal = document.getElementById('map-controls-portal');

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

	const mapCenter = getMapCenter(teeCoords, pinCoords);
	const mapHeading = getMapHeading(teeCoords, pinCoords);

	useEffect(() => {
		if (mapState.target && mapState.userCoords) {
			const distance = getDistance(teeCoords!, mapState.target);
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

	// Marker styles
	const whiteDotStyle = {
		background: 'white',
		borderRadius: '50%',
		width: '12px',
		height: '12px',
		position: 'relative' as const,
		top: '6px',
		border: '2px solid white',
	};

	const targetMarkerStyle = {
		position: 'relative' as const,
		width: '24px',
		height: '24px',
	};

	const innerCircle = {
		background: 'white',
		borderRadius: '50%',
		width: '12px',
		height: '12px',
		position: 'absolute' as const,
		top: '16px',
		left: '6px',
		zIndex: 2,
	};

	const outerRing = {
		border: '2px solid white',
		borderRadius: '50%',
		width: '24px',
		height: '24px',
		position: 'absolute' as const,
		top: '10px',
		left: '0px',
		zIndex: 1,
	};

	const getMidpoint = (a: LatLng, b: LatLng): LatLng => ({
		lat: (a.lat + b.lat) / 2,
		lng: (a.lng + b.lng) / 2,
	});

	const lineMidpoints: { position: LatLng; label: string }[] = [];
	if (teeCoords && mapState.target && mapState.suggestion) {
		lineMidpoints.push({
			position: getMidpoint(teeCoords, mapState.target),
			label: `${mapState.suggestion.distance} - ${mapState.suggestion.club}`,
		});
	}
	if (mapState.target && pinCoords) {
		lineMidpoints.push({
			position: getMidpoint(mapState.target, pinCoords),
			label: `${getDistance(mapState.target, pinCoords)} - 8i`,
		});
	}

	return (
		<>
			<APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}>
				<GoogleMap
					center={mapCenter}
					heading={mapHeading}
					defaultZoom={17}
					minZoom={15}
					maxZoom={20}
					disableDefaultUI
					onClick={handleClick}
					mapTypeId='satellite'
					mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
				>
					{teeCoords && (
						<AdvancedMarker position={teeCoords}>
							<div style={whiteDotStyle} />
						</AdvancedMarker>
					)}
					{pinCoords && (
						<AdvancedMarker position={pinCoords}>
							<div style={whiteDotStyle} />
						</AdvancedMarker>
					)}
					{mapState.userCoords && (
						<AdvancedMarker position={mapState.userCoords}>
							<div
								style={{
									background: '#00d0ff',
									borderRadius: '50%',
									width: '14px',
									height: '14px',
									border: '2px solid #fff',
								}}
							/>
						</AdvancedMarker>
					)}
					{shots.length > 0 && (
						<AdvancedMarker position={shots[shots.length - 1].position}>
							<div
								style={{
									background: '#00d0ff',
									borderRadius: '50%',
									width: '14px',
									height: '14px',
									border: '2px solid #fff',
								}}
							/>
						</AdvancedMarker>
					)}
					{selectedHoleIndex === currentHoleIndex && mapState.target && (
						<AdvancedMarker position={mapState.target}>
							<div style={targetMarkerStyle}>
								<div style={outerRing} />
								<div style={innerCircle} />
							</div>
						</AdvancedMarker>
					)}
					<Polyline path={lineCoords} strokeColor='#ffffff' strokeWeight={4} />
					{lineMidpoints.map((mid) => (
						<AdvancedMarker
							key={mid.position.lat + mid.position.lng}
							position={mid.position}
						>
							<div
								style={{
									background: 'white',
									borderRadius: '8px',
									padding: '2px 6px',
									position: 'relative' as const,
									top: '6px',
									fontWeight: 600,
									fontSize: '14px',
									color: '#000',
									whiteSpace: 'nowrap',
									boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
								}}
							>
								{mid.label}
							</div>
						</AdvancedMarker>
					))}
					{controlsPortal &&
						createPortal(
							<MapControls
								userCoords={mapState.userCoords}
								setUserCoords={(coords) =>
									mapDispatch({ type: 'SET_USER_COORDS', payload: coords })
								}
							/>,
							controlsPortal,
						)}
				</GoogleMap>
			</APIProvider>
		</>
	);
}
