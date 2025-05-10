import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const token = cookies.get('token');
		const req = await request.json();

		console.log('Request body:', req);
		if (!token) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Verifica se il token è valido
		const tokenResponse = await fetch(`http://${DATABASE_URL}/auth/verify?token=${token}`, {
			method: 'GET'
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
				scopes: [req.role]
			})
		});
		if (response.status === 400) {
			let errorMessage = await response.json();
			return json(
				{
					error: errorMessage.detail
				},
				{ status: response.status }
			);
		}
		else if (response.status === 422) {
			let errorMessage = await response.json();
			console.log('Error message:', errorMessage);
			return json(
				{
					error: "Dati inseriti non validi"
				},
				{ status: response.status }
			);
		}
		if (!response.ok) {
			return json(
				{ error: "Errore durante l'aggiunta dell'utente", details: response },
				{ status: response.status }
			);
		}

		return json({
			success: true,
			user: { name: req.name, email: req.email, role: req.scope },
			message: 'User added successfully'
		});
	} catch (error) {
		console.error("Errore durante la creazione dell'utente:", error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const PATCH: RequestHandler = async ({ request, cookies }) => {
	try {
		const token = cookies.get('token');
		const req = await request.json();

		if (!token) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const tokenResponse = await fetch(`http://${DATABASE_URL}/auth/verify?token=${token}`, {
			method: 'GET'
		});
		if (!tokenResponse.ok) {
			const errorData = await tokenResponse.json();
			cookies.delete('token', { path: '/' });
			return json(
				{ error: 'Token non valido', details: errorData },
				{ status: tokenResponse.status }
			);
		}

		const response = await fetch(`http://${DATABASE_URL}/users`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				_id: req.email,
				name: req.name,
				scopes: [req.role],
				admin_password: req.admin_password
			})
		});
		if (response.status === 304) {
			return json({ error: 'No content to update', details: 'No changes made' });
		}

		if (!response.ok) {
			return json(
				{ error: "Errore durante l'aggiunta dell'utente", details: response },
				{ status: response.status }
			);
		}
		return json({
			success: true,
			user: { name: req.name, email: req.email, role: req.scope },
			message: 'User updated successfully'
		});
	} catch (error) {
		console.error('Errore durante la creazione della nuova chat:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ request, cookies }) => {
	try {
		const token = cookies.get('token');
		const req = await request.json();

		if (!token) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const tokenResponse = await fetch(`http://${DATABASE_URL}/auth/verify?token=${token}`, {
			method: 'GET'
		});
		if (!tokenResponse.ok) {
			const errorData = await tokenResponse.json();
			cookies.delete('token', { path: '/' });
			return json(
				{ error: 'Token non valido', details: errorData },
				{ status: tokenResponse.status }
			);
		}

		const response = await fetch(`http://${DATABASE_URL}/users`, {
			method: 'DELETE',
			headers: {
				Authorization: 'Bearer ' + cookies.get('token'),
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				delete_user: {
					_id: req.userId
				},
				admin: {
					current_password: req.current_password
				}
			})
		});

		if (!response.ok) {
			if (response.status === 401) {
				return json({ error: 'Unauthorized', details: 'Unauthorized' }, { status: 401 });
			}

			return json(
				{ error: "Errore durante l'eliminazione dell'utente", details: response },
				{ status: response.status }
			);
		}
		return json({
			success: true,
			message: 'User deleted successfully'
		});
	} catch (error) {
		console.error("Errore durante l'eliminazione dell'utente:", error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
