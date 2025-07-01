import { GeolocateControl, Map as MapLibre } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function RoundPage() {
	return (
		<MapLibre
			initialViewState={{
				latitude: 40,
				longitude: -100,
				zoom: 3,
				pitch: 0,
				bearing: 0,
			}}
			mapStyle={`https://api.maptiler.com/maps/satellite/style.json?key=${import.meta.env.VITE_MAPTILER_API_KEY}`}
			style={{ width: '100vw', height: '100vh' }}
			// dragPan={false}
			// dragRotate={false}
			// scrollZoom={false}
			// touchZoomRotate={false}
			// doubleClickZoom={false}
		>
			<GeolocateControl
				trackUserLocation={true}
				fitBoundsOptions={{
					zoom: 17,
					offset: [0, 100],
				}}
				positionOptions={{
					enableHighAccuracy: true,
					timeout: 10000,
				}}
				onGeolocate={(e) => {
					console.log(
						'Located user at',
						e.coords.latitude,
						e.coords.longitude,
						e.coords.accuracy,
					);
				}}
				onError={(e) => {
					console.error(e);
				}}
			/>
		</MapLibre>
	);
}
