import fs from 'fs/promises';
import type { LayoutServerLoad } from './$types';

/**
 * Load function for the layout server.
 * 
 * This function is responsible for:
 * 1. Loading the theme and colors from a JSON file.
 * 2. Returning the theme and colors to the client.
 * 
 * Last reviewed by: Yi Hao Zhuo
 */
export const load: LayoutServerLoad = async ({ cookies }) => {
	const theme = cookies.get('theme') as 'light' | 'dark' | undefined;

	try {
		const file = await fs.readFile('static/settings/colors.json', 'utf-8');
		const colors = JSON.parse(file);
		return { colors, theme: theme ?? 'light' };
	} catch {
		// fallback
		return {
			colors: {
				COLOR_PRIMARY: '#0dab44',
				COLOR_PRIMARY_HOVER: '#09772f',
				COLOR_PRIMARY_TEXT: '#ffffff'
			},
			theme: theme ?? 'light'
		};
	}
};
