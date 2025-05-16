import { render, fireEvent, screen } from '@testing-library/svelte';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import PasswordChangePage from '../../../src/routes/cambio-password/+page.svelte';

import { page } from '$app/state';
vi.mock('$lib/components/HeaderPages.svelte', () => ({
  default: vi.fn()
}));

describe('Password Change Page', () => {

  beforeEach(() => {

    vi.mock('$app/state', () => ({
      page: { form:  {
        success: false,
        error: null
      } }
    }));
  });

  it('should display form with empty fields initially', async () => {
    render(PasswordChangePage);

    expect(screen.getByLabelText(/Password attuale/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nuova password/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Conferma password/)).toBeInTheDocument();
    expect(screen.getByText('Cambia password')).toBeInTheDocument();
  });

  it('should show success message when password change is successful', async () => {
    // Set form state to success
    page.form = { success: true, error: null };
    render(PasswordChangePage);

    // Check if success message is shown
    expect(screen.getByText('La password è stata cambiata con successo.')).toBeInTheDocument();
    expect(screen.getByText('Vai alla homepage')).toBeInTheDocument();
  });

  it('should show error message if there is an error', async () => {
    // Set form state to error
    page.form = { success: false, error: 'La password attuale non è corretta' };
    render(PasswordChangePage);

    // Check if error message is shown
    expect(screen.getByText('La password attuale non è corretta')).toBeInTheDocument();
  });

  it('should trigger form submission', async () => {
    render(PasswordChangePage);

    // Select form elements
    const currentPasswordInput = screen.getByLabelText('Password attuale');
    const passwordInput = screen.getByLabelText('Nuova password');
    const passwordConfirmInput = screen.getByLabelText('Conferma password');
    const submitButton = screen.getByText('Cambia password');

    // Simulate user typing in inputs
    await fireEvent.input(currentPasswordInput, { target: { value: 'OldPassword123!' } });
    await fireEvent.input(passwordInput, { target: { value: 'NewPassword123!' } });
    await fireEvent.input(passwordConfirmInput, { target: { value: 'NewPassword123!' } });

    // Simulate form submission
    await fireEvent.submit(submitButton);

    // Add assertions depending on your backend's behavior after submission
    // This could be checking if success/error messages appear or specific API calls are made
  });
});
