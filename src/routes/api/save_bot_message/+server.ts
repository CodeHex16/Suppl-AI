import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const req = await request.json();
		const token = cookies.get('token');

		if (!token) {
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
			return json(
				{ error: 'Failed to save bot message', details: errorData },
				{ status: response.status }
			);
		}

		const data = await response.json();

		return json({ success: true, data: data });
	} catch (error) {
		console.error('Errore durante il salvataggio del messaggio del bot:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
