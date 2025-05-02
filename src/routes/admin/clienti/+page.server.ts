import type { User } from '$lib/types';
import { env } from '$env/dynamic/private'

const API_URL = env.DATABASE_API_URL;

export const load = async (data) => {
	/*
	const users: User[] = await fetch(`${API_URL}/user`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${data.cookies.get('token')}`
		}
	}).then((response) => response.json());
	console.log(users);

	if (!users || users.length === 0) {
		console.error('No users found or failed to fetch users.');
	}*/
		const users: User[] = [
			{
				id: 1,
				name: 'Mario Rossi',
				role: 'Admin',
				creationDate: '2025-03-15',
				email: 'mario.rossi@gmail.com'
			},
			{
				id: 2,
				name: 'Luca Bianchi',
				role: 'User',
				creationDate: '2025-01-12',
				email: 'luca.bianchi@gmail.com'
			},
			{
				id: 3,
				name: 'Giulia Verdi',
				role: 'User',
				creationDate: '2025-02-20',
				email: 'giulia.verdi@gmail.com'
			}
		];

	return {
		users: users
	};
};