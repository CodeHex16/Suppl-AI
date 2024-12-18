import type { Actions, ActionFailure } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
	if (cookies.get('session-test')) {
		redirect(303, '/');
	}
};

export const actions = {
	default: async ({
		request,
		cookies
	}): Promise<ActionFailure<{ error: string }> | { success: boolean }> => {
		const req = await request.formData();
		const email = req.get('email');
		const password = req.get('password');

		if (!email) {
			return fail(400, {
				error: 'Email is required'
			});
		}

		if (!password) {
			return fail(400, {
				error: 'Password is required'
			});
		}

		try {
			if (email && password) {
				cookies.set('session-test', email + ';' + password, {
					// Opzioni del cookie
					path: '/'
				});
				return {
					success: true
				};
			}
			return fail(401, {
				error: 'Invalid credentials'
			});
		} catch (error) {
			return fail(500, {
				error: 'Authentication failed'
			});
		}
	}
} satisfies Actions;
