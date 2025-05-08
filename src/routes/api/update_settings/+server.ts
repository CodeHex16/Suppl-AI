// /src/routes/api/colors/+server.ts
import type { RequestHandler } from './$types';
import fs from 'fs/promises';
import path from 'path';
import { env } from '$env/dynamic/public';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { color_primary, color_primary_hover, color_primary_text, chat_history } = await request.json();

		const settings = {
			color_primary,
			color_primary_hover,
			color_primary_text,
			message_history: chat_history
		};

		const response = await fetch(`http://${DATABASE_URL}/settings`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${cookies.get('token')}`
			},
			body: JSON.stringify(settings)
		});

		if (!response.ok) {
			throw new Error(`Failed to update settings: ${response.statusText}`);
		}

		return response;
	} catch (error) {
		console.error('Errore nel salvataggio dei colori:', error);
		return new Response(JSON.stringify({ error: 'Errore nel salvataggio' }), { status: 500 });
	}
};


export const GET: RequestHandler = async ({ }) => {
	try {
		const response = await fetch(`http://${DATABASE_URL}/settings`, {
			method: 'GET',
		});

		if (!response.ok) {
			const errorData = await response.json();
			return new Response(JSON.stringify({ error: 'Failed to fetch colors', details: errorData }), {
				status: response.status
			});
		}

		const data = await response.json();
		return new Response(JSON.stringify(data), { status: 200 });
	} catch (error) {
		console.error('Errore nel recupero dei colori:', error);
		return new Response(JSON.stringify({ error: 'Errore nel recupero' }), { status: 500 });
	}
}
