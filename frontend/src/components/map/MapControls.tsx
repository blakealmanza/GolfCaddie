import { useMap } from '@vis.gl/react-google-maps';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import LocationIcon from '@/assets/location.svg?react';
import MinusIcon from '@/assets/minus.svg?react';
import PlusIcon from '@/assets/plus.svg?react';
import type { LatLng } from '../../util/geoUtils';

export default function MapControls({
	setUserCoords,
	userCoords,
	isPreviewMode = false,
}: {
	setUserCoords: (position: LatLng) => void;
	userCoords: LatLng | null;
	isPreviewMode?: boolean;
}) {
	const map = useMap();
	const [isTracking, setIsTracking] = useState(false);
	const watchIdRef = useRef<number | null>(null);

	useEffect(() => {
		if (!map) return;

		toggleTracking();

		// Stop tracking on map drag
		const dragListener = map.addListener('dragstart', () => {
			if (isTracking && watchIdRef.current !== null) {
				navigator.geolocation.clearWatch(watchIdRef.current);
				watchIdRef.current = null;
				setIsTracking(false);
			}
		});

		return () => {
			dragListener.remove();
			if (watchIdRef.current !== null) {
				navigator.geolocation.clearWatch(watchIdRef.current);
			}
		};
	}, [map]);

	const toggleTracking = () => {
		if (!map) return;

		if (!isTracking) {
			const id = navigator.geolocation.watchPosition(
				(pos) => {
					const coords = {
						lat: pos.coords.latitude,
						lng: pos.coords.longitude,
					};
					setUserCoords(coords);
					map.panTo(coords);
					map.setZoom(17);
				},
				(err) => {
					console.error('Geolocation error:', err);
				},
				{ enableHighAccuracy: true },
			);
			watchIdRef.current = id;
			setIsTracking(true);
		} else if (userCoords) {
			map.panTo(userCoords);
			map.setZoom(17);
		}
	};

	const zoomIn = () => {
		if (map) {
			const zoom = map.getZoom();
			if (zoom != null) map.setZoom(zoom + 0.5);
		}
	};

	const zoomOut = () => {
		if (map) {
			const zoom = map.getZoom();
			if (zoom != null) map.setZoom(zoom - 0.5);
		}
	};

	return (
		<div className='bg-glass rounded-lg drop-shadows border-glass blur-glass inline-flex flex-col justify-center items-center5'>
			<div className='w-10 bg-glass rounded-lg border-glass flex flex-col justify-center items-center gap-px overflow-hidden'>
				{!isPreviewMode && (
					<ControlButton
						icon={<LocationIcon className='text-black' />}
						onClick={toggleTracking}
					/>
				)}
				<ControlButton
					icon={<PlusIcon className='text-black' />}
					onClick={zoomIn}
				/>
				<ControlButton
					icon={<MinusIcon className='text-black' />}
					onClick={zoomOut}
				/>
			</div>
		</div>
	);
}

function ControlButton({
	icon,
	onClick,
}: {
	icon: ReactNode;
	onClick?: () => void;
}) {
	return (
		<button
			type='button'
			onClick={onClick}
			className='self-stretch h-10 px-4 py-px flex flex-col justify-center items-center overflow-hidden'
		>
			{icon}
		</button>
	);
}
