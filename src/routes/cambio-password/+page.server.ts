import type { Actions, ActionFailure } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

//Questa pagina viene usata sia per il recupero password che per il primo cambio password
export const load = async ({ cookies }) => {
	const token = cookies.get('token');

	if (!token) {
		return redirect(303, '/');
	}
};

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();

		const currentPassword = data.get('currentPassword')?.toString();
		const password = data.get('password')?.toString();
		const passwordConfirm = data.get('passwordConfirm')?.toString();

		if (!password || !passwordConfirm) {
			return fail(400, { error: 'Entrambi i campi password sono obbligatori' });
		}

		if (password !== passwordConfirm) {
			return fail(400, { error: 'La password deve essere uguale in entrambi i campi' });
		}

		// Password validation checks
		if (password.length < 8) {
			return fail(400, { error: 'La password deve essere lunga almeno 8 caratteri' });
		}
		if (!/[A-Z]/.test(password)) {
			return fail(400, { error: 'La password deve contenere almeno una lettera maiuscola' });
		}
		if (!/[a-z]/.test(password)) {
			return fail(400, { error: 'La password deve contenere almeno una lettera minuscola' });
		}
		if (!/\d/.test(password)) {
			return fail(400, { error: 'La password deve contenere almeno una cifra' });
		}
		// Define allowed special characters, adjust as needed. Example includes common ones.
		if (!/[!@#$%^&*(),.?":+{}|<>]/.test(password)) {
			return fail(400, { error: 'La password deve contenere almeno un carattere speciale (es. !@#$%^&*())' });
		}


		try {
			//Cambio di password
			const token = await cookies.get('token');
			if (!token) {
				return redirect(303, '/');
			}

			const payload = JSON.stringify({
				password: password,
				current_password: currentPassword
			});

			// console.log('payload: ', payload);
			const response = await fetch(`http://${DATABASE_URL}/users/password`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: payload
			});

			if (!response.ok) {
				const errorResponse = await response.json();
				console.error('Errore: ', errorResponse);
				if (errorResponse.error === 'Invalid password') {
					return fail(400, { error: 'La password attuale non è corretta' });
				} else {
					return fail(500, { error: 'Errore nel cambio password' });
				}
			}
		} catch (error) {
			console.error('Errore: ', error);
			return fail(500, { error: 'Errore di connessione al server' });
		}
		return { success: true };
	}
};
