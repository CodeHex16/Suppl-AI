import type { User } from '$lib/types';
import { env } from '$env/dynamic/public';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit'; // Import error helper
import { logger } from '$lib/utils/logger';
import { redirect } from '@sveltejs/kit';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	logger.info('Loading admin cliente page');
	const token = cookies.get('token');
	if (!token) {
		logger.error('Token non trovato, reindirizzando a /login');
		throw redirect(303, '/login');
	}

	const [usersResponse, meResponse] = await Promise.all([
		fetch(`http://${DATABASE_URL}/users`, {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + token
			}
		}),
		fetch(`http://${DATABASE_URL}/users/me`, {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + token
			}
		})
	]);
	logger.info('Response from users endpoint:', usersResponse);
	logger.info('Response from me endpoint:', meResponse);

	if (!usersResponse.ok) {
		logger.error('Errore fetch utenti:', usersResponse.status, await usersResponse.text());
		throw error(usersResponse.status, 'Impossibile caricare la lista utenti');
	}

	if (!meResponse.ok) {
		logger.error('Errore fetch utente corrente:', meResponse.status, await meResponse.text());
		throw error(meResponse.status, 'Impossibile caricare i dati utente corrente');
	}

	const ris = await usersResponse.json();
	const me = await meResponse.json();
	logger.info('Risposta utenti:', ris);
	logger.info('Risposta utente corrente:', me);

	if (!Array.isArray(ris)) {
		logger.error('La risposta API per gli utenti non è un array:', ris);
		throw error(500, 'Formato dati utenti non valido');
	}

	/**
	 * Filtra utente non valido
	 * Filtra anche l'utente corrente
	 */
	const users: User[] = ris
		.map((user: User): User | null => {
			if (
				!user ||
				typeof user._id !== 'string' ||
				typeof user.name !== 'string' ||
				!Array.isArray(user.scopes) ||
				user.scopes.length === 0 ||
				typeof user.scopes[0] !== 'string'
			) {
				logger.warn('Dati utente non validi ricevuti, utente skippato:', user);
				return null;
			}
			return {
				email: user._id,
				name: user.name,
				role: user.scopes[0]
			};
		})
		.filter((user): user is User => user !== null)
		.filter((user) => user.email !== me._id); // ID dell'utente loggato
	logger.info('Utenti filtrati:', users);
	logger.info('Utente corrente:', me);
	
	return {
		users: users,
		me: {
			email: me._id,
			name: me.name,
			role: me.scopes[0]
		}
	};
};
