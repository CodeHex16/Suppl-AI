import fs from 'fs/promises';
import path from 'path';
import type { LayoutServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
	const theme = cookies.get('theme') as 'light' | 'dark' | undefined;

	try {
		let db_settings = await fetch('/api/update_settings', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		
		if (!db_settings.ok) {
			const errorData = await db_settings.json();
			return fail(db_settings.status, { error: 'Failed to fetch settings', details: errorData });
		}
		
		db_settings = await db_settings.json();
		const colors = {
			COLOR_PRIMARY: db_settings.color_primary,
			COLOR_PRIMARY_HOVER: db_settings.color_primary_hover,
			COLOR_PRIMARY_TEXT: db_settings.color_primary_text
		};

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
