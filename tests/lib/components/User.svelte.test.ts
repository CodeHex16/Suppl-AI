import { render, fireEvent } from '@testing-library/svelte';
import { vi } from 'vitest';
import User from '$lib/components/User.svelte';
import { type User as UserType } from '$lib/types';

const fakeUser:UserType = {
	name: 'Mario Rossi',
	email: 'mario@example.com',
	role: 'admin'
};

describe('User', () => {
	it('renders user info', () => {
		const { getByText } = render(User, {
			props: {
				user: fakeUser,
				open: false,
				onToggle: vi.fn(),
				onEdit: vi.fn(),
				onDelete: vi.fn()
			}
		});

		expect(getByText('Mario Rossi')).toBeTruthy();
		expect(getByText('mario@example.com')).toBeTruthy();
		expect(getByText('admin')).toBeTruthy();
	});

	it('calls onToggle when button clicked', async () => {
		const onToggle = vi.fn();
		const { getByLabelText } = render(User, {
			props: {
				user: fakeUser,
				open: false,
				onToggle,
				onEdit: vi.fn(),
				onDelete: vi.fn()
			}
		});

		const toggleBtn = getByLabelText('Apri dettagli Mario Rossi');
		await fireEvent.click(toggleBtn);

		expect(onToggle).toHaveBeenCalledTimes(1);
	});

	it('shows edit and delete when open is true', () => {
		const { getByText } = render(User, {
			props: {
				user: fakeUser,
				open: true,
				onToggle: vi.fn(),
				onEdit: vi.fn(),
				onDelete: vi.fn()
			}
		});

		expect(getByText('Modifica')).toBeTruthy();
		expect(getByText('Elimina')).toBeTruthy();
	});

	it('calls onEdit with user on edit button click', async () => {
		const onEdit = vi.fn();
		const { getByText } = render(User, {
			props: {
				user: fakeUser,
				open: true,
				onToggle: vi.fn(),
				onEdit,
				onDelete: vi.fn()
			}
		});

		await fireEvent.click(getByText('Modifica'));
		expect(onEdit).toHaveBeenCalledWith(fakeUser);
	});

	it('calls onDelete on delete button click', async () => {
		const onDelete = vi.fn();
		const { getByText } = render(User, {
			props: {
				user: fakeUser,
				open: true,
				onToggle: vi.fn(),
				onEdit: vi.fn(),
				onDelete
			}
		});

		await fireEvent.click(getByText('Elimina'));
		expect(onDelete).toHaveBeenCalledTimes(1);
	});
});
