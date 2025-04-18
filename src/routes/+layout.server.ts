import fs from 'fs/promises';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	try {
		const file = await fs.readFile('static/settings/colors.json', 'utf-8');
		const colors = JSON.parse(file);
		return { colors };
	} catch (error) {
		// fallback
		return {
			colors: {
				COLOR_PRIMARY: '#0dab44',
				COLOR_PRIMARY_HOVER: '#09772f',
				COLOR_PRIMARY_TEXT: '#ffffff'
			}
		};
	}
};
