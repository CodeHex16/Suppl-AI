//import type { Actions } from '@sveltejs/kit';
import { redirect, fail, type Actions } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

import type { Chat, Message } from '$lib/types';
import { logger } from '$lib/utils/logger.js';

const API_URL = 'http://' + env.PUBLIC_DATABASE_URL;
const LLM_URL = 'http://' + env.PUBLIC_LLM_URL;

async function updateChatNameIfNeeded(chat: Chat, token: string, chatId: string) {
	if (chat.messages.length > 2 && chat.name == 'Chat senza nome') {
		logger.info('Generazione del nome della chat...');
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
		logger.info('Response from LLM:', response);
		if (!response.ok) {
			logger.error('Errore durante la generazione del nome della chat:', response.status);
			return { error: response.status };
		}

		const title = await response.json();

		logger.info('Nome generato:', title);

		// Salva nel database
		const responseDB = await fetch(`${API_URL}/chats/${chatId}/name?new_name=${title}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		if (!responseDB.ok) {
			logger.error('Errore durante il salvataggio del nome della chat:', responseDB.status);
			return { error: responseDB.status };
		}
		logger.info('Nome della chat aggiornato con successo:', title);
		chat.name = title;
	} else {
		logger.info('Chat name already set or not enough messages to generate a name');
	}
	logger.info('Chat:', chat);
	return { chat };
}

export const load = async ({ cookies, params }) => {
	logger.info('Loading chat page', params.id);

	if (!cookies.get('token')) {
		logger.error('Token non trovato, reindirizzando a /login');
		throw redirect(303, '/login');
	}

	const chat = await fetch(`${API_URL}/chats/${params.id}/messages`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${cookies.get('token')}`
		}
	}).then((response) => response.json());

	if (!chat || chat.detail == 'Chat not found') {
		logger.error('Chat non trovata, reindirizzando a /');
		throw redirect(303, '/');
	}

	if (chat.detail == 'Token is invalid or expired') { // 401 token scaduto
		logger.error('Token scaduto, reindirizzando a /login');
		cookies.delete('token', { path: '/' });
		throw redirect(303, '/login');
	}

	const result = await updateChatNameIfNeeded(chat, cookies.get('token') ?? '', params.id);
	if (result.error) {
		logger.error('Errore durante la generazione del nome della chat:', result.error);
		return fail(result.error, { error: 'Failed to generate chat name' });
	}

	logger.info('Chat caricata con successo:', chat);

	return {
		chat: chat,
		chat_id: params.id
	};
};


export const actions = {
	default: async ({ request, params, cookies }) => {
		logger.info('Invio messaggio alla chat', params.id);

		const req = await request.formData();
		const content = req.get('message')?.toString();
		logger.debug('Invio messaggio:', content);
		if (!req.get('message')){
			logger.error('messaggio inviato vuoto');
			return;
		}

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

			if (!response.ok){
				logger.error('Errore durante l\'invio del messaggio:', response.status);
				return fail(response.status, { error: 'Failed to send message' });
			} 
			logger.info('Messaggio inviato con successo:', content);
			return {
				success: true
			};
		} catch {
			return fail(500, { error: 'Failed to send message' });
		}
	}
} satisfies Actions;
