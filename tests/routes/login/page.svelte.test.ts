import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import LoginForm from '../../../src/routes/login/+page.svelte';

describe('LoginForm', () => {
	it('renders login form with email and password fields', () => {
		render(LoginForm);

		expect(screen.getByLabelText('Email')).toBeInTheDocument();
		expect(screen.getByLabelText('Password')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /Accedi/i })).toBeInTheDocument();
		expect(screen.getByText(/Password dimenticata/i)).toBeInTheDocument();
	});

	it('shows error message if form.error is set', () => {


		vi.mock('$app/state', () => ({
			page: {form: {
				error: 'Credenziali non valide'
			}}
		}));

    render(LoginForm);

		expect(screen.getByText('Credenziali non valide')).toBeInTheDocument();
	});
});
