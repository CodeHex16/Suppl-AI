import type { Actions } from '@sveltejs/kit';
import type { Message } from '$lib/types';
import { redirect, fail } from '@sveltejs/kit';

const API_URL = 'http://database-api:8000';
const LLM_URL = 'http://llm-api:8001';

export const load = async (data) => {
	if (!data.cookies.get('token')) {
		redirect(303, '/login');
	}

	const chat = await fetch(`${API_URL}/chats/${data.params.id}/messages`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${data.cookies.get('token')}`
		}
	}).then((response) => response.json());

	if (chat.detail == 'Token is invalid or expired') {
		data.cookies.delete('token', { path: '/' });
		redirect(303, '/login');
	}

	return {
		chat: chat,
		chat_id: data.params.id
	};
};

export const actions = {
	default: async (event) => {
		const req = await event.request.formData();
		if (!req.get('message')) return;

		const content = req.get('message')?.toString();

		try {
			const response = await fetch(`${API_URL}/chats/${event.params.id}/messages`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${event.cookies.get('token')}`
				},
				body: JSON.stringify({
					content: content
				})
			});

			if (!response.ok) return fail(response.status, { error: 'Failed to send message' });

			return {
				success: true,
			};
		} catch (error) {
			return fail(500, { error: 'Failed to send message' });
		}
	}
} satisfies Actions;
