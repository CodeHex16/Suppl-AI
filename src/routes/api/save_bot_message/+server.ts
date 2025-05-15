import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import { logger } from '$lib/utils/logger';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

export const POST: RequestHandler = async ({ request, cookies }) => {
	logger.info('POST /api/save_bot_message');
	try {
		const req = await request.json();
		const token = cookies.get('token');
		logger.debug('req', req);

		if (!token) {
			logger.error('Token non trovato');
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Salva il messaggio del bot nel database
		const response = await fetch(`http://${DATABASE_URL}/chats/${req.chat_id}/messages`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				content: req.content,
				sender: 'bot'
			})
		});

		if (!response.ok) {
			const errorData = await response.json();
			logger.error('Errore durante il salvataggio del messaggio del bot', errorData);
			return json(
				{ error: 'Failed to save bot message', details: errorData },
				{ status: response.status }
			);
		}

		const data = await response.json();
		logger.info('Messaggio del bot salvato con successo', data);

		return json({ success: true, data: data });
	} catch (error) {
		logger.error('Errore durante il salvataggio del messaggio del bot:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
