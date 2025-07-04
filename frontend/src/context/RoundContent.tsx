import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import HoleInfoPanel from '../components/hole/HoleInfoPanel';
import HoleSetupPrompt from '../components/hole/HoleSetupPrompt';
import RoundMap from '../components/map/RoundMap';
import { fetchCourseById } from '../context/courseService';
import { useRound } from '../context/RoundContext';

export default function RoundContent() {
	const { courseId } = useParams();
	const { dispatch } = useRound();

	useEffect(() => {
		if (!courseId) return;

		const loadCourse = async () => {
			const courseData = await fetchCourseById(courseId);
			dispatch({
				type: 'LOAD_COURSE',
				payload: { courseId, courseHoles: courseData.courseHoles },
			});
		};

		loadCourse();
	}, [courseId, dispatch]);

	return (
		<>
			<RoundMap />
			<HoleInfoPanel />
			<HoleSetupPrompt />
		</>
	);
}
