import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/public';
import { json } from '@sveltejs/kit';
import { logger } from '$lib/utils/logger';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

export const POST: RequestHandler = async ({ request, cookies }) => {
	logger.info('POST /api/get_stats');
	const requestData = await request.json();

	if (!requestData) {
		logger.error('No request data');
		throw new Error('No request data');
	}

	const { startDate, endDate } = requestData;

	const queryParams = new URLSearchParams();
	if (startDate) queryParams.set('startDate', startDate);
	if (endDate) queryParams.set('endDate', endDate);

	const response = await fetch(`http://${DATABASE_URL}/chats/stats?${queryParams.toString()}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${cookies.get('token')}`,
			'Content-Type': 'application/json'
		}
	});
	logger.info('Response from database:', response);

	if (!response.ok) {
		const err = await response.json().catch(() => ({}));
		logger.error('Error from database:', err);
		return json({ error: response.status }, { status: response.status });
	}

	const stats = await response.json();

	logger.log('stats', stats);

	return json({ stats });
};
