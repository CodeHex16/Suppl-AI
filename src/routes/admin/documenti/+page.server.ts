import {redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import { logger } from '$lib/utils/logger';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

export const load = async (data) => {
	logger.info('Loading admin documents page');

	const token = data.cookies.get('token');
	if (!token){
		logger.error('Token not found, redirecting to /login');
		return redirect(303, '/login');
	}

	const documents = await fetch(`http://${DATABASE_URL}/documents`, {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + token
		}
	});
	logger.info('Response from documents endpoint:', documents);

	if (!documents.ok) {
		const errorBody = await documents.json().catch(() => ({}));
		logger.error('Error fetching documents:', errorBody);
		if (errorBody?.detail?.includes('Token non valido')) {
			logger.error('Invalid token');
			data.cookies.delete('token', { path: '/' });
			throw new Error('Token non valido');
		}
	}
	const documentsData = await documents.json();
	logger.info('Documents data:', documentsData);

	return {
		documents: documentsData
	};
};
