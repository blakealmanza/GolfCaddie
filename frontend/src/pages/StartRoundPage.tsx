import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { createRound } from '../context/roundService';

export default function StartRoundPage() {
	const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);
	const navigate = useNavigate();

	const auth = useAuth();
	const idToken = auth.user?.id_token;

	useEffect(() => {
		// Simulate loading courses
		setCourses([{ id: '123', name: 'Test Course' }]);
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
					if (!idToken) return;
					console.log(idToken);
					const round = await createRound('test_course', idToken);
					navigate(`/round/${round.roundId}`);
				}}
			>
				Create and Play New Course
			</button>
		</div>
	);
}
