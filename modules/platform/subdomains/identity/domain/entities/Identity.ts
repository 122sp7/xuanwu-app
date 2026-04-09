/**
 * Identity Domain Entity — represents an authenticated user session.
 * Zero external dependencies.
 */
export interface IdentityEntity {
	readonly uid: string;
	readonly email: string | null;
	readonly displayName: string | null;
	readonly photoURL: string | null;
	readonly isAnonymous: boolean;
	readonly emailVerified: boolean;
}

/** Value Object — credentials for sign-in */
export interface SignInCredentials {
	readonly email: string;
	readonly password: string;
}

/** Value Object — registration input */
export interface RegistrationInput {
	readonly email: string;
	readonly password: string;
	readonly name: string;
}
