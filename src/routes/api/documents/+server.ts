import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;
const LLM_URL = env.PUBLIC_LLM_URL;

export const POST: RequestHandler = async ({ request, cookies, fetch }) => {
	try {
		const token = cookies.get('token');
		const formData = await request.formData();

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

		console.log('form data', formData);

		const files = formData.getAll('files');

		if (!files || files.length === 0 || !(files[0] instanceof File)) {
			console.error("Nessun file valido trovato nel FormData ricevuto con chiave 'files'");
			return json({ error: "Nessun file valido inviato con chiave 'files'" }, { status: 400 });
		}

		const llmFormData = new FormData();
		files.forEach((file) => {
			if (file instanceof File) {
				llmFormData.append('files', file, file.name);
			}
		});

		const response = await fetch(`http://${LLM_URL}/documents?token=${token}`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`
			},
			body: llmFormData
		});

		console.log('upload LLM response', response);

		if (!response.ok) {
			if (response.status === 400) {
				return json({ error: 'File già caricato o formato errato!' }, { status: 400 });
			} else {
				return json(
					{ error: "Errore durante l'aggiunta del documento", details: response },
					{ status: response.status }
				);
			}
		}
		const data = await response.json();
		console.log('data', data);

		return json({
			success: true,
			message: 'Document added successfully'
		});
	} catch (error) {
		console.error("Errore durante l'aggiunta del documento:", error);
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

		console.log('req delete document', req);
		const response = await fetch(`http://${LLM_URL}/documents?token=${token}`, {
			method: 'DELETE',
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: req.id,
				title: req.title,
				token: token,
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
