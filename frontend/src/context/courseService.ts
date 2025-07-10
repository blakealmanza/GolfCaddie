import type { CourseHole } from '@/types';

interface Course {
	[key: string]: {
		holes: CourseHole[];
	};
}

const COURSE: Course = {
	123: {
		holes: [
			{
				tee: null,
				pin: null,
				par: 4,
			},
		],
	},
};

export async function fetchCourseById(
	courseId: string,
): Promise<{ holes: CourseHole[] }> {
	const course = COURSE[courseId];

	if (!course) {
		throw new Error(`Course with ID "${courseId}" not found.`);
	}

	return Promise.resolve({ holes: course.holes });
}
