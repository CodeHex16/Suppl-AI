import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

export const load = async (data) => {
	const token = data.cookies.get('token');
	if (!token) return redirect(303, '/login');

	const documents = await fetch(`http://${DATABASE_URL}/documents`, {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + token
		}
	});

	if (!documents.ok) {
		// TODO: double call?
		const errorBody = await documents.json().catch(() => ({}));
		console.error('Dettagli errore:', JSON.stringify(errorBody));
		if (errorBody.detail.includes('Nessun documento trovato')) {
			return { documents: [] };
		}
		if (errorBody.detail.includes('Token non valido')) {
			data.cookies.delete('token', { path: '/' });
			throw new Error('Token non valido');
		}
	}
	const documentsData = await documents.json();
	console.log('documentsData', documentsData);

	return {
		documents: documentsData
	};
};
