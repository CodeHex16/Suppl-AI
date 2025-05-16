import { render, fireEvent } from '@testing-library/svelte';
import { vi } from 'vitest';
import FaqItem from '$lib/components/FaqItem.svelte';
import { abbrWithEllipsis } from '$lib/utils/string';

const mockFaq = {
  id: 1,
  author: 'John Doe',
  creationDate: '2025-05-01T12:00:00Z',
  question: 'What is Svelte?',
  title: 'What is Svelte and how does it work?',
  answer: 'Svelte is a front-end framework that compiles to highly optimized vanilla JS.'
};

describe('FaqItem', () => {

  it('toggles FAQ open/close when toggle button is clicked', async () => {
    const onToggle = vi.fn();
    const { getByLabelText } = render(FaqItem, {
      props: {
        faq: mockFaq,
        open: false,
        onToggle,
        onEdit: vi.fn(),
        onDelete: vi.fn()
      }
    });

    const toggleButton = getByLabelText('Apri dettagli What is Svelte and how does it work?');
    await fireEvent.click(toggleButton);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('shows question and answer when open', () => {
    const { getByText } = render(FaqItem, {
      props: {
        faq: mockFaq,
        open: true,
        onToggle: vi.fn(),
        onEdit: vi.fn(),
        onDelete: vi.fn()
      }
    });

    expect(getByText(mockFaq.title)).toBeTruthy();
    expect(getByText(mockFaq.answer)).toBeTruthy();
  });

  it('calls onEdit when the edit button is clicked', async () => {
    const onEdit = vi.fn();
    const { getByText } = render(FaqItem, {
      props: {
        faq: mockFaq,
        open: true,
        onToggle: vi.fn(),
        onEdit,
        onDelete: vi.fn()
      }
    });

    const editButton = getByText('Modifica');
    await fireEvent.click(editButton);
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(mockFaq); // Ensure the correct FAQ is passed
  });

  it('calls onDelete when the delete button is clicked', async () => {
    const onDelete = vi.fn();
    const { getByText } = render(FaqItem, {
      props: {
        faq: mockFaq,
        open: true,
        onToggle: vi.fn(),
        onEdit: vi.fn(),
        onDelete
      }
    });

    const deleteButton = getByText('Elimina');
    await fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(mockFaq); // Ensure the correct FAQ is passed
  });
});
