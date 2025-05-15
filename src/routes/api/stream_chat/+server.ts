import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/public';
import { logger } from '$lib/utils/logger';
const LLM_URL = env.PUBLIC_LLM_URL;

export const POST: RequestHandler = async ({ request, cookies }) => {
	logger.info('POST /api/stream_chat');
	const requestData = await request.json();
	logger.debug('Request data:', requestData);

	if (!requestData) {
		throw new Error('No request data');
	}

	const chatResponse = await fetch(`http://${LLM_URL}`, {
		headers: {
			Authorization: `Bearer ${cookies.get('token')}`,
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify({
			question: requestData['question'],
			messages: requestData['messages']
		})
	});
	logger.info('Response from LLM:', chatResponse);

	if (!chatResponse.ok) {
		const err = await chatResponse.json().catch(() => ({}));
		logger.error('Error from LLM:', err);
		throw new Error(err.detail || 'Unknown error');
	}
	return chatResponse;
};
