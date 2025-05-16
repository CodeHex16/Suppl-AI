import { logger } from '$lib/utils/logger';


import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

export const load = async ({ cookies }) => {
	logger.info('Loading login page');
	
	const token = cookies.get('token');
	if (token) {
		return redirect(303, '/');
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const body = new URLSearchParams({
			grant_type: 'password',
			username: 	 data.get('username')?.toString() || '',
			password: 	 data.get('password')?.toString() || '',
			remember_me: data.get('remember_me')?.toString() === 'on' ? 'true' : 'false'
		});
		logger.debug('Login Post data:', body.toString());

		if (!body.get('username') || !body.get('password')) {
			logger.error('Username or password are missing');
			return fail(400, { error: 'Username e password sono richiesti' });
		}

		try {
			const response = await fetch(`http://${DATABASE_URL}/auth/token?remember_me=${body.get('remember_me')}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body
			});

			if (!response.ok) {
				const errorBody = await response.json().catch(() => ({}));
				logger.error('Error detail:', JSON.stringify(errorBody));
				return fail(403, { error: 'Credenziali non valide', dettagli: JSON.stringify(errorBody) });
			}
			const {access_token, expires_in} = await response.json();
			logger.info('Login response:', { access_token, expires_in });

			cookies.set('token', access_token, {
				path: '/',
				httpOnly: true,
				secure: false,
				//secure: process.env.NODE_ENV === 'production',
				maxAge: expires_in ? expires_in : undefined,
				sameSite: 'strict'
			});
			logger.info('Login successful, token set:', access_token);
		} catch (error) {
			logger.error("Server error:", error);
			return fail(500, { error: 'Errore di connessione al server' });
		}
		return redirect(303, '/');
	}
};
