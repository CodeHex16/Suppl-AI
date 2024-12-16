import type { Message } from '$lib/types';
import * as db from '$lib/database';

export const load = async (data) => {
	return {
		chatIds: db.keys()
	};
};
