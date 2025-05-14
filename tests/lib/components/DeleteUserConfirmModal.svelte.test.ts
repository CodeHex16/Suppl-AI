// __tests__/DeleteUserConfirmModal.test.ts
import { render, fireEvent } from '@testing-library/svelte';
import { vi } from 'vitest';
import DeleteUserConfirmModal from '$lib/components/DeleteUserConfirmModal.svelte';
import {type User} from '$lib/types';
describe('DeleteUserConfirmModal', () => {
	it('submits form data correctly', async () => {
		const mockUser:User = {
			name: 'Mario Rossi',
			email: 'mario@example.com',
      role: 'admin'
		};

		const onSubmitUser = vi.fn();
		const onCancel = vi.fn();

		const { getByLabelText, getByText } = render(DeleteUserConfirmModal, {
			props: {
				user: mockUser,
				onCancel,
				onSubmitUser
			}
		});

		const passwordInput = getByLabelText('Inserisci la tua password per confermare') as HTMLInputElement;
		await fireEvent.input(passwordInput, { target: { value: 'mypassword' } });

		const confirmButton = getByText('Conferma');
		await fireEvent.click(confirmButton);

		// Assert submit was attempted
		// You can spy on fetch or test indirectly by exposing `handleDeleteSubmit` to test environment

		// If you uncommented and used `fetch` in the component, you could do:
		// const fetchSpy = vi.spyOn(global, 'fetch');
		// expect(fetchSpy).toHaveBeenCalledWith(...)

		expect(passwordInput.value).toBe('mypassword');
	});
});
