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

		// Crea una nuova chat nel database
		const response = await fetch(`http://${DATABASE_URL}/chats`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		if (!response.ok) {
			const errorData = await response.json();
			return json(
				{ error: 'Errore durante la creazione della nuova chat', details: errorData },
				{ status: response.status }
			);
		}
		const data = await response.json();
		return json({ success: true , chat_id: data.chat_id});
	} catch (error) {
		console.error('Errore durante la creazione della nuova chat:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
