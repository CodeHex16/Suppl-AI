import { render } from '@testing-library/svelte';
import RecuperoPassword from '../../../src/routes/recupero-password/+page.svelte';
import { page } from '$app/state';
import { vi } from 'vitest';

vi.mock('$app/state', async () => {
	const actual = await vi.importActual<typeof import('$app/state')>('$app/state');
	return {
		...actual,
		page: {
			form: {
				success: false,
				error: null
			}
		}
	};
});

vi.mock('$lib/components/HeaderPages.svelte', () => ({
  default: vi.fn()
}));

describe('RecuperoPassword', () => {
	it('renders success message when form.success is true', async () => {
		(page).form = { success: true };

		const { getByText } = render(RecuperoPassword);

		expect(getByText('Password resettata')).toBeTruthy();
		expect(
			getByText("Ti abbiamo inviato la nuova password temporanea all'indirizzo fornito.")
		).toBeTruthy();
	});

	it('renders form and error message when form.error is present', async () => {
		(page).form = { error: 'Errore email non trovata' };

		const { getByText, getByPlaceholderText } = render(RecuperoPassword);

		expect(getByText('Recupero password')).toBeTruthy();
		expect(getByText('Errore email non trovata')).toBeTruthy();
		expect(getByPlaceholderText('Email')).toBeTruthy();
	});

	it('renders default form when no form.success or form.error', async () => {
		(page).form = {};

		const { getByText, getByLabelText } = render(RecuperoPassword);

		expect(getByText('Recupero password')).toBeTruthy();
		expect(getByLabelText('Email per il recupero password')).toBeTruthy();
	});
});
