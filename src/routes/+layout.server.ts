import fs from 'fs/promises';
import type { LayoutServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const theme = cookies.get('theme') as 'light' | 'dark' | undefined;
	try {
		const file = await fs.readFile('static/settings/colors.json', 'utf-8');
		const colors = JSON.parse(file);
		return { colors, theme: theme ?? 'light' };
	} catch (error) {
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
