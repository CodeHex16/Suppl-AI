import type { Actions, ActionFailure } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private'

const API_URL = env.DATABASE_API_URL;

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData();

        const email = data.get('email')?.toString();

        if (!email || !email?.search("@")) {
            return fail(400, { error: "Inserisci un'email valida" });
        }

        try {
            //Invio email di recupero password
        } catch (error) {
            console.error("Errore: ", error);
            return fail(500, { error: 'Errore di connessione al server' });
        }

        return { success: true };
    }
}