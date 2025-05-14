import type { Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		// only post method
		if (request.method !== 'POST') {
			return;
		}

		const data = await request.formData();

		const email = data.get('email')?.toString();

		// check if email is empty
		if (!email || email?.search('@') == -1) {
			return fail(400, { error: "Inserisci un'email valida" });
		}

		console.log('email', email);
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
				const errorData = await response.json();
				console.error('Dettagli errore:', JSON.stringify(errorData));
				if (errorData.detail.includes('User not found')) {
					return fail(404, { error: "L'email non è associata a nessun account" });
				}
				return fail(500, { error: 'Errore di connessione al server' });
			}
		} catch (error) {
			console.error('Errore: ', error);
			return fail(500, { error: 'Errore di connessione al server' });
		}

		return { success: true };
	}
};
