import type { Actions } from '@sveltejs/kit';
import type { Message } from '$lib/types';
import * as db from '$lib/database.svelte';

export const load = async (data) => {
	return {
		messages: db.getMessages(data.params.id)
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
				content: content
			})
		}).then((response) => response.json());
	}
} satisfies Actions;
