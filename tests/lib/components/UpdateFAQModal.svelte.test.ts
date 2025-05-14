import { render, fireEvent } from '@testing-library/svelte';
import UpdateFaqModal from '$lib/components/UpdateFAQModal.svelte';
import { describe, it, expect, vi } from 'vitest';
import type { Faq } from '$lib/types';

describe('UpdateFaqModal', () => {
  const mockFaq: Faq = {
    _id: 123,
    title: 'FAQ title',
    question: 'What is this?',
    answer: 'This is a FAQ item.',
  };

  it('should show initial values from faq', () => {
    const { getByPlaceholderText } = render(UpdateFaqModal, {
      props: {
        faq: mockFaq,
        onSubmitFaq: vi.fn(),
        onCancel: vi.fn(),
      },
    });

    expect(getByPlaceholderText('Titolo FAQ')).toHaveValue('FAQ title');
    expect(getByPlaceholderText('Domanda completa')).toHaveValue('What is this?');
    expect(getByPlaceholderText('Risposta')).toHaveValue('This is a FAQ item.');
  });

  it('calls onSubmitFaq with updated values', async () => {
    const onSubmitFaq = vi.fn();

    const { getByText, getByPlaceholderText } = render(UpdateFaqModal, {
      props: {
        faq: mockFaq,
        onSubmitFaq,
        onCancel: vi.fn(),
      },
    });

    // Change the title
    const titleInput = getByPlaceholderText('Titolo FAQ');
    await fireEvent.input(titleInput, { target: { value: 'Updated title' } });

    // Click Modifica
    const submitButton = getByText('Modifica');
    await fireEvent.click(submitButton);

    expect(onSubmitFaq).toHaveBeenCalledWith({
      id: 123,
      title: 'Updated title',
      question: 'What is this?',
      answer: 'This is a FAQ item.',
    });
  });

  it('calls onCancel when clicking Annulla', async () => {
    const onCancel = vi.fn();

    const { getByText } = render(UpdateFaqModal, {
      props: {
        faq: mockFaq,
        onSubmitFaq: vi.fn(),
        onCancel,
      },
    });

    await fireEvent.click(getByText('Annulla'));
    expect(onCancel).toHaveBeenCalled();
  });
});
