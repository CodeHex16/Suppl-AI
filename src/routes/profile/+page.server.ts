import type { Message, UserCredentials } from '$lib/types';
import * as db from '$lib/database';
import { redirect } from '@sveltejs/kit';

export const load = async (data) => {
	const creds: UserCredentials = { email: '', password: '' };

	if (data.cookies.get('session-test')) {
		creds['email'] = data.cookies.get('session-test')?.split(';')[0] ?? '';
		creds['password'] = data.cookies.get('session-test')?.split(';')[1] ?? '';
	}
	return {
		creds
	};
};
