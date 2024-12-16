import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Message } from '$lib/types';


/**
 * @description Store for the current messages that is used to
 * display the messages between users in real time.
 */
export const messagesStore: Writable<Message[]> = writable([]);