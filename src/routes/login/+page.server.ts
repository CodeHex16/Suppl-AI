import type { Actions, ActionFailure } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

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
		const remember_me = data.get('remember_me')?.toString() === 'on' ? 'true' : 'false';
		console.log("remember_me", remember_me);

		if (!username || !password) {
			return fail(400, { error: 'Username e password sono richiesti' });
		}

		try {
			// Chiamata API per autenticazione e ricezione JWT
			const response = await fetch(`http://${DATABASE_URL}/auth/token?remember_me=${remember_me}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({
					grant_type: 'password',
					username: username,
					password: password,
				})
			});

			if (!response.ok) {
				const errorBody = await response.json().catch(() => ({}));
				console.error('Dettagli errore:', JSON.stringify(errorBody));
				return fail(403, { error: 'Credenziali non valide', dettagli: JSON.stringify(errorBody) });
			}

			const {access_token, expires_in} = await response.json();

			// Salva JWT nel cookie
			cookies.set('token', access_token, {
				path: '/',
				httpOnly: true,
				secure: false,
				//secure: process.env.NODE_ENV === 'production',
				maxAge: expires_in ? expires_in : undefined,
				sameSite: 'strict'
			});
		} catch (error) {
			console.error("Errore durante l'autenticazione:", error);
			return fail(500, { error: 'Errore di connessione al server' });
		}
	}
};
