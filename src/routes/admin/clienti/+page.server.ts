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

	if (!usersResponse.ok) {
		console.error('Errore fetch utenti:', usersResponse.status, await usersResponse.text());
		throw error(usersResponse.status, 'Impossibile caricare la lista utenti');
	}

	if (!meResponse.ok) {
		console.error('Errore fetch utente corrente:', meResponse.status, await meResponse.text());
		throw error(meResponse.status, 'Impossibile caricare i dati utente corrente');
	}

	const ris = await usersResponse.json();
	const me = await meResponse.json();

	const loggedInUserId = me._id; // ID dell'utente loggato

	if (!Array.isArray(ris)) {
		console.error('La risposta API per gli utenti non è un array:', ris);
		throw error(500, 'Formato dati utenti non valido');
	}

	const users: User[] = ris
		.map((user: any): User | null => {
			if (
				!user ||
				typeof user._id !== 'string' ||
				typeof user.name !== 'string' ||
				!Array.isArray(user.scopes) ||
				user.scopes.length === 0 ||
				typeof user.scopes[0] !== 'string'
			) {
				console.warn('Dati utente non validi ricevuti, utente skippato:', user);
				return null;
			}
			return {
				email: user._id,
				name: user.name,
				role: user.scopes[0]
			};
		})
		.filter((user): user is User => user !== null)
		.filter((user) => user.email !== loggedInUserId);

	return {
		users: users,
		me: {
			email: me._id,
			name: me.name,
			role: me.scopes[0]
		}
	};
};
