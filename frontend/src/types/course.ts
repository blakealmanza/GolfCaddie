import type { RoundHole } from './round';

export type CourseHole = Omit<RoundHole, 'shots'>;

export type Course = {
	courseId: string;
	name: string;
	holes: CourseHole[];
	createdBy: string;
	createdAt: string;
};
