import { render, fireEvent } from '@testing-library/svelte';
import { vi } from 'vitest';
import Document from '$lib/components/Document.svelte';
import { parseDate } from '$lib/utils/date'; // Assuming parseDate is a utility function
const mockDocument = {
  _id: 'doc1',
  title: 'Test Document',
  file_path: '/docs/test.pdf',
  owner_email: 'user@example.com',
  uploaded_at: '2025-05-01T12:00:00Z'
};

describe('Document', () => {
  it('renders document title and date when collapsed', () => {
    const { getByText, queryByText } = render(Document, {
      props: {
        document: mockDocument,
        open: false,
        onToggle: vi.fn(),
        onDelete: vi.fn()
      }
    });

    expect(getByText('Test Document')).toBeTruthy();
    expect(getByText(parseDate(mockDocument.uploaded_at))).toBeTruthy(); // Assumes parseDate formats to "1 mag 2025"
    expect(queryByText('Elimina')).toBeNull(); // Not shown when closed
  });

  it('calls onToggle when toggle button is clicked', async () => {
    const onToggle = vi.fn();
    const { getByLabelText } = render(Document, {
      props: {
        document: mockDocument,
        open: false,
        onToggle,
        onDelete: vi.fn()
      }
    });

    const toggleButton = getByLabelText('Apri dettagli Test Document');
    await fireEvent.click(toggleButton);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('shows extra info and calls onDelete when open and Elimina is clicked', async () => {
    const onDelete = vi.fn();
    const { getByText } = render(Document, {
      props: {
        document: mockDocument,
        open: true,
        onToggle: vi.fn(),
        onDelete
      }
    });

    expect(getByText('Caricato da:')).toBeTruthy();
    expect(getByText('user@example.com')).toBeTruthy();

    const deleteButton = getByText('Elimina');
    await fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
