import type { Actions, ActionFailure } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private'

const API_URL = env.DATABASE_API_URL;

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData();

        const username = data.get('username')?.toString();

        if (!username || !username?.search("@")) {
            return fail(400, { error: "Inserisci un'email valida" });
        }
        else {
            return { success: true };
        }
    }
}