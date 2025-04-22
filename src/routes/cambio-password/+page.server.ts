import type { Actions, ActionFailure } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private'

const API_URL = env.DATABASE_API_URL;

export const load = async ({ cookies }) => {
    const token = cookies.get('token');
    /* Per motivi di testing
    if (token) {
        return redirect(303, '/');
    }
    */
    const user = await fetch(`${API_URL}/user/register`, {
        method: 'GET'
    });
    console.log(user)
}

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData();


        const password = data.get('password')?.toString();
        const passwordConfirm = data.get('passwordConfirm')?.toString();


        if (password != passwordConfirm) {
            return fail(400, { error: "La password deve essere uguale in entrambi i campi" });
        }
    }
}