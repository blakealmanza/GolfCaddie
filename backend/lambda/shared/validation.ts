import type { APIGatewayProxyEvent } from 'aws-lambda';

// Input validation utilities
export function validateRequestBody(event: APIGatewayProxyEvent): any {
	if (!event.body) {
		throw new Error('Request body is required');
	}

	// Check body size (max 1MB)
	if (event.body.length > 1024 * 1024) {
		throw new Error('Request body too large');
	}

	try {
		return JSON.parse(event.body);
	} catch (error) {
		throw new Error('Invalid JSON in request body');
	}
}

export function validateUserId(event: APIGatewayProxyEvent): string {
	const userId = event?.requestContext?.authorizer?.claims?.sub;

	if (!userId) {
		throw new Error('Unauthorized: Missing user ID');
	}

	// Validate Cognito user ID format
	if (typeof userId !== 'string' || userId.length < 10 || userId.length > 100) {
		throw new Error(`Invalid user ID format: ${userId} (length: ${userId.length})`);
	}

	// Basic sanitization - remove any potentially dangerous characters
	const sanitizedUserId = userId.replace(/[^a-zA-Z0-9\-_:]/g, '');
	if (sanitizedUserId !== userId) {
		throw new Error(`User ID contains invalid characters: ${userId}`);
	}

	return sanitizedUserId;
}

export function validatePathParameter(event: APIGatewayProxyEvent, paramName: string): string {
	const param = event.pathParameters?.[paramName];

	if (!param) {
		throw new Error(`Missing required path parameter: ${paramName}`);
	}

	// Basic sanitization
	if (param.length > 100) {
		throw new Error(`Path parameter ${paramName} too long`);
	}

	return param;
}

export function sanitizeString(input: string, maxLength: number = 255): string {
	if (typeof input !== 'string') {
		throw new Error('Input must be a string');
	}

	// Remove potentially dangerous characters
	const sanitized = input
		.replace(/[<>\"'&]/g, '') // Remove HTML/XML characters
		.trim()
		.substring(0, maxLength);

	return sanitized;
}

export function validateCourseData(data: any): void {
	if (!data.name || typeof data.name !== 'string') {
		throw new Error('Course name is required and must be a string');
	}

	if (data.name.length > 100) {
		throw new Error('Course name too long');
	}

	if (data.location && typeof data.location !== 'string') {
		throw new Error('Location must be a string');
	}

	if (data.location && data.location.length > 200) {
		throw new Error('Location too long');
	}

	if (data.holes && !Array.isArray(data.holes)) {
		throw new Error('Holes must be an array');
	}

	if (data.holes && data.holes.length > 18) {
		throw new Error('Too many holes (max 18)');
	}
}

export function validateRoundData(data: any): void {
	if (!data.courseId || typeof data.courseId !== 'string') {
		throw new Error('Course ID is required and must be a string');
	}

	if (data.courseId.length > 100) {
		throw new Error('Course ID too long');
	}
}
