import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;


export const load = async ({cookies}) => {
	const token = cookies.get('token');

	if (!token) {
		return redirect(303, '/');
	}

	const userData = await fetch(`http://${DATABASE_URL}/users/me`,{
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + token
		}
	});
	const user = await userData.json();

	return {
		creds: user
	};
};
