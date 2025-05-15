import {logger} from '$lib/utils/logger';
import type { Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

export const load = async () => {
	logger.info('Loading reset password page');
};

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString();
		logger.debug('Reset password:', email);

		// check if email is empty
		if (!email || email?.search('@') == -1) {
			logger.error('Invalid email:', email);
			return fail(400, { error: "Inserisci un'email valida" });
		}
		
		try {
			const response = await fetch(`http://${DATABASE_URL}/users/password_reset`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: email
				})
			});
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				logger.error('Detail error:', JSON.stringify(errorData));

				if (errorData.detail.includes('User not found')) {
					return fail(404, { error: "L'email non è associata a nessun account" });
				}
				return fail(500, { error: 'Errore di connessione al server' });
			}
			logger.info('Reset password email sent to:', email);
			logger.info('Reset response:', await response.json());
		} catch (error) {
			logger.error('Server error: ', error);
			return fail(500, { error: 'Errore di connessione al server' });
		}

		return { success: true };
	}
};
