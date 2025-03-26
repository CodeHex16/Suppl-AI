import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import type { MessageContext } from '$lib/types';

const API_URL = 'http://database-api:8000';
const LLM_URL = 'http://llm-api:8001';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const requestData = await request.json();

	if (!requestData) {
		throw new Error('No request data');
	}

	console.log(requestData['messages']);
	const messagesString = requestData['messages'].map((message: MessageContext) => message.content).join(' ');

	const response = await fetch(`${LLM_URL}/chat_name`, {
		headers: {
			Authorization: `Bearer ${cookies.get('token')}`,
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify({
			context: messagesString
		})
	});

	if (!response.ok) {
		return json({ error: response.status }, { status: response.status });
	}
	
	const title = await response.json();
	
	// Salva nel database
	const response2 = await fetch(`${API_URL}/chats/${requestData['chat_id']}/name?new_name=${title}`, {
		method: 'PUT',
		headers: {
			Authorization: `Bearer ${cookies.get('token')}`,
			'Content-Type': 'application/json'
		}
	});

	return json({ title });
};