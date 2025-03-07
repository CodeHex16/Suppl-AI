import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

const API_URL = 'http://database-api:8000';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const req = await request.json();
		const token = cookies.get('token');

		if (!token) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Salva il messaggio del bot nel database
		const response = await fetch(`${API_URL}/chats/${req.chat_id}/messages`, {
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
			return json(
				{ error: 'Failed to save bot message', details: errorData },
				{ status: response.status }
			);
		}

		return json({ success: true });
	} catch (error) {
		console.error('Errore durante il salvataggio del messaggio del bot:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
