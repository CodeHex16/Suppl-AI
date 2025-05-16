import { render, fireEvent, screen } from '@testing-library/svelte';
import { expect, vi } from 'vitest';
import NewUserModal from '$lib/components/NewUserModal.svelte';
// Mock the props
const onSubmitUser = vi.fn();
const onCancel = vi.fn();

describe('NewUserModal Component', () => {
  it('should render the form with correct fields', () => {
    render(NewUserModal, { props: { onSubmitUser, onCancel } });

    // Check if the input fields are rendered
    expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByText('Seleziona un ruolo')).toBeInTheDocument();
  });

  it('should update input values when the user types', async () => {
    render(NewUserModal, { props: { onSubmitUser, onCancel } });

    // Simulate user input for name, email, and role
    const nameInput = screen.getByPlaceholderText('Nome') as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
    const roleSelect = screen.getByText('Seleziona un ruolo').parentElement as HTMLSelectElement;

    await fireEvent.input(nameInput, { target: { value: 'John Doe' } });
    await fireEvent.input(emailInput, { target: { value: 'john@example.com' } });
    await fireEvent.change(roleSelect, { target: { value: 'admin' } });

    // Verify if the values are updated
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(roleSelect.value).toBe('admin');
  });

  it('should call onSubmitUser with correct values when the form is submitted', async () => {
    render(NewUserModal, { props: { onSubmitUser, onCancel } });

    // Fill out the form
    const nameInput = screen.getByPlaceholderText('Nome');
    const emailInput = screen.getByPlaceholderText('Email');
    const roleSelect = screen.getByText('Seleziona un ruolo').parentElement as HTMLSelectElement;
    const submitButton = screen.getByText('Salva');

    await fireEvent.input(nameInput, { target: { value: 'John Doe' } });
    await fireEvent.input(emailInput, { target: { value: 'john@example.com' } });
    await fireEvent.change(roleSelect, { target: { value: 'admin' } });

    // Submit the form
    await fireEvent.click(submitButton);

    // Assert that the onSubmitUser callback was called with correct values
    expect(onSubmitUser).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
    });
  });

  it('should call onCancel when the cancel button is clicked', async () => {
    render(NewUserModal, { props: { onSubmitUser, onCancel } });

    // Find the cancel button and click it
    const cancelButton = screen.getByText('Annulla');
    await fireEvent.click(cancelButton);

    // Assert that onCancel was called
    expect(onCancel).toHaveBeenCalled();
  });
});
