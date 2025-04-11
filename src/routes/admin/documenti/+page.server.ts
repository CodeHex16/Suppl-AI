import type { Document } from '$lib/types';

export const load = async (data) => {
    const documents: Document[] = [
        {
            id: 1,
            name: "formaggi.txt",
            author: "Mario Rossi",
            creationDate: '2025-01-12'
        },
        {
            id: 2,
            name: "marmellata_di_fichi.pdf",
            author: "Luca Bianchi",
            creationDate: '2025-02-12'
        },
        {
            id: 3,
            name: "index.txt",
            author: "Mario Rossi",
            creationDate: '2025-02-29'
        }
    ];


    return {
        documents: documents
    };
};