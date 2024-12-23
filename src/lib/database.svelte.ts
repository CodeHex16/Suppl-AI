import type { Message } from './types';

const db = $state(new Map());

export function getMessages(chatId: string) {
	if (!db.get(chatId)) {
		db.set(chatId, [
			{
				id: crypto.randomUUID(),
				content: 'Ciao, sono SupplAI! Come posso aiutarti?',
				authorId: 'bot'
			}
		]);
	}

	return db.get(chatId);
}

export function addMessage(chatId: string, message: Message) {
	const chat = db.get(chatId) || [];
	chat.push(message);
	db.set(chatId, chat);
}

export function keys() {
	return Array.from(db.keys());
}
