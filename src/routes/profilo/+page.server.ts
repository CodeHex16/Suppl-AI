import type { UserCredentials } from '$lib/types';
import { redirect } from '@sveltejs/kit';

export const load = async ({cookies}) => {
	const token = cookies.get('token');

	if (!token) {
		return redirect(303, '/');
	}

	//TODO: get user data from API
	const creds: UserCredentials = { email: '', password: '' };


	return {
		creds
	};
};
