import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { logger } from '$lib/utils/logger';

export const load: PageServerLoad = async ({ fetch, cookies, url }) => {
	logger.info('Loading admin statistics page');
	const token = cookies.get('token');
	if (!token){
		logger.error('Token not found, redirecting to /login');
		throw error(401, 'Autenticazione richiesta');
	}
};
