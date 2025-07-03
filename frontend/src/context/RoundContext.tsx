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

type Hole = {
	tee: LatLng | null;
	pin: LatLng | null;
	shots: LatLng[];
};

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
	nextHole: () => void;
	currentHoleIndex: number;
}

const RoundContext = createContext<RoundContextType | undefined>(undefined);

export function RoundProvider({ children }: { children: ReactNode }) {
	const [holes, setHoles] = useState<Hole[]>([
		{ tee: null, pin: null, shots: [] },
	]);
	const [currentHoleIndex, setCurrentHoleIndex] = useState(0);
	const [userCoords, setUserCoords] = useState<LatLng | null>(null);
	const [selectingMode, setSelectingMode] = useState<SelectingMode>(null);
	const [targetCoords, setTarget] = useState<LatLng | null>(null);
	const [suggestion, setSuggestion] = useState<ShotSuggestion>(null);

	const currentHole = holes[currentHoleIndex];

	useEffect(() => {
		if (!currentHole.tee) {
			setSelectingMode('tee');
		} else if (!currentHole.pin) {
			setSelectingMode('pin');
		}
	}, [currentHole]);

	const updateCurrentHole = (updated: Hole) => {
		setHoles((prev) =>
			prev.map((hole, idx) => (idx === currentHoleIndex ? updated : hole)),
		);
	};

	const setTeeCoords = (pos: LatLng) => {
		updateCurrentHole({ ...currentHole, tee: pos });
	};

	const setPinCoords = (pos: LatLng) => {
		updateCurrentHole({ ...currentHole, pin: pos });
	};

	const addShot = () => {
		if (userCoords) {
			updateCurrentHole({
				...currentHole,
				shots: [...currentHole.shots, userCoords],
			});
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

	const nextHole = () => {
		const nextIndex = currentHoleIndex + 1;
		setHoles((prev) => [
			...prev,
			...(nextIndex < prev.length ? [] : [{ tee: null, pin: null, shots: [] }]),
		]);
		setCurrentHoleIndex(nextIndex);
		setSelectingMode('tee');
		setTarget(null);
		setSuggestion(null);
	};

	const value: RoundContextType = {
		userCoords,
		setUserCoords,
		shots: currentHole.shots,
		addShot,
		selectingMode,
		setSelectingMode,
		teeCoords: currentHole.tee,
		pinCoords: currentHole.pin,
		setTeeCoords,
		setPinCoords,
		targetCoords,
		setTarget,
		suggestion,
		handleMapClick,
		nextHole,
		currentHoleIndex,
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
