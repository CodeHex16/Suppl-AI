import type { Actions, ActionFailure } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private'

const API_URL = env.DATABASE_API_URL;

//Questa pagina viene usata sia per il recupero password che per il primo cambio password
export const load = async ({ cookies }) => {
    const token = cookies.get('token')

    if (!token) {
        return redirect(303, '/');
    }
}

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData();

        const password = data.get('password')?.toString();
        const passwordConfirm = data.get('passwordConfirm')?.toString();

        if (password != passwordConfirm) {
            return fail(400, { error: "La password deve essere uguale in entrambi i campi" });
        }
        else if (password && password.length < 8) {
            return fail(400, { error: "La password deve essere lunga almeno 8 caratteri" });
        }

        try {
            //Cambio di password
            const response = await fetch(`${API_URL}/user/edit`, {
                method: 'PUT',
                body: JSON.stringify({
                    "hashed_password": password
                })
            });
        } catch (error) {
            console.error("Errore: ", error);
            return fail(500, { error: 'Errore di connessione al server' });
        }
        return { success: true };
    }
}
