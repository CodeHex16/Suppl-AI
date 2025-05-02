import type { Faq } from '$lib/types';

export const load = async (data) => {
    const faqs: Faq[] = [
        {
            id: 1,
            author: "Mario Rossi",
            creationDate: "2025-01-12",
            question: 'Quali sono tutti i prodotti disponibili?',
            title: 'Elenco prodotti',
            answer: 'Risposta 1'
        },
        {
            id: 2,
            author: "Luca Bianchi",
            creationDate: "2025-01-12",
            question: 'Domanda completa 2',
            title: 'Domanda abbreviata 2',
            answer: 'Risposta 3'
        },
        {
            id: 3,
            author: "Mario Rossi",
            creationDate: "2025-01-12",
            question: 'Domanda completa 3',
            title: 'Domanda abbreviata 3',
            answer: 'Risposta 3'
        }
    ];

    return {
        faqs: faqs
    };
};