import type { Actions } from '@sveltejs/kit';
import type { Message } from '$lib/types';
import { redirect, fail } from '@sveltejs/kit';
import type { isFileServingAllowed } from 'vite';

const API_URL = 'http://database-api:8000';
const LLM_URL = 'http://llm-api:8001';


async function updateChatNameIfNeeded(chat: any, token: string, chatId: string) {
    if(chat.messages.length > 2 && chat.name == 'Chat senza nome') {
        let chat_context = chat.messages.map((message: Message) => message.content).join(' ');

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
        
        // Salva nel database
        await fetch(`${API_URL}/chats/${chatId}/name?new_name=${title}`, {
            method: 'PUT',
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

	const result = await updateChatNameIfNeeded(chat, data.cookies.get('token') ?? '', data.params.id);
    if (result.error) return fail(result.error, { error: 'Failed to generate chat name' });


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
				success: true
			};

		} catch (error) {
			return fail(500, { error: 'Failed to send message' });
		}
	}
} satisfies Actions;

