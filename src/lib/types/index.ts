export interface Message {
	id?: string;
	_id?: string; // TODO: BotMessage NEED
	content: string;
	authorId?: string;
	sender: string;
	isLoading?: boolean;
	timestamp?: string;
	rating?: boolean | null;
}

export type UserRole = string | 'admin' | 'user';
export interface User {
	id?: string; // TODO: router/admin/clienti need
	_id?: string;
	email: string,
	name: string,
	role: UserRole,
	scopes?: string[],

	admin_password?: string, // For UpdateUser\
	email_old?: string, // For UpdateUser
}

export type Document = {
	_id: string;
	title: string;
	file_path: string;
	owner_email: string;
	uploaded_at: string;
}

export interface Faq {
	id?: number;
	_id?: number; // TODO: DELETEFAQMODEL NEED
	author?: string;
	creationDate?: string;
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

export interface Chat {
  id?: string;
  name: string;
  created_at?: string;
	messages: Message[];
};