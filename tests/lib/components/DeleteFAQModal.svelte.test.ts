import { render, fireEvent, waitFor } from '@testing-library/svelte';
import DeleteFaqModal from '$lib/components/DeleteFAQModal.svelte';
import { describe, it, expect, vi } from 'vitest';
import { type Faq } from '$lib/types';

describe('DeleteFaqModal component', () => {
	it('submits the form with correct data', async () => {
		const mockSubmit = vi.fn((formData: FormData) => {
      // Mock implementation of the submit function
      return new Promise((resolve) => {
        resolve(formData);
      });
    });
		const mockCancel = vi.fn();

		const faq: Faq = {
      _id: 12345,
      id: 12345,
      author: 'hi',
      creationDate: '2023-10-01T00:00:00Z',
      question: 'What is Svelte?',
      title: 'Svelte',
      answer: 'Svelte is a modern JavaScript framework for building user interfaces.'
    }

		const { getByText, getByLabelText } = render(DeleteFaqModal, {
			props: {
				faq,
				onSubmitFaq: mockSubmit as unknown as (formData: FormData) => Promise<void>,
				onCancel: mockCancel
			}
		});

		// Fill the password input
		const passwordInput = getByLabelText('Inserisci la tua password per confermare') as HTMLInputElement;
		await fireEvent.input(passwordInput, { target: { value: 'mypassword' } });

		// Submit the form
		const submitButton = getByText('Conferma');
		await fireEvent.click(submitButton);

		// Assert mockSubmit was called with correct FormData
		await waitFor(() => {
			expect(mockSubmit).toHaveBeenCalledTimes(1);
		});


		expect(mockSubmit).toHaveBeenCalledWith(expect.any(FormData));
    const formData = mockSubmit.mock.calls[0][0];
    expect(formData.get('current_password')).toBe('mypassword');
    expect(formData.get('id')).toBe(faq._id?.toString());
	});
});
