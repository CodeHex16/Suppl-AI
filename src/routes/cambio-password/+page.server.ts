import type { Actions, ActionFailure } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { jwtDecode } from 'jwt-decode';

const API_URL = env.DATABASE_API_URL;

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

		if (password != passwordConfirm) {
			return fail(400, { error: 'La password deve essere uguale in entrambi i campi' });
		} else if (password && password.length < 8) {
			return fail(400, { error: 'La password deve essere lunga almeno 8 caratteri' });
		}

		try {
			//Cambio di password
			const token = await cookies.get('token');
			if (!token) {
				return redirect(303, '/');
			}

			const payload = JSON.stringify({
				email: jwtDecode(token).sub,
                password: password,
                current_password: currentPassword
			});

			// console.log('payload: ', payload);
			const response = await fetch(`${API_URL}/user/update_password`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: payload
			});
		} catch (error) {
			console.error('Errore: ', error);
			return fail(500, { error: 'Errore di connessione al server' });
		}
		return { success: true };
	}
};
