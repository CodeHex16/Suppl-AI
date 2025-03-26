export interface Message {
	id: string;
	content: string;
	authorId: string;
}

export interface MessageContext {
	sender: string;
	content: string;
}

export interface UserCredentials {
	email: string;
	password: string;
}
