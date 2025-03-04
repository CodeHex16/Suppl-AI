import { redirect } from '@sveltejs/kit';

const API_URL = 'http://localhost:8000';

export const load = async (data) => {
	if (!data.cookies.get('token')) {
		redirect(303, '/login');
	}

	const token = data.cookies.get('token');
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
	} catch (error) {
		data.cookies.delete('token', { path: '/' });
		redirect(303, '/login');
	}


	return {
		props: {
			token: token,
		}
	};
};
