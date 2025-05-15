import { redirect } from '@sveltejs/kit';
import { logger } from '$lib/utils/logger';

export const load = async ({ cookies }) => {
	logger.info('Loading logout page');
	cookies.delete('token', {path : '/'});
	throw redirect(303, '/');
};