import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const requestData = await request.json();

	if (!requestData) {
		throw new Error('No request data');
	}

	console.log(requestData['messages']);
	const chatResponse = await fetch('http://llm-api:8001', {
		headers: {
			Authorization: `Bearer ${cookies.get('token')}`,
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify({
			question: requestData['message'],
			messages: requestData['messages']
		})
	});

	if (!chatResponse.ok) {
		const err = await chatResponse.json();
		throw new Error(err);
	}

	return chatResponse;
};
