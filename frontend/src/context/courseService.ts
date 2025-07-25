import type { Course, CourseHole } from '@shared/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchCourseById(
	courseId: string,
	idToken: string,
): Promise<Course> {
	const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
		headers: {
			Authorization: `Bearer ${idToken}`,
		},
	});

	if (!response.ok) {
		throw new Error(
			`Failed to fetch course with ID ${courseId}: ${response.statusText}`,
		);
	}

	const data = await response.json();
	return data.course;
}

export async function createCourse(
	course: Omit<Course, 'courseId' | 'createdAt'>,
	idToken: string,
): Promise<Course> {
	const response = await fetch(`${API_BASE_URL}/courses`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${idToken}`,
		},
		body: JSON.stringify(course),
	});

	if (!response.ok) {
		throw new Error(`Failed to create course: ${response.statusText}`);
	}

	const data = await response.json();
	return data.course;
}

export async function listCourses(idToken: string): Promise<Course[]> {
	const response = await fetch(`${API_BASE_URL}/courses`, {
		headers: {
			Authorization: `Bearer ${idToken}`,
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to list courses: ${response.statusText}`);
	}

	const data = await response.json();
	const parsedCourses = data.courses.map((item: any) =>
		parseDynamoCourse(item),
	);
	return parsedCourses;
}

export function parseDynamoCourse(item: any): Course {
	return {
		courseId: item.courseId.S,
		name: item.name.S,
		createdBy: item.createdBy.S,
		createdAt: '',
		holes:
			item.holes?.L.map(
				(hole: any): CourseHole => ({
					tee: hole.M.tee.NULL
						? null
						: {
								lat: parseFloat(hole.M.tee.M.lat.N),
								lng: parseFloat(hole.M.tee.M.lng.N),
							},
					pin: hole.M.pin.NULL
						? null
						: {
								lat: parseFloat(hole.M.pin.M.lat.N),
								lng: parseFloat(hole.M.pin.M.lng.N),
							},
					par: parseInt(hole.M.par.N),
				}),
			) ?? [],
	};
}
