import {
	APIProvider,
	Map as GoogleMap,
	type MapMouseEvent,
	Marker,
} from '@vis.gl/react-google-maps';
import { useRound } from '../../context/RoundContext';
import { Polyline } from './geometry';
import MapControls from './MapControls';

export default function RoundMap() {
	const { state, dispatch } = useRound();
	const {
		userCoords,
		holes,
		currentHoleIndex,
		selectedHoleIndex,
		selectingMode,
		targetCoords,
	} = state;

	const selectedHole = holes[selectedHoleIndex];
	const teeCoords = selectedHole.tee;
	const pinCoords = selectedHole.pin;
	const shots = selectedHole.shots;

	const handleClick = (e: MapMouseEvent) => {
		if (!e.detail.latLng || selectedHoleIndex !== currentHoleIndex) return;

		const pos = {
			lat: e.detail.latLng.lat,
			lng: e.detail.latLng.lng,
		};

		if (selectingMode === 'tee') {
			dispatch({ type: 'SET_TEE', payload: pos });
		} else if (selectingMode === 'pin') {
			dispatch({ type: 'SET_PIN', payload: pos });
		} else {
			dispatch({ type: 'SET_TARGET', payload: pos });
		}
	};

	const lineCoords = [
		...(teeCoords ? [teeCoords] : []),
		...shots,
		...(selectedHoleIndex === currentHoleIndex && targetCoords
			? [targetCoords]
			: []),
		...(pinCoords ? [pinCoords] : []),
	];

	return (
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
				{shots.length > 0 && <Marker position={shots[shots.length - 1]} />}
				{selectedHoleIndex === currentHoleIndex && targetCoords && (
					<Marker position={targetCoords} />
				)}
				<Polyline path={lineCoords} strokeColor='#00ffff' strokeWeight={4} />
				<MapControls
					userCoords={userCoords}
					setUserCoords={(pos) =>
						dispatch({ type: 'SET_USER_COORDS', payload: pos })
					}
				/>
			</GoogleMap>
		</APIProvider>
	);
}
