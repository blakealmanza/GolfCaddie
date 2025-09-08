import type { Course, CourseHole } from '@shared/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import GlassButton from '@/components/ui/GlassButton';
import GlassOutlineButton from '@/components/ui/GlassOutlineButton';
import { useCustomAuth } from '@/context/AuthContext';
import { createCourse } from '@/context/courseService';

type CourseCreatorModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

type CourseFormData = {
	name: string;
	location: string;
	holes: CourseHole[];
};

export default function CourseCreatorModal({
	isOpen,
	onClose,
}: CourseCreatorModalProps) {
	const { idToken } = useCustomAuth();
	const queryClient = useQueryClient();
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState<CourseFormData>({
		name: '',
		location: '',
		holes: Array.from({ length: 18 }, () => ({
			tee: null,
			pin: null,
			par: 4,
		})),
	});

	const createCourseMutation = useMutation({
		mutationFn: (course: Omit<Course, 'courseId' | 'createdAt'>) => {
			if (!idToken) throw new Error('No authentication token');
			return createCourse(course, idToken);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['courses'] });
			onClose();
			resetForm();
		},
	});

	const resetForm = () => {
		setCurrentStep(1);
		setFormData({
			name: '',
			location: '',
			holes: Array.from({ length: 18 }, () => ({
				tee: null,
				pin: null,
				par: 4,
			})),
		});
	};

	const handleClose = () => {
		onClose();
		resetForm();
	};

	const updateFormData = (updates: Partial<CourseFormData>) => {
		setFormData((prev) => ({ ...prev, ...updates }));
	};

	const updateHole = (holeIndex: number, updates: Partial<CourseHole>) => {
		setFormData((prev) => ({
			...prev,
			holes: prev.holes.map((hole, index) =>
				index === holeIndex ? { ...hole, ...updates } : hole,
			),
		}));
	};

	const handleSubmit = () => {
		if (!idToken) return;

		const courseData: Omit<Course, 'courseId' | 'createdAt'> = {
			name: formData.name,
			location: formData.location,
			holes: formData.holes,
			createdBy: 'current-user', // This should come from auth context
			images: {
				thumbnail: { img: 'default-thumbnail.jpg', alt: formData.name },
				gallery: [],
			},
		};

		createCourseMutation.mutate(courseData);
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
			<div className='pointer-events-auto w-4/5 max-w-2xl bg-glass rounded-lg drop-shadows border-glass backdrop-blur-md p-6 overflow-hidden'>
				<div className='flex flex-col gap-6'>
					{/* Header */}
					<div className='flex justify-between items-center'>
						<h2 className='text-black text-2xl font-semibold font-barlow'>
							Create New Course
						</h2>
						<button
							type='button'
							onClick={handleClose}
							className='text-black text-xl font-bold'
						>
							×
						</button>
					</div>

					{/* Progress Indicator */}
					<div className='flex gap-2'>
						{[1, 2, 3].map((step) => (
							<div
								key={step}
								className={`flex-1 h-2 rounded-full ${
									step <= currentStep ? 'bg-primary' : 'bg-gray-300'
								}`}
							/>
						))}
					</div>

					{/* Step Content */}
					<div className='min-h-[400px]'>
						{currentStep === 1 && (
							<CourseBasicInfo formData={formData} onUpdate={updateFormData} />
						)}
						{currentStep === 2 && (
							<CourseHolesEditor
								holes={formData.holes}
								onUpdateHole={updateHole}
							/>
						)}
						{currentStep === 3 && <CourseReview formData={formData} />}
					</div>

					{/* Navigation Buttons */}
					<div className='flex gap-3'>
						{currentStep > 1 && (
							<GlassOutlineButton
								text='Back'
								onClick={() => setCurrentStep((prev) => prev - 1)}
								className='flex-1'
								textColor='black'
							/>
						)}
						{currentStep < 3 ? (
							<GlassButton
								text='Next'
								onClick={() => setCurrentStep((prev) => prev + 1)}
								className='flex-1'
								disabled={!formData.name || !formData.location}
							/>
						) : (
							<GlassButton
								text={
									createCourseMutation.isPending
										? 'Creating...'
										: 'Create Course'
								}
								onClick={handleSubmit}
								className='flex-1'
								loading={createCourseMutation.isPending}
								disabled={createCourseMutation.isPending}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

// Step 1: Basic Course Information
function CourseBasicInfo({
	formData,
	onUpdate,
}: {
	formData: CourseFormData;
	onUpdate: (updates: Partial<CourseFormData>) => void;
}) {
	return (
		<div className='flex flex-col gap-4'>
			<h3 className='text-black text-xl font-semibold font-barlow'>
				Course Information
			</h3>

			<div className='flex flex-col gap-4'>
				<div>
					<label
						htmlFor='course-name'
						className='block text-black text-sm font-medium font-barlow mb-2'
					>
						Course Name
					</label>
					<input
						id='course-name'
						type='text'
						value={formData.name}
						onChange={(e) => onUpdate({ name: e.target.value })}
						placeholder='Enter course name'
						className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
					/>
				</div>

				<div>
					<label
						htmlFor='course-location'
						className='block text-black text-sm font-medium font-barlow mb-2'
					>
						Location
					</label>
					<input
						id='course-location'
						type='text'
						value={formData.location}
						onChange={(e) => onUpdate({ location: e.target.value })}
						placeholder='Enter course location'
						className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
					/>
				</div>
			</div>
		</div>
	);
}

// Step 2: Holes Editor
function CourseHolesEditor({
	holes,
	onUpdateHole,
}: {
	holes: CourseHole[];
	onUpdateHole: (holeIndex: number, updates: Partial<CourseHole>) => void;
}) {
	return (
		<div className='flex flex-col gap-4'>
			<h3 className='text-black text-xl font-semibold font-barlow'>
				Hole Configuration
			</h3>

			<div className='grid grid-cols-2 gap-3 max-h-80 overflow-y-auto'>
				{holes.map((hole, index) => (
					<div key={`hole-${index}`} className='p-3 bg-white/50 rounded-lg'>
						<div className='flex justify-between items-center mb-2'>
							<span className='text-black text-sm font-semibold font-barlow'>
								Hole {index + 1}
							</span>
						</div>

						<div className='flex flex-col gap-2'>
							<div>
								<label
									htmlFor={`hole-${index}-par`}
									className='block text-black text-xs font-medium font-barlow mb-1'
								>
									Par
								</label>
								<select
									id={`hole-${index}-par`}
									value={hole.par}
									onChange={(e) =>
										onUpdateHole(index, { par: parseInt(e.target.value) })
									}
									className='w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary'
								>
									<option value={3}>Par 3</option>
									<option value={4}>Par 4</option>
									<option value={5}>Par 5</option>
								</select>
							</div>

							<div className='text-xs text-gray-600'>
								<p>Tee: {hole.tee ? 'Set' : 'Not set'}</p>
								<p>Pin: {hole.pin ? 'Set' : 'Not set'}</p>
							</div>
						</div>
					</div>
				))}
			</div>

			<div className='text-sm text-gray-600'>
				<p>
					Note: Tee and pin locations can be set when playing the course using
					GPS.
				</p>
			</div>
		</div>
	);
}

// Step 3: Review and Create
function CourseReview({ formData }: { formData: CourseFormData }) {
	const totalPar = formData.holes.reduce((sum, hole) => sum + hole.par, 0);

	return (
		<div className='flex flex-col gap-4'>
			<h3 className='text-black text-xl font-semibold font-barlow'>
				Review Course
			</h3>

			<div className='bg-white/50 rounded-lg p-4'>
				<div className='grid grid-cols-2 gap-4'>
					<div>
						<h4 className='text-black text-lg font-semibold font-barlow mb-2'>
							{formData.name}
						</h4>
						<p className='text-black text-sm font-medium font-barlow'>
							{formData.location}
						</p>
					</div>

					<div className='text-right'>
						<p className='text-black text-sm font-medium font-barlow'>
							18 Holes
						</p>
						<p className='text-black text-sm font-medium font-barlow'>
							Par {totalPar}
						</p>
					</div>
				</div>

				<div className='mt-4 pt-4 border-t border-gray-300'>
					<h5 className='text-black text-sm font-semibold font-barlow mb-2'>
						Hole Summary
					</h5>
					<div className='grid grid-cols-6 gap-2 text-xs'>
						{formData.holes.map((hole, index) => (
							<div key={`review-hole-${index}`} className='text-center'>
								<div className='font-semibold'>H{index + 1}</div>
								<div>Par {hole.par}</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
