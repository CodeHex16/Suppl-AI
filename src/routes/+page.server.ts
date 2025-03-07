import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const API_URL = env.DATABASE_API_URL;

export const load = async (data) => {
	if (!data.cookies.get('token')) {
		redirect(303, '/login');
	}

	const token = data.cookies.get('token');
	let chats = null;
	try {
		const verify_token = await fetch(`${API_URL}/auth/verify?token=${token}`, {
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

		chats = fetch(API_URL + '/chats', {
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
		props: {
			token: token
		},
		chats: chats
	};
};

