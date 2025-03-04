import type { Actions, ActionFailure } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';

const API_URL = 'http://localhost:8000';

export const load = async ({ cookies }) => {
	const token = cookies.get('token');

	if (token) {
		return redirect(303, '/');
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();

		const username = data.get('username')?.toString();
		const password = data.get('password')?.toString();

		if (!username || !password) {
			return fail(400, { error: 'Username e password sono richiesti' });
		}

		try {
			// Chiamata API per autenticazione e ricezione JWT
			const response = await fetch(`${API_URL}/auth/token`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({
					grant_type: 'password',
					username: username,
					password: password
				})
			});

			if (!response.ok) {
				const errorBody = await response.json().catch(() => ({}));
				// Convert arrays or objects to string for proper display
				const formattedErrorBody = JSON.stringify(errorBody);
				console.error('Dettagli errore:', formattedErrorBody);
				return fail(403, { error: 'Credenziali non valide', dettagli: formattedErrorBody });
			}

			const { access_token } = await response.json();

			// Salva JWT nel cookie
			cookies.set('token', access_token, {
				path: '/',
				httpOnly: true,
				secure: false,
				//secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7, // 1 settimana
				sameSite: 'strict'
			});
		} catch (error) {
			console.error("Errore durante l'autenticazione:", error);
			return fail(500, { error: 'Errore di connessione al server' });
		}
	}
};
