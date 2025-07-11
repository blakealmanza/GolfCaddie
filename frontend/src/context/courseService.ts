import type { CourseHole } from '@/types';

interface CourseDB {
	[key: string]: {
		name: string;
		holes: CourseHole[];
	};
}

const COURSE: CourseDB = {
	'123': {
		name: 'Test Course',
		holes: [
			{
				tee: null,
				pin: null,
				par: 4,
			},
		],
	},
};

export async function fetchCourseHolesById(
	courseId: string,
): Promise<{ holes: CourseHole[] }> {
	const course = COURSE[courseId];

	if (!course) {
		throw new Error(`Course with ID "${courseId}" not found.`);
	}

	return Promise.resolve({ holes: course.holes });
}
