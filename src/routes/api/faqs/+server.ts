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

		if (!req.title || !req.question || !req.answer) {
			return json(
				{ error: 'Dati non validi', details: 'Title, question and answer are required' },
				{ status: 400 }
			);
		}
		// Crea una nuova faq nel database
		const response = await fetch(`http://${DATABASE_URL}/faqs`, {
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
			return json(
				{ error: "Errore durante l'aggiunta della faq", details: response },
				{ status: response.status }
			);
		}
		const data = await response.json();
		console.log('data', data);

		return json({
			success: true,
			faq: { _id: data.id, title: req.title, question: req.question, answer: req.answer },
			message: 'FAQ added successfully'
		});
	} catch (error) {
		console.error('Errore durante la creazione della nuova chat:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ request, cookies }) => {
	try {
		const token = cookies.get('token');
		const req = await request.json();
		console.log('req put faq', req);

		if (!token) {
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

		if (!req.title || !req.question || !req.answer) {
			return json(
				{ error: 'Dati non validi', details: 'Title, question and answer are required' },
				{ status: 400 }
			);
		}
		const response = await fetch(`http://${DATABASE_URL}/faqs/${req.id}`, {
			method: 'PUT',
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
			return json(
				{ error: "Errore durante l'aggiornamento della faq", details: response },
				{ status: response.status }
			);
		}

		return json({
			success: true,
			faq: { title: req.title, question: req.question, answer: req.answer },
			message: 'FAQ updated successfully'
		});
	} catch (error) {
		console.error("Errore durante l'aggiornamento della FAQ:", error);
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
			return json(
				{ error: 'Token non valido', details: errorData },
				{ status: tokenResponse.status }
			);
		}

		console.log('req delete faq', req);
		const response = await fetch(`http://${DATABASE_URL}/faqs/${req.id}`, {
			method: 'DELETE',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				current_password: req.current_password
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
