// +page.ts
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

function decodeJwt(token: string): any {
	try {
		const base64Payload = token.split('.')[1];
		const payload = atob(base64Payload);
		return JSON.parse(payload);
	} catch {
		return null;
	}
}

export const load = async (data) => {
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

		// Decode token to extract scopes
		const decoded = decodeJwt(token);
		userScopes = decoded?.scopes || [];

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
