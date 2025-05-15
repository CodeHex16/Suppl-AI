import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import type { MessageContext } from '$lib/types';
import { env } from '$env/dynamic/public';
import { logger } from '$lib/utils/logger';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;
const LLM_URL = env.PUBLIC_LLM_URL;

export const POST: RequestHandler = async ({ request, cookies }) => {
	logger.info('POST /api/update_chat_name');
	const requestData = await request.json();
	logger.debug('Request data:', requestData);
	if (!requestData) {
		throw new Error('No request data');
	}

	logger.log(requestData['messages']);
	const messagesString = requestData['messages'].map((message: MessageContext) => message.content).join(' ');

	const response = await fetch(`http://${LLM_URL}/chat_name`, {
		headers: {
			Authorization: `Bearer ${cookies.get('token')}`,
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify({
			context: messagesString
		})
	});

	if (!response.ok) {
		const err = await response.json().catch(() => ({}));
		logger.error('Error from LLM:', err);
		return json({ error: response.status }, { status: response.status });
	}
	
	const title = await response.json();
	console.log("title api", title);

	// Salva nel database
	const response2 = await fetch(`http://${DATABASE_URL}/chats/${requestData['chat_id']}/name?new_name=${title}`, {
		method: 'PATCH',
		headers: {
			Authorization: `Bearer ${cookies.get('token')}`,
			'Content-Type': 'application/json'
		}
	});
	if (!response2.ok) {
		const err = await response2.json().catch(() => ({}));
		logger.error('Error from database:', err);
		return json({ error: response2.status }, { status: response2.status });
	}
	logger.info('Chat name updated successfully:', title);
	return json({ title });
};