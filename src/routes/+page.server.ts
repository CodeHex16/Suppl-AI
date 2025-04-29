// +page.ts
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import type { Actions, PageServerLoad } from './$types';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;


export const load: PageServerLoad = async (data) => {
	const token = data.cookies.get('token');
	if (!token) redirect(303, '/login');

	let chats = null;
	let userScopes: string[] = [];

	try {
		const verify_token = await fetch(`http://${DATABASE_URL}/auth/verify?token=${token}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const response = await verify_token.json();

		if (response.status !== 'valid') {
			data.cookies.delete('token', { path: '/' });
			redirect(303, '/login');
		}
		userScopes = response.scopes;

		chats = fetch(`http://${DATABASE_URL}/chats`, {
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + token
			}
		}).then((response) => response.json());
	} catch (error) {
		data.cookies.delete('token', { path: '/' });
		redirect(303, '/login');
	}

	return {
		token,
		chats,
		userScopes
	};
};


export const actions: Actions = {
	// Azione per cambiare il tema
	toggleTheme: async ({ cookies, request }) => {
		const currentTheme = cookies.get('theme') ?? 'light';
		const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

		cookies.set('theme', newTheme, {
			path: '/',
			maxAge: 60 * 60 * 24 * 365, // 1 anno
			httpOnly: false, // Necessario per leggerlo anche lato client se serve (ma lo script in app.html usa localStorage)
			sameSite: 'lax'
		});
		return { success: true, theme: newTheme };
	}
};
