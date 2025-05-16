import type { RequestHandler } from './$types';
import fs from 'fs/promises';
import path from 'path';
import { env } from '$env/dynamic/public';
import { logger } from '$lib/utils/logger';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

export const POST: RequestHandler = async ({ request, cookies }) => {
	logger.info('POST /api/update_settings');
	try {
		const { color_primary, color_primary_hover, color_primary_text, chat_history } = await request.json();

		const settings = {
			color_primary,
			color_primary_hover,
			color_primary_text,
			message_history: chat_history
		};
		logger.debug('Request data:', settings);
		const response = await fetch(`http://${DATABASE_URL}/settings`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${cookies.get('token')}`
			},
			body: JSON.stringify(settings)
		});
		logger.debug('Response from database:', response);
		if (!response.ok){
			const errorData = await response.json();
			logger.error('Error from database:', errorData);
			throw new Error(`Failed to update settings: ${response.statusText}`);
		}
		logger.info('Settings updated successfully');
		return {ok: true, message: 'Settings updated successfully'};
	} catch (error) {
		logger.error('Errore nel salvataggio dei colori:', error);
		return new Response(JSON.stringify({ error: 'Errore nel salvataggio' }), { status: 500 });
	}
};


export const GET: RequestHandler = async ({ }) => {
	logger.info('GET /api/get_settings');
	try {
		const response = await fetch(`http://${DATABASE_URL}/settings`, {
			method: 'GET',
		});

		if (!response.ok) {
			const errorData = await response.json();
			logger.error('Error from database:', errorData);
			return new Response(JSON.stringify({ error: 'Failed to fetch settings', details: errorData }), {
				status: response.status
			});
		}

		const data = await response.json();
		logger.info('Settings fetched successfully', JSON.stringify(data));
		return new Response(JSON.stringify(data), { status: 200 });
	} catch (error) {
		logger.error('Errore nel recupero dei colori:', error);
		return new Response(JSON.stringify({ error: 'Errore nel recupero' }), { status: 500 });
	}
}
