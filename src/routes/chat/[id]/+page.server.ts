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
		const message: Message = {
			id: crypto.randomUUID(),
			content: content ?? '',
			authorId: 'user'
		};
		db.addMessage(data.params.id ?? '', message);
	}
} satisfies Actions;
