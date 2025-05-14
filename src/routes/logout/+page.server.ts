import { redirect } from '@sveltejs/kit';

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