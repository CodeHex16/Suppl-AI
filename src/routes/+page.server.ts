import type { Message } from '$lib/types';
import * as db from '$lib/database';
import { redirect } from '@sveltejs/kit';

export const load = async (data) => {
	if (!data.cookies.get('session-test')) {
		redirect(302, '/login');
	}
	return {
		chatIds: db.keys()
	};
};
