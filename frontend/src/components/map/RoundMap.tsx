import {
	APIProvider,
	Map as GoogleMap,
	type MapMouseEvent,
	Marker,
} from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import type {
	LatLng,
	RoundHole,
	SelectingMode,
	Shot,
	ShotSuggestion,
} from '@/types';
import { useRound } from '../../context/RoundContext';
import { getDistance } from '../../util/geoUtils';
import { suggestClub } from '../../util/suggestClub';
import { Polyline } from './geometry';
import MapControls from './MapControls';

export default function RoundMap({
	children,
}: {
	children: (props: {
		addShot: () => void;
		setSelectingMode: (mode: SelectingMode) => void;
	}) => React.ReactNode;
}) {
	const { state, dispatch } = useRound();
	const { holes, currentHoleIndex, selectedHoleIndex } = state;

	const [target, setTarget] = useState<LatLng | null>(null);
	const [suggestion, setSuggestion] = useState<ShotSuggestion | null>(null);
	const [userCoords, setUserCoords] = useState<LatLng | null>(null);
	const [selectingMode, setSelectingMode] = useState<SelectingMode>('tee');

	const selectedHole = holes[selectedHoleIndex] || ({} as Partial<RoundHole>);

	useEffect(() => {
		if (selectedHole.tee && selectedHole.pin) {
			setSelectingMode('target');
		}
	}, [selectedHole.tee, selectedHole.pin]);

	const teeCoords = selectedHole.tee;
	const pinCoords = selectedHole.pin;
	const shots: Shot[] = selectedHole.shots || [];

	useEffect(() => {
		if (target && userCoords) {
			const distance = getDistance(userCoords, target);
			setSuggestion({
				club: suggestClub(distance),
				distance,
			});
		} else {
			setSuggestion(null);
		}
	}, [target, userCoords]);

	useEffect(() => {
		// Clear target when switching to a new hole
		setTarget(null);
		setSuggestion(null);
	}, [selectedHoleIndex]);

	const handleClick = (e: MapMouseEvent) => {
		if (!e.detail.latLng || selectedHoleIndex !== currentHoleIndex) return;

		const pos: LatLng = {
			lat: e.detail.latLng.lat,
			lng: e.detail.latLng.lng,
		};

		if (selectingMode === 'tee') {
			dispatch({ type: 'SET_TEE', payload: pos });
			setSelectingMode('pin');
		} else if (selectingMode === 'pin') {
			dispatch({ type: 'SET_PIN', payload: pos });
			setSelectingMode('target');
		} else if (selectingMode === 'target') {
			setTarget(pos);
		}
	};

	const addShot = () => {
		if (!userCoords) return;
		dispatch({
			type: 'ADD_SHOT',
			payload: {
				position: userCoords,
				target,
				suggestion,
			},
		});
		setTarget(null);
		setSuggestion(null);
	};

	const lineCoords: LatLng[] = [
		...(teeCoords ? [teeCoords] : []),
		...shots.map((s) => s.position),
		...(selectedHoleIndex === currentHoleIndex && target ? [target] : []),
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
					style={{ width: '100vw', height: '95vh' }}
					onClick={handleClick}
					mapTypeId='satellite'
				>
					{teeCoords && <Marker position={teeCoords} />}
					{pinCoords && <Marker position={pinCoords} />}
					{userCoords && <Marker position={userCoords} />}
					{shots.length > 0 && (
						<Marker position={shots[shots.length - 1].position} />
					)}
					{selectedHoleIndex === currentHoleIndex && target && (
						<Marker position={target} />
					)}
					<Polyline path={lineCoords} strokeColor='#00ffff' strokeWeight={4} />
					<MapControls userCoords={userCoords} setUserCoords={setUserCoords} />
				</GoogleMap>
			</APIProvider>
			{children({ addShot, setSelectingMode })}
		</>
	);
}
