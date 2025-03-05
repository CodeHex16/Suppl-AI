import type { Actions } from '@sveltejs/kit';
import type { Message } from '$lib/types';
import { redirect, fail } from '@sveltejs/kit';

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
	default: async (event) => {
		const req = await event.request.formData();
		if (!req.get('message')) return;

		const content = req.get('message')?.toString();
		const token = event.cookies.get('token');

		try {
			const response = await fetch(`${API_URL}/chats/${event.params.id}/messages`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					content: content
				})
			});

			if (!response.ok) {
				return fail(response.status, { error: 'Failed to send message' });
			}

			// Return success response with message to reload
			return { 
				success: true,
				invalidateMessages: true 
			};
		} catch (error) {
			return fail(500, { error: 'Failed to send message' });
		}
	}
} satisfies Actions;
