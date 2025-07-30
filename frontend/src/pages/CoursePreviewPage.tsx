import type { Course } from '@shared/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useCustomAuth } from '@/context/AuthContext';
import { fetchCourseById } from '@/context/courseService';

export default function CoursePreviewPage() {
	const { id: courseId } = useParams();
	const { idToken } = useCustomAuth();
	if (!courseId || !idToken) return null;

	const queryClient = useQueryClient();

	const { data: course } = useQuery({
		queryKey: ['course', courseId],
		queryFn: () => fetchCourseById(courseId, idToken),
		initialData: () => {
			const courses = queryClient.getQueryData(['courses']) as
				| Course[]
				| undefined;
			return courses?.find((c) => c.courseId === courseId);
		},
		enabled: typeof courseId === 'string' && typeof idToken === 'string',
		staleTime: 5 * 60 * 1000,
	});

	return <h1>{course?.name}</h1>;
}
