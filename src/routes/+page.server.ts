// +page.ts
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import type { Actions, PageServerLoad } from './$types';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

/**
 * Load function for the main page.
 * 
 * This function is responsible for:
 * 1. Verifying the user's token.
 * 2. Fetching the user's chats.
 * 3. Handling theme toggling and chat deletion actions.
 * 
 * Last reviewed by: Yi Hao Zhuo
 */
export const load: PageServerLoad = async (data) => {
	const token = data.cookies.get('token');
	if (!token) return redirect(303, '/login');

	// A Promise Response that will be resolved later
	let chats: Promise<Chat[]> | undefined = undefined;
	let userScopes: ('admin' | 'user')[] = [];

	try {
		// 1. Verifica il token
		const verify_token = await fetch(`http://${DATABASE_URL}/auth/verify?token=${token}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const response = await verify_token.json();
		console.log('verify_token', response);

		if (response.status === 'not_initialized') {
			return redirect(303, '/cambio-password');
		} else if (response.status !== 'valid') {
			throw new Error('Token non valido');
		}
		userScopes = response.scopes;

		// 2. Fetch delle chat
		chats = fetch(`http://${DATABASE_URL}/chats`, {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + token
			}
		}).then((response) => response.json());

	} catch (error) {
		console.error('Errore durante la verifica del token:', error);
		data.cookies.delete('token', { path: '/' });
		return redirect(303, '/login');
	}

	return {
		token,
		chats,
		userScopes
	};
};

export const actions: Actions = {
	/**
	 * Action: toggleTheme
	 * 
	 * Switches the user's theme (light or dark) and stores the result in a cookie.
	 * 
	 * - If the request contains a `theme` field, it will be used.
	 * - Otherwise, the current theme in the cookie will be toggled (light <--> dark).
	 * - The new theme will be stored in a cookie for one year using the `Set-Cookie` header.
	 * @returns { success: boolean, theme: string }
	 * 
	 * Last reviewed by: Yi Hao Zhuo
	 */
	toggleTheme: async ({ cookies, request }) => {
		const req = await request.formData();
		const reqTheme = req.get('theme');
		const currentTheme = cookies.get('theme') ?? 'light';
		const newTheme = reqTheme ? reqTheme.toString() : currentTheme == 'dark' ? 'light' : 'dark';

		console.log('Actual theme:', currentTheme, 'Requested theme:', reqTheme, 'New theme:', newTheme);

		cookies.set('theme', newTheme, {
			path: '/',
			maxAge: 60 * 60 * 24 * 365, // 1 anno
			httpOnly: true
		});

		return { success: true, theme: newTheme };
	},

	/**
	 * Action: deleteChat
	 * 
	 * Deletes a chat from the database.
	 * 
	 * @returns { success: boolean, [message: string, chat_id: string] }
	 * 
	 * Last reviewed by: Yi Hao Zhuo
	 */
	deleteChat: async ({cookies, request}) => {
		const req = await request.formData();
		console.log('deleteChat', req);
		if (!req.get('chat_id')) {
			console.error('chat_id non trovato');
			return { success: false };
		}
		const chat_id = req.get('chat_id')?.toString();

		const response = await fetch(`http://${DATABASE_URL}/chats/${chat_id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + cookies.get('token')
			}
		});
		if (!response.ok) {
			console.error('Errore durante la cancellazione della chat:', response.statusText);
			return { success: false };
		}
		return {
			success: true,
			message: 'Chat eliminata con successo',
			chat_id: chat_id
		};
	}
};
