import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private'

const API_URL = env.DATABASE_API_URL;

export const load = async ({ cookies }) => {
	cookies.delete('token', {path : '/'});
	redirect(303, '/');
	return {
		status: 200,
		body: {
			message: 'Logout effettuato con successo'
		}
	};
};