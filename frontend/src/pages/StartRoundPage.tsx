import type { Course } from '@shared/types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomAuth } from '@/context/AuthContext';
import { listCourses } from '../context/courseService';
import { createRound } from '../context/roundService';

export default function StartRoundPage() {
	const [courses, setCourses] = useState<Course[]>([]);
	const navigate = useNavigate();

	const auth = useCustomAuth();
	const idToken = auth.idToken;

	useEffect(() => {
		const loadCourses = async () => {
			if (!idToken) return;
			const courses = await listCourses(idToken);
			setCourses(courses);
		};
		loadCourses();
	}, []);

	const handleStartRound = async (courseId: string) => {
		if (!idToken) return;
		const round = await createRound(courseId, idToken);
		navigate(`/round/${round.roundId}`);
	};

	return (
		<div style={{ padding: '2rem' }}>
			<h1>Start a New Round</h1>
			<ul>
				{courses.map((course) => (
					<li key={course.courseId}>
						<button
							type='button'
							onClick={() => handleStartRound(course.courseId)}
						>
							Play {course.name}
						</button>
					</li>
				))}
			</ul>
			<button
				type='button'
				onClick={async () => {
					if (!idToken) return;
					const round = await createRound(null, idToken);
					navigate(`/round/${round.roundId}`);
				}}
			>
				Create and Play New Course
			</button>
		</div>
	);
}
