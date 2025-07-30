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
	return data.courses;
}
