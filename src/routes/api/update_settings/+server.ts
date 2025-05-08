// /src/routes/api/colors/+server.ts
import type { RequestHandler } from './$types';
import fs from 'fs/promises';
import path from 'path';
import { env } from '$env/dynamic/public';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { color_primary, color_primary_hover, color_primary_text, message_history } =
			await request.json();

		const settings = {
			color_primary,
			color_primary_hover,
			color_primary_text,
			message_history
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
			const errorData = await response.json();
			return new Response(JSON.stringify({ error: 'Failed to save colors', details: errorData }), {
				status: response.status
			});
		} else {
			const color_const = {
				COLOR_PRIMARY: color_primary,
				COLOR_PRIMARY_HOVER: color_primary_hover,
				COLOR_PRIMARY_TEXT: color_primary_text
			};
			const filePath = path.resolve('static/settings/settings.json');
			await fs.writeFile(filePath, JSON.stringify(color_const, null, 2), 'utf-8');
		}

		return response;
	} catch (error) {
		console.error('Errore nel salvataggio dei colori:', error);
		return new Response(JSON.stringify({ error: 'Errore nel salvataggio' }), { status: 500 });
	}
};
