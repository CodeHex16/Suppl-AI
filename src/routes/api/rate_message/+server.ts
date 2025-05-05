import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

const DATABASE_URL = env.PUBLIC_DATABASE_URL;

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const req = await request.json();
        const token = cookies.get('token');

        if (!token) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Aggiorna la valutazione del messaggio del bot nel database
        console.log('making request to', `http://${DATABASE_URL}/chats/${req.chat_id}/messages/${req.message_id}/rating`);
        const response = await fetch(`http://${DATABASE_URL}/chats/${req.chat_id}/messages/${req.message_id}/rating`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                rating: req.rating
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return json(
                { error: 'Failed to update rating', details: errorData },
                { status: response.status }
            );
        }

        return json({ success: true });
    } catch (error) {
        console.error('Errore durante l\'aggiornamento del rating:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};
