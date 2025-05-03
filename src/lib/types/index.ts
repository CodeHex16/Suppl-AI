export interface Message {
	id: string;
	content: string;
	authorId: string;
}

export interface User {
	email: string,
	name: string,
	role: string,
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
	title: string;
	answer: string;
}

export interface MessageContext {
	sender: string;
	content: string;
}

export interface UserCredentials {
	email: string;
	password: string;
}

export interface ImportMetaEnv {
	readonly VITE_PRIMARY_COLOR: string;
	readonly VITE_PRIMARY_HOVER_COLOR: string;
	readonly VITE_PRIMARY_TEXT_COLOR: string;
  }
  
export interface ImportMeta {
	readonly env: ImportMetaEnv;
  }