export type LatLng = { lat: number; lng: number };

// Gets the distance between two points on the earth
export function getDistance(from: LatLng, to: LatLng): number {
	const earthRadiusMeters = 6371e3;

	const fromLatRad = (from.lat * Math.PI) / 180; // converts starting latitude to radians
	const toLatRad = (to.lat * Math.PI) / 180; // converts target latitude to radians
	const deltaLatRad = ((to.lat - from.lat) * Math.PI) / 180; // difference between latitudes, in radians
	const deltaLngRad = ((to.lng - from.lng) * Math.PI) / 180; // difference between longitudes, in radians

	// Haversine formula
	const a =
		Math.sin(deltaLatRad / 2) ** 2 +
		Math.cos(fromLatRad) * Math.cos(toLatRad) * Math.sin(deltaLngRad / 2) ** 2;
	const angularDistance = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	const distanceMeters = earthRadiusMeters * angularDistance;
	const yards = distanceMeters * 1.09361;

	return yards;
}

// Creates a GeoJSON line from two LatLng points
export function createGeojsonLine(
	from: LatLng,
	to: LatLng,
): GeoJSON.FeatureCollection<GeoJSON.LineString> {
	return {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				geometry: {
					type: 'LineString',
					coordinates: [
						[from.lng, from.lat],
						[to.lng, to.lat],
					],
				},
				properties: {},
			},
		],
	};
}
