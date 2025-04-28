// /src/routes/api/colors/+server.ts
import type { RequestHandler } from './$types';
import fs from 'fs/promises';
import path from 'path';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { COLOR_PRIMARY, COLOR_PRIMARY_HOVER, COLOR_PRIMARY_TEXT } = await request.json();

		const colors = {
			COLOR_PRIMARY,
			COLOR_PRIMARY_HOVER,
			COLOR_PRIMARY_TEXT
		};

		const filePath = path.resolve('static/settings/colors.json');
		await fs.writeFile(filePath, JSON.stringify(colors, null, 2), 'utf-8');

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error) {
		console.error('Errore nel salvataggio dei colori:', error);
		return new Response(JSON.stringify({ error: 'Errore nel salvataggio' }), { status: 500 });
	}
};
