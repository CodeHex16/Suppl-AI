import type { Actions } from '@sveltejs/kit';
import type { Message } from '$lib/types';
import { redirect } from '@sveltejs/kit';

const API_URL = 'http://localhost:8000';

export const load = async (data) => {
	if (!data.cookies.get('token')) {
		redirect(303, '/login');
	}
	const token = data.cookies.get('token');

	const chat = await fetch(`${API_URL}/chats/${data.params.id}/messages`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	}).then((response) => response.json());

	if (chat.detail == 'Token is invalid or expired') {
		data.cookies.delete('token', { path: '/' });
	}

	return {
		chat: chat
	};
};

export const actions = {
	default: async (data) => {
		const req = await data.request.formData();
		if (!req.get('message')) return;
		const content = req.get('message')?.toString();
		const token = data.cookies.get('token');
		const chat = await fetch(`${API_URL}/chats/${data.params.id}/messages`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				chat_id: data.params.id,
				content: content
			})
		}).then((response) => response.json());
	}
} satisfies Actions;
