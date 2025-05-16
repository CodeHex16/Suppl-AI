import type { LayoutServerLoad } from './$types';
import { logger } from '$lib/utils/logger';
import { fail } from '@sveltejs/kit';

/**
 * Load function for the layout server.
 * 
 * This function is responsible for:
 * 1. Loading the theme and colors from a JSON file.
 * 2. Returning the theme and colors to the client.
 * 
 * Last reviewed by: Yi Hao Zhuo
 */
export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
	logger.info('Loading layout server');

	const theme = cookies.get('theme') as 'light' | 'dark' | undefined;
	logger.debug('Current theme:', theme);
	try {
		const db_settings = await fetch('/api/update_settings', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!db_settings.ok) {
			const errorData = await db_settings.json();
			logger.error('Failed to fetch settings:', db_settings.status, errorData);
			return fail(db_settings.status, { error: 'Failed to fetch settings', details: errorData });
		}

		const db_settings_json = await db_settings.json();
		const settings = {
			COLOR_PRIMARY: db_settings_json.color_primary,
			COLOR_PRIMARY_HOVER: db_settings_json.color_primary_hover,
			COLOR_PRIMARY_TEXT: db_settings_json.color_primary_text,
			CHAT_HISTORY: db_settings_json.message_history
		};
		logger.info('Settings loaded:', JSON.stringify(settings));

		return { settings, theme: theme ?? 'light' };
	} catch {
		return {
			settings: {
				COLOR_PRIMARY: '#0dab44',
				COLOR_PRIMARY_HOVER: '#09772f',
				COLOR_PRIMARY_TEXT: '#ffffff',
				CHAT_HISTORY: 50
			},
			theme: theme ?? 'light'
		};
	}
};
