import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import { logger } from '$lib/utils/logger';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

export const GET: RequestHandler = async ({ cookies }) => {
	logger.info('GET /api/new_chat');
	try {
		const token = cookies.get('token');

		if (!token) {
			logger.error('Token non trovato');
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Crea una nuova chat nel database
		const response = await fetch(`http://${DATABASE_URL}/chats/new_chat`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		if (!response.ok) {
			const errorData = await response.json();
			logger.error('Errore durante la creazione della nuova chat', errorData);
			return json(
				{ error: 'Errore durante la creazione della nuova chat', details: errorData },
				{ status: response.status }
			);
		}
		const data = await response.json();
		logger.info('Nuova chat creata con successo', data);
		return json({ success: true , chat_id: data.chat_id});
	} catch (error) {
		logger.error('Errore durante la creazione della nuova chat:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
