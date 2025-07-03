import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';
import { getDistance, type LatLng } from '../util/geoUtils';
import { suggestClub } from '../util/suggestClub';

type SelectingMode = 'tee' | 'pin' | null;

type ShotSuggestion = {
	club: string;
	distance: number;
} | null;

interface RoundContextType {
	userCoords: LatLng | null;
	setUserCoords: (pos: LatLng) => void;
	shots: LatLng[];
	addShot: () => void;
	selectingMode: SelectingMode;
	setSelectingMode: (mode: SelectingMode) => void;
	teeCoords: LatLng | null;
	pinCoords: LatLng | null;
	setTeeCoords: (pos: LatLng) => void;
	setPinCoords: (pos: LatLng) => void;
	targetCoords: LatLng | null;
	setTarget: (pos: LatLng | null) => void;
	suggestion: ShotSuggestion;
	handleMapClick: (pos: LatLng) => void;
}

const RoundContext = createContext<RoundContextType | undefined>(undefined);

export function RoundProvider({ children }: { children: ReactNode }) {
	const [shots, setShots] = useState<LatLng[]>([]);
	const [userCoords, setUserCoords] = useState<LatLng | null>(null);
	const [selectingMode, setSelectingMode] = useState<SelectingMode>(null);
	const [teeCoords, setTeeCoords] = useState<LatLng | null>(null);
	const [pinCoords, setPinCoords] = useState<LatLng | null>(null);
	const [targetCoords, setTarget] = useState<LatLng | null>(null);
	const [suggestion, setSuggestion] = useState<ShotSuggestion>(null);

	useEffect(() => {
		if (!teeCoords) {
			setSelectingMode('tee');
		} else if (!pinCoords) {
			setSelectingMode('pin');
		}
	}, [teeCoords, pinCoords]);

	const addShot = () => {
		if (userCoords) {
			setShots((prev) => [...prev, userCoords]);
			setTarget(null);
		}
	};

	const handleMapClick = (clicked: LatLng) => {
		if (selectingMode === 'tee') {
			setTeeCoords(clicked);
			setSelectingMode('pin');
			return;
		}
		if (selectingMode === 'pin') {
			setPinCoords(clicked);
			setSelectingMode(null);
			return;
		}

		setTarget(clicked);
		if (userCoords) {
			const distance = Math.round(getDistance(userCoords, clicked));
			const club = suggestClub(distance);
			setSuggestion({ club, distance });
		}
	};

	const value: RoundContextType = {
		userCoords,
		setUserCoords,
		shots,
		addShot,
		selectingMode,
		setSelectingMode,
		teeCoords,
		pinCoords,
		setTeeCoords,
		setPinCoords,
		targetCoords,
		setTarget,
		suggestion,
		handleMapClick,
	};

	return (
		<RoundContext.Provider value={value}>{children}</RoundContext.Provider>
	);
}

export function useRound() {
	const ctx = useContext(RoundContext);
	if (!ctx) {
		throw new Error('useRound must be used inside a RoundProvider');
	}
	return ctx;
}
