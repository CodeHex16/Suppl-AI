import { render, fireEvent, screen } from '@testing-library/svelte';
import { expect, vi } from 'vitest';
import NewFAQModal from '$lib/components/NewFAQModal.svelte';

// Mock the props
const onSubmitFaq = vi.fn();
const onCancel = vi.fn();

describe('NewFAQModal Component', () => {
  it('should submit form with correct values', async () => {
    // Render the component with props
    render(NewFAQModal, { props: { onSubmitFaq, onCancel } });

    // Fill in the form fields
    const titleInput = screen.getByPlaceholderText('Titolo FAQ');
    const questionTextarea = screen.getByPlaceholderText('Domanda completa');
    const answerTextarea = screen.getByPlaceholderText('Risposta');

    await fireEvent.input(titleInput, { target: { value: 'FAQ Title' } });
    await fireEvent.input(questionTextarea, { target: { value: 'What is Svelte?' } });
    await fireEvent.input(answerTextarea, { target: { value: 'Svelte is a JavaScript framework.' } });

    // Find the submit button and click it
    const submitButton = screen.getByText('Aggiungi');
    await fireEvent.click(submitButton);

    // Assert that onSubmitFaq was called with the correct values
    expect(onSubmitFaq).toHaveBeenCalledWith({
      title: 'FAQ Title',
      question: 'What is Svelte?',
      answer: 'Svelte is a JavaScript framework.',
      creationDate: expect.any(String), // We expect a valid date string
    });
  });

  it('should call onCancel when cancel button is clicked', async () => {
    // Render the component
    render(NewFAQModal, { props: { onSubmitFaq, onCancel } });

    // Find the cancel button and click it
    const cancelButton = screen.getByText('Annulla');
    await fireEvent.click(cancelButton);

    // Assert that onCancel was called
    expect(onCancel).toHaveBeenCalled();
  });

  it('should show an alert if required fields are empty', async () => {
    // Mock the alert function
    const alertMock = vi.fn();
    global.alert = alertMock;

    // Render the component
    render(NewFAQModal, { props: { onSubmitFaq, onCancel } });

    // Find the submit button and click it without filling the form
    const submitButton = screen.getByText('Aggiungi');
    await fireEvent.click(submitButton);

    // Assert that alert was called due to missing fields
    expect(alertMock).toHaveBeenCalledWith('Compila tutti i campi');
  });
});
