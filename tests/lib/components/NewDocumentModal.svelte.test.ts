import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import { vi, type Mock } from 'vitest';
import NewDocumentModal from '$lib/components/NewDocumentModal.svelte';

global.fetch = vi.fn();

describe('Form Component', () => {
	let mockOnSubmitDocument: Mock;
	let mockOnCancel: Mock;

	beforeEach(() => {
		// Mock the onSubmitDocument and onCancel props
		mockOnSubmitDocument = vi.fn();
		mockOnCancel = vi.fn();
	});

	it('renders form with file input and buttons', () => {
		render(NewDocumentModal, {
			props: { onSubmitDocument: mockOnSubmitDocument, onCancel: mockOnCancel }
		});

		// Check if the file input and buttons are rendered
		expect(screen.getByLabelText('Seleziona uno o più file')).toBeInTheDocument();
		expect(screen.getByText('Annulla')).toBeInTheDocument();
		expect(screen.getByText('Carica')).toBeInTheDocument();
	});

	it('displays loading spinner during file upload', async () => {
		render(NewDocumentModal, {
			props: { onSubmitDocument: mockOnSubmitDocument, onCancel: mockOnCancel }
		});

    // moke fetch  with a delay
    global.fetch = vi.fn(() =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            statusText: 'OK'
          });
        }, 3000);
      })
    ) as unknown as typeof fetch;
		// Simulate file selection and form submission
		const input = screen.getByTestId('file-input')  as HTMLInputElement;
		const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
    const file2 = new File(['file content 00'], 'test2.txt', { type: 'text/plain' });
    // Simulate the file selection by firing a change event
    await fireEvent.change(input, {
      target: { files: [file, file2] }
    });
    Object.defineProperty(input, 'files', {
      value: [file, file2],
      writable: false,  // Ensure files property is not overwritten
    });
		const form = screen.getByTestId('upload-form');;
		await fireEvent.submit(form);
    console.log('Files in input:', input.files);  // Should log the two File objects

		// Check if loading spinner appears
		expect(screen.getByRole('status')).toBeInTheDocument();
    expect(input.files?.length).toBe(2);  // Should have 2 files
    expect(input.files?.[0]).toBe(file); // The first file should be 'file'
    expect(input.files?.[1]).toBe(file2); // The second file should be 'file2'
	});

	it('calls onSubmitDocument on successful form submission', async () => {
		// Mock successful fetch response
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			statusText: 'OK'
		});

		render(NewDocumentModal, {
			props: { onSubmitDocument: mockOnSubmitDocument, onCancel: mockOnCancel }
		});

		const input = screen.getByLabelText('Seleziona uno o più file');
		const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
		await fireEvent.change(input, { target: { files: [file] } });

		const form = screen.getByTestId('upload-form');;
		await fireEvent.submit(form);

		// Wait for onSubmitDocument to be called
		await waitFor(() => expect(mockOnSubmitDocument).toHaveBeenCalled());
	});

	it('displays error message on failed form submission', async () => {
		// Mock failed fetch response
		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
			statusText: 'Server Error'
		});

		render(NewDocumentModal, {
			props: { onSubmitDocument: mockOnSubmitDocument, onCancel: mockOnCancel }
		});

		const input = screen.getByLabelText('Seleziona uno o più file');
		const file = new File(['file content'], 'test.txt', { type: 'text/plain' });
		await fireEvent.change(input, { target: { files: [file] } });

		const form = screen.getByTestId('upload-form');
		await fireEvent.submit(form);

		// Check if the error message is displayed
		await waitFor(() => expect(screen.getByText('Si è verificato un errore durante il caricamento del file.')).toBeInTheDocument());
	});

	it('calls onCancel when cancel button is clicked', async () => {
		render(NewDocumentModal, {
			props: { onSubmitDocument: mockOnSubmitDocument, onCancel: mockOnCancel }
		});

		const cancelButton = screen.getByText('Annulla');
		await fireEvent.click(cancelButton);

		// Ensure onCancel was called
		expect(mockOnCancel).toHaveBeenCalled();
	});
});
