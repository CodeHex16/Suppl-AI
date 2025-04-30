import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const token = cookies.get('token');
		const req = await request.json();

		if (!token) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Verifica se il token è valido
		const tokenResponse = await fetch(`http://${DATABASE_URL}/auth/verify?token=${token}`, {
			method: 'GET',
		});
		if (!tokenResponse.ok) {
			const errorData = await tokenResponse.json();
			cookies.delete('token', { path: '/' });
			return json(
				{ error: 'Token non valido', details: errorData },
				{ status: tokenResponse.status }
			);
		}

		// Crea una nuovo utente nel database
		const response = await fetch(`http://${DATABASE_URL}/users`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				name: req.name,
				email: req.email,
				scope: [req.scope]
			})
		});
				
		if (!response.ok) {
			return json(
				{ error: 'Errore durante l\'aggiunta dell\'utente', details: response },
				{ status: response.status }
			);
		}

		return json({ success: true, user: {"name": req.name, "email": req.email, "role": req.scope}, message: 'User added successfully' });
	} catch (error) {
		console.error('Errore durante la creazione della nuova chat:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
