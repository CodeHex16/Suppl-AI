import { render, fireEvent } from '@testing-library/svelte';
import UpdateUserModal from '$lib/components/UpdateUserModal.svelte';
import { describe, it, expect, vi } from 'vitest';
import { type User } from '$lib/types';	


describe('UpdateUserModal', () => {
	const mockUser:User = {
		name: 'Mario Rossi',
		email: 'mario@example.com',
		role: 'user',
	};



	// it('calls onSubmitUser with updated data', async () => {
	// 	const onSubmitUser = vi.fn();
	// 	const { getByPlaceholderText, getByTitle } = render(UpdateUserModal, {
	// 		props: {
	// 			user: mockUser,
	// 			onSubmitUser,
	// 			onCancel: vi.fn(),
	// 		},
	// 	});

	// 	const nameInput = getByPlaceholderText('Nome');
	// 	await fireEvent.input(nameInput, { target: { value: 'Luigi Verdi' } });

	// 	const confirmBtn = getByTitle('Conferma');
	// 	await fireEvent.click(confirmBtn);

	// 	expect(onSubmitUser).toHaveBeenCalledWith({
	// 		name: 'Luigi Verdi',
	// 		email: 'mario@example.com',
	// 		role: 'user',
	// 	});
	// });

	it('calls onCancel when Annulla is clicked', async () => {
		const onCancel = vi.fn();
		const { getByTitle } = render(UpdateUserModal, {
			props: {
				user: mockUser,
				onSubmitUser: vi.fn(),
				onCancel,
			},
		});

		const cancelBtn = getByTitle('Annulla');
		await fireEvent.click(cancelBtn);

		expect(onCancel).toHaveBeenCalled();
	});
});
