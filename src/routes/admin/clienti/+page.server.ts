import type { User } from '$lib/types';
import { env } from '$env/dynamic/public';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

export const load = async (data) => {
    const response = await fetch(`http://${DATABASE_URL}/users`, {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + data.cookies.get('token')
		}
	});
    const ris = await response.json();
	console.log('ris', ris);
	
    const users: User[] = ris.map((user: any) => {
		return {
			email: user._id,
			name: user.name,
			role: user.scopes[0],
		}	
	});


    return {
        users: users
    };
};