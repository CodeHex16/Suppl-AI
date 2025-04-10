import type { Faq } from '$lib/types';

export const load = async (data) => {
    const faqs: Faq[] = [
        {
            id: 1,
            author: "Mario Rossi",
            creationDate: "2025-01-12",
            question: 'Quali sono tutti i prodotti disponibili?',
            abbr: 'Elenco prodotti'
        },
        {
            id: 2,
            author: "Luca Bianchi",
            creationDate: "2025-01-12",
            question: 'Domanda completa 2',
            abbr: 'Domanda abbreviata 2'
        },
        {
            id: 3,
            author: "Mario Rossi",
            creationDate: "2025-01-12",
            question: 'Domanda completa 3',
            abbr: 'Domanda abbreviata 3'
        }
    ];

    return {
        faqs: faqs
    };
};