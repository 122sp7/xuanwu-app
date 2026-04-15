/** IdentityEntity — domain entity for a Firebase Auth user session. Zero external dependencies. */
export interface IdentityEntity {
  readonly uid: string;
  readonly email: string | null;
  readonly displayName: string | null;
  readonly photoURL: string | null;
  readonly isAnonymous: boolean;
  readonly emailVerified: boolean;
}

export interface SignInCredentials {
  readonly email: string;
  readonly password: string;
}

export interface RegistrationInput {
  readonly email: string;
  readonly password: string;
  readonly name: string;
}
