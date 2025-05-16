	import { redirect } from '@sveltejs/kit';
	import { env } from '$env/dynamic/public';
	import { type User } from '$lib/types';
	import { logger } from '$lib/utils/logger';
	const DATABASE_URL = env.PUBLIC_DATABASE_URL;


	export const load = async ({cookies}) => {
		logger.info('Loading profile page');

		const token = cookies.get('token');
		if (!token) {
			logger.error('Token not found, redirecting to /');
			return redirect(303, '/');
		}

		const userData = await fetch(`http://${DATABASE_URL}/users/me`,{
			method: 'GET',
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
		const user: User = await userData.json();
		return {
			creds: user
		};
	};
