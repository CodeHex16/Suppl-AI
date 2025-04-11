import type { User } from '$lib/types';

export const load = async (data) => {
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