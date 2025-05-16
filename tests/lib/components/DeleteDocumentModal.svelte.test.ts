import { render, fireEvent } from '@testing-library/svelte';
import DeleteDocumentModal from '$lib/components/DeleteDocumentModal.svelte';
import { vi, describe, it, expect} from 'vitest';
import { type Document } from '$lib/types';

describe('DeleteDocumentModal', () => {
	const mockDocument: Document = {
		_id: 'abc123',
		title: 'Test Document',
    file_path: '/path/to/document',
    owner_email: 'hi@hi.com',
    uploaded_at: '2023-10-01T00:00:00Z'
	};

	it('renders with the correct title', () => {
		const { getByText } = render(DeleteDocumentModal, {
			props: {
				document: mockDocument,
				onConfirmDelete: vi.fn(),
				onCancel: vi.fn()
			}
		});

		expect(getByText(/Test Document/)).toBeInTheDocument();
	});

	it('calls onCancel when "Annulla" button is clicked', async () => {
		const onCancel = vi.fn();

		const { getByRole } = render(DeleteDocumentModal, {
			props: {
				document: mockDocument,
				onConfirmDelete: vi.fn(),
				onCancel
			}
		});

		const cancelButton = getByRole('button', { name: 'Cancel' });
		await fireEvent.click(cancelButton);

		expect(onCancel).toHaveBeenCalled();
	});

});
