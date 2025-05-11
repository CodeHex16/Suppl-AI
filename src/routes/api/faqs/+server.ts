import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;
const LLM_URL = env.PUBLIC_LLM_URL;

export const POST: RequestHandler = async ({ request, cookies, fetch }) => {
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
			return json(
				{ error: "Errore durante l'aggiunta della faq", details: errorData },
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
		const response = await fetch(`http://${LLM_URL}/faqs?token=${token}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				title: req.title,
				question: req.question,
				answer: req.answer,
				id: req.id,
			})
		});

		if (!response.ok) {
			console.log('response', response);
			let errorMessage = await response.json();
			console.error('Error response:', errorMessage);
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
		const response = await fetch(`http://${LLM_URL}/faqs?token=${token}`, {
			method: 'DELETE',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: req.id,
				admin_password: req.current_password
			})
		});

		if (!response.ok) {
			if (response.status === 401) {
				return json({ error: 'Password errata', details: 'Password errata' }, { status: 401 });
			}

			return json(
				{ error: "Errore durante l'eliminazione della faq", details: response },
				{ status: response.status }
			);
		}
		return json({
			success: true,
			message: 'FAQ deleted successfully'
		});
	} catch (error) {
		console.error("Errore durante l'eliminazione della faq:", error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
