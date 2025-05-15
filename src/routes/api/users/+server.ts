import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import { logger } from '$lib/utils/logger';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

export const POST: RequestHandler = async ({ request, cookies }) => {
	logger.info('POST /api/users');
	try {
		const token = cookies.get('token');
		const req = await request.json().catch(() => {});
		logger.debug('Request data:', req);

		if (!token) {
			logger.error('Token non trovato');
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Verifica se il token è valido
		const tokenResponse = await fetch(`http://${DATABASE_URL}/auth/verify?token=${token}`, {
			method: 'GET'
		});

		logger.debug('Token response:', tokenResponse);

		if (!tokenResponse.ok) {
			const errorData = await tokenResponse.json().catch(() => {});
			logger.error('Token non valido:', errorData);
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

		logger.debug('Response from user creation:', response);

		if (!response.ok) {
			const errorMessage = await response.json().catch(() => {});
			logger.error('Errore durante l\'aggiunta dell\'utente:', errorMessage);
			return json(
				{ error: "Errore durante l'aggiunta dell'utente", details: errorMessage },
				{ status: response.status }
			);
		}
		logger.info('Utente creato con successo:', req);
		return json({
			success: true,
			user: { 
				name: req.name, 
				email: req.email, 
				role: req.role 
			},
			message: 'User added successfully'
		});
	} catch (error) {
		logger.error('Errore durante la creazione della nuova chat:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ request, cookies }) => {
	logger.info('PUT /api/users');
	try {
		const token = cookies.get('token');
		const req = await request.json();
		logger.debug('Request data:', req);

		if (!token) {
			logger.error('Token non trovato');
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		if(!req.admin_password) {
			logger.error('Admin Password non trovata');
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const tokenResponse = await fetch(`http://${DATABASE_URL}/auth/verify?token=${token}`, {
			method: 'GET'
		});
		logger.debug('Token response:', tokenResponse);
		if (!tokenResponse.ok) {
			const errorData = await tokenResponse.json().catch(() => {});
			logger.error('Token non valido:', errorData);
			cookies.delete('token', { path: '/' });
			return json(
				{ error: 'Token non valido', details: errorData },
				{ status: tokenResponse.status }
			);
		}
		

		const response = await fetch(`http://${DATABASE_URL}/users/`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				name: req.name,
				_id: req.email,
				scope: [req.scope],
				admin_password: req.admin_password
			})
		});
		logger.debug('Response from user update:', response);

		if (!response.ok) {
			const errorMessage = await response.json().catch(() => {});
			logger.error('Errore durante l\'aggiornamento dell\'utente:', errorMessage);
			return json(
				{ error: "Errore durante l'aggiunta dell'utente", details: response },
				{ status: response.status }
			);
		}
		logger.info('Utente aggiornato con successo:', req);
		return json({
			success: true,
			user: { name: req.name, email: req.email, role: req.scope },
			message: 'User updated successfully'
		});
	} catch (error) {
		logger.error('Errore durante la creazione della nuova chat:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ request, cookies }) => {
	logger.info('DELETE /api/users');
	try {
		const token = cookies.get('token');
		const req = await request.json();
		logger.debug('Request data:', req);

		if (!token) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const tokenResponse = await fetch(`http://${DATABASE_URL}/auth/verify?token=${token}`, {
			method: 'GET'
		});
		logger.debug('Token response:', tokenResponse);
		if (!tokenResponse.ok) {
			const errorData = await tokenResponse.json().catch(() => {});
			logger.error('Token non valido:', errorData);
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
		logger.debug('Response from user deletion:', response);

		if (!response.ok) {
			const errorMessage = await response.json().catch(() => {});
			logger.error('Errore durante l\'eliminazione dell\'utente:', errorMessage);
			if (response.status === 401) {
				return json(
					{ error: 'Unauthorized', details: 'Unauthorized' },
					{ status: 401 }
				);
			}
			
			return json(
				{ error: "Errore durante l'eliminazione dell'utente", details: response },
				{ status: response.status }
			);
		}
		logger.info('Utente eliminato con successo:', req);
		return json({
			success: true,
			message: 'User deleted successfully'
		});
	} catch (error) {
		logger.error("Errore durante l'eliminazione dell'utente:", error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
