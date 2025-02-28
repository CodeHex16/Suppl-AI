import * as db from '$lib/database.svelte';
import { redirect } from '@sveltejs/kit';

export const load = async (data) => {

	return {
		chatIds: db.keys()
	};
};
