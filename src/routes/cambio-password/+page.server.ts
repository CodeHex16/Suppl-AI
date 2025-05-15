import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import { logger } from '$lib/utils/logger';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

//Questa pagina viene usata sia per il recupero password che per il primo cambio password
export const load = async ({ cookies }) => {
	const token = cookies.get('token');
	if (!token) {
		logger.error('Token not found, redirecting to /');
		throw redirect(303, '/');
	}
};

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		logger.debug('Change password form:', data);
		const currentPassword = data.get('currentPassword')?.toString();
		const password = data.get('password')?.toString();
		const passwordConfirm = data.get('passwordConfirm')?.toString();

		if (!password || !passwordConfirm) {
			logger.error('Password or password confirmation are missing');
			return fail(400, { error: 'Entrambi i campi password sono obbligatori' });
		}

		if (password !== passwordConfirm) {
			logger.error('Password and password confirmation do not match');
			return fail(400, { error: 'La password deve essere uguale in entrambi i campi' });
		}

		// Password validation checks
		const passwordRequirements = [
			{
				test: (pwd: string) => pwd.length >= 8,
				error: 'La password deve essere lunga almeno 8 caratteri'
			},
			{
				test: (pwd: string) => /[A-Z]/.test(pwd),
				error: 'La password deve contenere almeno una lettera maiuscola'
			},
			{
				test: (pwd: string) => /[a-z]/.test(pwd),
				error: 'La password deve contenere almeno una lettera minuscola'
			},
			{
				test: (pwd: string) => /\d/.test(pwd),
				error: 'La password deve contenere almeno una cifra'
			},
			{
				test: (pwd: string) => /[!@#$%^&*(),.?":+{}|<>]/.test(pwd),
				error: 'La password deve contenere almeno un carattere speciale (es. !@#$%^&*())'
			}
		];

		for (const requirement of passwordRequirements) {
			if (!requirement.test(password)) {
				logger.error(requirement.error);
				return fail(400, { error: requirement.error });
			}
		}

		//Cambio di password
		const token = await cookies.get('token');
		if (!token) {
			logger.error('Token not found, redirecting to /');
			return redirect(303, '/');
		}

		const payload = JSON.stringify({
			password: password,
			current_password: currentPassword
		});
		logger.debug('Payload:', payload);
		const response = await fetch(`http://${DATABASE_URL}/users/password`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: payload
		});

		if (!response.ok) {
			const errorResponse = await response.json().catch(() => ({}));
			logger.error('Error response:', errorResponse);
			
			if (errorResponse.error === 'Invalid password') { //TODO: usare il codice di errore
				logger.error('Invalid password');
				return fail(400, { error: 'La password attuale non è corretta' });
			} else {
				logger.error('Server error:', errorResponse);
				return fail(500, { error: 'Errore di connessione al server' });
			}
		}	
		logger.info('Password changed successfully');
		return { success: true };
	}
};
