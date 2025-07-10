import type { Hole } from '../context/roundReducer';

interface Course {
	[key: string]: {
		holes: Hole[];
	};
}

const COURSE: Course = {
	123: {
		holes: [
			{
				tee: null,
				pin: null,
				par: 4,
				shots: [],
			},
		],
	},
};

export async function fetchCourseById(
	courseId: string,
): Promise<{ holes: Hole[] }> {
	const course = COURSE[courseId];

	if (!course) {
		throw new Error(`Course with ID "${courseId}" not found.`);
	}

	return Promise.resolve({ holes: course.holes });
}
