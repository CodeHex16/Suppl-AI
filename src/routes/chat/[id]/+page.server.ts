import type { Actions } from '@sveltejs/kit';
import { redirect, fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

import type { Chat, Message } from '$lib/types';

const API_URL = 'http://' + env.PUBLIC_DATABASE_URL;
const LLM_URL = 'http://' + env.PUBLIC_LLM_URL;

async function updateChatNameIfNeeded(chat: Chat, token: string, chatId: string) {
	if (chat.messages.length > 2 && chat.name == 'Chat senza nome') {
		const chat_context = chat.messages.map((message: Message) => message.content).join(' ');

		const response = await fetch(`${LLM_URL}/chat_name`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				context: chat_context
			})
		});

		if (!response.ok) return { error: response.status };

		const title = await response.json();

		console.log('Chat name:', title);
		// Salva nel database
		await fetch(`${API_URL}/chats/${chatId}/name?new_name=${title}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		// Aggiorna l'oggetto chat locale
		chat.name = title;
	}

	return { chat };
}

export const load = async ({ cookies, params }) => {
	if (!cookies.get('token')) {
		return redirect(303, '/login');
	}

	const chat = await fetch(`${API_URL}/chats/${params.id}/messages`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${cookies.get('token')}`
		}
	}).then((response) => response.json());

	if (chat.detail == 'Token is invalid or expired') {
		cookies.delete('token', { path: '/' });
		return redirect(303, '/login');
	}

	if (chat.detail == 'Chat not found') {
		return redirect(303, '/');
	}

	const result = await updateChatNameIfNeeded(chat, cookies.get('token') ?? '', params.id);
	if (result.error) return fail(result.error, { error: 'Failed to generate chat name' });

	return {
		chat: chat,
		chat_id: params.id
	};
};

export const actions = {
	default: async ({ request, params, cookies }) => {
		const req = await request.formData();
		if (!req.get('message')) return;

		const content = req.get('message')?.toString();
		try {
			const response = await fetch(`${API_URL}/chats/${params.id}/messages`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${cookies.get('token')}`
				},
				body: JSON.stringify({
					content: content
				})
			});

			if (!response.ok) return fail(response.status, { error: 'Failed to send message' });

			return {
				success: true
			};
		} catch {
			return fail(500, { error: 'Failed to send message' });
		}
	}
} satisfies Actions;
