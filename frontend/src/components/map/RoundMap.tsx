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
		userCoords,
		setUserCoords,
		shots,
		teeCoords,
		pinCoords,
		targetCoords,
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
		...(teeCoords ? [teeCoords] : []),
		...shots,
		...(targetCoords ? [targetCoords] : []),
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
				{targetCoords && <Marker position={targetCoords} />}
				<Polyline path={lineCoords} strokeColor='#00ffff' strokeWeight={4} />
				<MapControls userCoords={userCoords} setUserCoords={setUserCoords} />
			</GoogleMap>
		</APIProvider>
	);
}
