// authentication — domain layer
// Owns authentication flows: sign-in, sign-up, sign-out, password reset.
// Firebase Auth is the external adapter; this layer defines the port contracts.

export interface AuthenticationPort {
  signInWithEmail(email: string, password: string): Promise<{ uid: string; idToken: string }>;
  signOut(uid: string): Promise<void>;
  sendPasswordResetEmail(email: string): Promise<void>;
}

export interface AuthCredential {
  readonly uid: string;
  readonly email: string | null;
  readonly idToken: string;
  readonly expiresAt: string;
}

export interface AuthenticationDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: "iam.authentication.signed_in" | "iam.authentication.signed_out";
  readonly payload: { readonly uid: string };
}
