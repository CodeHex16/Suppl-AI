import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import { logger } from '$lib/utils/logger';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;
const LLM_URL = env.PUBLIC_LLM_URL;

export const POST: RequestHandler = async ({ request, cookies, fetch }) => {
	logger.info('POST /api/faqs');
	try {
		const token = cookies.get('token');
		const req = await request.json();
		logger.debug('req', req);

		if (!token) {
			logger.error('Token non trovato');
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Verifica se il token è valido
		const tokenResponse = await fetch(`http://${DATABASE_URL}/auth/verify?token=${token}`, {
			method: 'GET'
		});
		if (!tokenResponse.ok) {
			const errorData = await tokenResponse.json();
			logger.error('Token non valido', errorData);
			cookies.delete('token', { path: '/' });
			return json(
				{ error: 'Token non valido', details: errorData },
				{ status: tokenResponse.status }
			);
		}

		if (!req.title || !req.question || !req.answer) {
			logger.error('Dati non validi', req);
			return json(
				{ error: 'Dati non validi', details: 'Title, question and answer are required' },
				{ status: 400 }
			);
		}
		// Crea una nuova faq nel database
		const response = await fetch(`http://${LLM_URL}/faqs?token=${token}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				title: req.title,
				question: req.question,
				answer: req.answer
			})
		});

		if (!response.ok) {

			const errorData = await response.json();
			
			logger.error('Errore durante l\'aggiunta della faq', errorData);

			return json(
				{ error: "Errore durante l'aggiunta della faq", details: errorData },
				{ status: response.status }
			);
		}
		const data = await response.json();
		logger.info('FAQ aggiunta con successo', data);
		return json({
			success: true,
			faq: { id: data.faq.id, title: req.title, question: req.question, answer: req.answer },
			message: 'FAQ added successfully'
		});
	} catch (error) {
		logger.error('Errore durante la creazione della nuova chat:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ request, cookies }) => {
	logger.info('PUT /api/faqs');
	try {
		const token = cookies.get('token');
		const req = await request.json();
		logger.debug('req', req);
		if (!token) {
			logger.error('Token non trovato');
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const tokenResponse = await fetch(`http://${DATABASE_URL}/auth/verify?token=${token}`, {
			method: 'GET'
		});
		if (!tokenResponse.ok) {
			const errorData = await tokenResponse.json();
			return json(
				{ error: 'Token non valido', details: errorData },
				{ status: tokenResponse.status }
			);
		}
		logger.log('req update faq', req);

		if (!req.title || !req.question || !req.answer) {
			logger.error('Dati non validi', req);
			return json(
				{ error: 'Dati non validi', details: 'Title, question and answer are required' },
				{ status: 400 }
			);
		}
		const response = await fetch(`http://${DATABASE_URL}/faqs/${req.id}`, {
			method: 'PATCH',

			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				title: req.title,
				question: req.question,
				answer: req.answer,
				id: req.id,
				current_password: req.current_password
			})
		});
		logger.log('response update faq', response);

		if (!response.ok) {

			logger.error('Errore durante l\'aggiornamento della faq', response);

			logger.log('response', response);
			const errorMessage = await response.json();
			logger.error('Error response:', errorMessage);
			if (errorMessage.detail.includes('FAQ data is already up to date')) {
				return json(
					{ error: 'Nessuna modifica apportata', details: errorMessage },
					{ status: response.status }
				);
			}
			return json(
				{ error: "Errore durante l'aggiornamento della faq", details: errorMessage },
				{ status: response.status }
			);
		}
		logger.info('FAQ aggiornata con successo');
		return json({
			success: true,
			faq: { title: req.title, question: req.question, answer: req.answer },
			message: 'FAQ updated successfully'
		});
	} catch (error) {
		logger.error("Errore durante l'aggiornamento della FAQ:", error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ request, cookies }) => {
	logger.info('DELETE /api/faqs');
	try {
		const token = cookies.get('token');
		const req = await request.json();

		if (!token) {
			logger.error('Token non trovato');
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const tokenResponse = await fetch(`http://${DATABASE_URL}/auth/verify?token=${token}`, {
			method: 'GET'
		});
		if (!tokenResponse.ok) {
			const errorData = await tokenResponse.json();
			logger.error('Token non valido', errorData);
			return json(
				{ error: 'Token non valido', details: errorData },
				{ status: tokenResponse.status }
			);
		}


		logger.log('req delete faq', req);
		const response = await fetch(`http://${DATABASE_URL}/faqs/${req.id}`, {

			method: 'DELETE',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: req.id,
				current_password: req.current_password
			})
		});

		if (!response.ok) {
			logger.error('Errore durante l\'eliminazione della faq', response);
			if (response.status === 401) {
				return json({ error: 'Password errata', details: 'Password errata' }, { status: 401 });
			}

			return json(
				{ error: "Errore durante l'eliminazione della faq", details: response },
				{ status: response.status }
			);
		}
		logger.log('data delete faq success');
		return json({
			success: true,
			message: 'FAQ deleted successfully'
		});
	} catch (error) {

		logger.error("Errore durante l'eliminazione della faq:", error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
