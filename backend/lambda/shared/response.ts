export default function response(statusCode: number, body: object) {
	return {
		statusCode,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': 'Content-Type',
			'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST,PATCH,DELETE',
		},
		body: JSON.stringify(body),
	};
}
