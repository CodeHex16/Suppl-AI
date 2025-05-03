import type { Actions, ActionFailure } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const data = await request.formData();

		const email = data.get('email')?.toString();

		if (!email || !email?.search('@')) {
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
				if (errorData.error === 'User not found') {
					return fail(400, { error: "L'email non è associata a nessun account" });
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
