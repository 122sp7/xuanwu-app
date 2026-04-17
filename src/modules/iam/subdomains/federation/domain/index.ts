// federation — domain layer
// Owns external IdP (OAuth / SAML) identity federation flows.

export type FederationProvider = "google" | "github" | "microsoft" | "saml";

export interface FederatedIdentity {
  readonly uid: string;
  readonly provider: FederationProvider;
  readonly externalId: string;
  readonly email: string | null;
  readonly linkedAtISO: string;
}

export interface FederationPort {
  linkProvider(uid: string, provider: FederationProvider, idToken: string): Promise<void>;
  unlinkProvider(uid: string, provider: FederationProvider): Promise<void>;
  getLinkedProviders(uid: string): Promise<FederatedIdentity[]>;
}
