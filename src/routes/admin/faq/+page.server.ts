
import type { User } from '$lib/types';
import { env } from '$env/dynamic/public';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit'; // Import error helper

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const token = cookies.get('token');
	if (!token) {
		throw error(401, 'Autenticazione richiesta');
	}
	const faqsResponse = await fetch(`http://${DATABASE_URL}/faqs`, {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + token
		}
	});
	if (!faqsResponse.ok) {
		if(faqsResponse.status === 404) {
			return {
				faqs: []
			};
		}
		if(faqsResponse.status === 403) {
			console.error('Accesso negato:', faqsResponse.status, await faqsResponse.text());
			throw error(403, 'Accesso negato');
		}

		console.error('Errore fetch FAQ:', faqsResponse.status, await faqsResponse.text());
		throw error(faqsResponse.status, 'Impossibile caricare la lista FAQ');
	}
	const ris = await faqsResponse.json();
	if (!Array.isArray(ris)) {
		console.error('La risposta API per le FAQ non è un array:', ris);
		throw error(500, 'Formato dati FAQ non valido');
	}
	

    return {
        faqs: ris
    };
};


