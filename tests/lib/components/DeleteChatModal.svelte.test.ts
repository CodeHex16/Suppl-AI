import { render, fireEvent, waitFor } from '@testing-library/svelte';
import DeleteChatModal from '$lib/components/DeleteChatModal.svelte';
import { vi, type Mock } from 'vitest';


describe('DeleteChatModal', () => {
	it('submits the form and calls onCancel + navigates on success', async () => {
		const mockOnCancel = vi.fn();

		// mock fetch to return OK
		global.fetch = vi.fn(() =>
			Promise.resolve({
				ok: true,
				text: () => Promise.resolve('OK'),
			})
		) as Mock;

		// mock $app/navigation
		vi.mock('$app/navigation', async () => {
			return {
				goto: vi.fn(),
				invalidateAll: vi.fn(() => Promise.resolve()),
			};
		});

		const { getByTestId } = render(DeleteChatModal, {
			props: {
				chatName: 'Test Chat',
				chatId: '123',
				onCancel: mockOnCancel,
			},
		});

		const form = getByTestId('delete-chat-form');
		
		await fireEvent.submit(form);

		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledWith('/?/deleteChat', expect.anything());
			expect(mockOnCancel).toHaveBeenCalled();
		});
	});

  it('closes the modal when cancel button is clicked', async () => {
    const mockOnCancel = vi.fn();

    const { getByRole } = render(DeleteChatModal, {
      props: {
        chatName: 'Test Chat',
        chatId: '123',
        onCancel: mockOnCancel,
      },
    });

    const cancelButton = getByRole('button', { name: 'Cancel' });

    await fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('submits the form with error', async () => {
    const mockOnCancel = vi.fn();
    const mockFetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve('Error'),
      })
    );
    const mockAlert = vi.fn();
    global.alert = mockAlert as unknown as typeof global.alert;
    global.fetch = mockFetch as Mock;
    const { getByTestId } = render(DeleteChatModal, {
      props: {
        chatName: 'Test Chat',
        chatId: '123',
        onCancel: mockOnCancel,
      },
    });
    const form = getByTestId('delete-chat-form');
   
    await fireEvent.submit(form);
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/?/deleteChat', expect.anything());
      expect(mockOnCancel).not.toHaveBeenCalled();
      expect(mockAlert).toHaveBeenCalled();
    }
    );
  });
});
