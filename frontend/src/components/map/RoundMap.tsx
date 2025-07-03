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
	const {
		userPosition,
		setUserPosition,
		shots,
		teePosition,
		holePosition,
		target,
		handleMapClick,
	} = useRound();

	const handleClick = (e: MapMouseEvent) => {
		if (!e.detail.latLng) return;
		handleMapClick({
			lat: e.detail.latLng.lat,
			lng: e.detail.latLng.lng,
		});
	};

	const lineCoords = [
		...(teePosition ? [teePosition] : []),
		...shots,
		...(target ? [target] : []),
		...(holePosition ? [holePosition] : []),
	];

	return (
		<APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}>
			<GoogleMap
				defaultCenter={teePosition || { lat: 40, lng: -120 }}
				defaultZoom={17}
				minZoom={15}
				maxZoom={20}
				disableDefaultUI
				style={{ width: '100vw', height: '95vh' }}
				onClick={handleClick}
				mapTypeId='satellite'
			>
				{teePosition && <Marker position={teePosition} />}
				{holePosition && <Marker position={holePosition} />}
				{userPosition && <Marker position={userPosition} />}
				{shots.length > 0 && <Marker position={shots[shots.length - 1]} />}
				{target && <Marker position={target} />}
				<Polyline path={lineCoords} strokeColor='#00ffff' strokeWeight={4} />
				<MapControls
					userPosition={userPosition}
					setUserPosition={setUserPosition}
				/>
			</GoogleMap>
		</APIProvider>
	);
}
