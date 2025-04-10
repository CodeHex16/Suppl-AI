export interface Message {
	id: string;
	content: string;
	authorId: string;
}

export interface User {
	id: number,
	name: string,
	role: string,
	creationDate: string,
	email: string
}

export interface Document {
	id: number;
	name: string;
	author: string;
	creationDate: string
}

export interface Faq {
	id: number;
	author: string;
	creationDate: string;
	question: string;
	abbr: string;
}

export interface MessageContext {
	sender: string;
	content: string;
}

export interface UserCredentials {
	email: string;
	password: string;
}
