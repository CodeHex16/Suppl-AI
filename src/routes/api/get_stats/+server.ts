import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/public';
import { json } from '@sveltejs/kit';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

export const POST: RequestHandler = async ({ request, cookies }) => {
    const requestData = await request.json();

	if (!requestData) {
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

    if (!response.ok) {
		return json({ error: response.status }, { status: response.status });
	}

    const stats = await response.json();

    console.log("stats", stats);

    return json({ stats });
};
