import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';
import { getDistance, type LatLng } from '../util/geoUtils';
import { suggestClub } from '../util/suggestClub';

type SelectingMode = 'tee' | 'hole' | null;

type ShotSuggestion = {
	club: string;
	distance: number;
} | null;

interface RoundContextType {
	userPosition: LatLng | null;
	setUserPosition: (pos: LatLng) => void;
	shots: LatLng[];
	addShot: () => void;
	selectingMode: SelectingMode;
	setSelectingMode: (mode: SelectingMode) => void;
	teePosition: LatLng | null;
	holePosition: LatLng | null;
	setTeePosition: (pos: LatLng) => void;
	setHolePosition: (pos: LatLng) => void;
	target: LatLng | null;
	setTarget: (pos: LatLng | null) => void;
	suggestion: ShotSuggestion;
	handleMapClick: (pos: LatLng) => void;
}

const RoundContext = createContext<RoundContextType | undefined>(undefined);

export function RoundProvider({ children }: { children: ReactNode }) {
	const [shots, setShots] = useState<LatLng[]>([]);
	const [userPosition, setUserPosition] = useState<LatLng | null>(null);
	const [selectingMode, setSelectingMode] = useState<SelectingMode>(null);
	const [teePosition, setTeePosition] = useState<LatLng | null>(null);
	const [holePosition, setHolePosition] = useState<LatLng | null>(null);
	const [target, setTarget] = useState<LatLng | null>(null);
	const [suggestion, setSuggestion] = useState<ShotSuggestion>(null);

	useEffect(() => {
		if (!teePosition) {
			setSelectingMode('tee');
		} else if (!holePosition) {
			setSelectingMode('hole');
		}
	}, [teePosition, holePosition]);

	const addShot = () => {
		if (userPosition) {
			setShots((prev) => [...prev, userPosition]);
			setTarget(null);
		}
	};

	const handleMapClick = (clicked: LatLng) => {
		if (selectingMode === 'tee') {
			setTeePosition(clicked);
			setSelectingMode('hole');
			return;
		}
		if (selectingMode === 'hole') {
			setHolePosition(clicked);
			setSelectingMode(null);
			return;
		}

		setTarget(clicked);
		if (userPosition) {
			const distance = Math.round(getDistance(userPosition, clicked));
			const club = suggestClub(distance);
			setSuggestion({ club, distance });
		}
	};

	const value: RoundContextType = {
		userPosition,
		setUserPosition,
		shots,
		addShot,
		selectingMode,
		setSelectingMode,
		teePosition,
		holePosition,
		setTeePosition,
		setHolePosition,
		target,
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
