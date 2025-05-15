// /src/routes/api/colors/+server.ts
import type { RequestHandler } from './$types';
import fs from 'fs/promises';
import path from 'path';
import { logger } from '$lib/utils/logger';

export const POST: RequestHandler = async ({ request }) => {
	logger.info('POST /api/update_colors');
	try {
		const { COLOR_PRIMARY, COLOR_PRIMARY_HOVER, COLOR_PRIMARY_TEXT } = await request.json();
		
		const colors = {
			COLOR_PRIMARY,
			COLOR_PRIMARY_HOVER,
			COLOR_PRIMARY_TEXT
		};

		logger.debug('Colors to save:', colors);

		const filePath = path.resolve('static/settings/colors.json');
		await fs.writeFile(filePath, JSON.stringify(colors, null, 2), 'utf-8');
		logger.info('Colors saved successfully:', colors);
		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error) {
		logger.error('Errore nel salvataggio dei colori:', error);
		return new Response(JSON.stringify({ error: 'Errore nel salvataggio' }), { status: 500 });
	}
};
