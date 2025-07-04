import type { CourseHole } from '../context/roundReducer';

interface Course {
	[key: string]: {
		courseHoles: CourseHole[];
	};
}

const COURSE: Course = {
	123: {
		courseHoles: [],
	},
};

export async function fetchCourseById(
	courseId: string,
): Promise<{ courseHoles: CourseHole[] }> {
	const course = COURSE[courseId];

	if (!course) {
		throw new Error(`Course with ID "${courseId}" not found.`);
	}

	return Promise.resolve({ courseHoles: course.courseHoles });
}
