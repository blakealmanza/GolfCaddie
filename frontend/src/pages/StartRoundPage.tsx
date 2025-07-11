import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CourseHole } from '@/types';
import { fetchCourseHolesById } from '../context/courseService';
import { createRound } from '../context/roundService';

export default function StartRoundPage() {
	const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		// Simulate loading courses
		setCourses([{ id: '123', name: 'Test Course' }]);
	}, []);

	const handleStartRound = async (courseId: string) => {
		const { holes } = await fetchCourseHolesById(courseId);
		const round = await createRound(courseId, holes);
		navigate(`/round/${round.roundId}`);
	};

	return (
		<div style={{ padding: '2rem' }}>
			<h1>Start a New Round</h1>
			<ul>
				{courses.map((course) => (
					<li key={course.id}>
						<button type='button' onClick={() => handleStartRound(course.id)}>
							Play {course.name}
						</button>
					</li>
				))}
			</ul>
			<button
				type='button'
				onClick={async () => {
					const defaultHoles: CourseHole[] = Array(18).fill({
						tee: null,
						pin: null,
						par: 4,
					});
					const newCourse = { id: `new_${Date.now()}`, name: 'New Course' };
					const round = await createRound(newCourse.id, defaultHoles);
					navigate(`/round/${round.roundId}`);
				}}
			>
				Create and Play New Course
			</button>
		</div>
	);
}
