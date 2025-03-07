import type { UserCredentials } from '$lib/types';

export const load = async (data) => {
	const creds: UserCredentials = { email: '', password: '' };


	return {
		creds
	};
};
