import type { FederatedIdentity, FederationPort, FederationProvider } from "../../domain/index";

export class LinkProviderUseCase {
  constructor(private readonly federationPort: FederationPort) {}

  async execute(input: {
    uid: string;
    provider: FederationProvider;
    idToken: string;
  }): Promise<void> {
    await this.federationPort.linkProvider(input.uid, input.provider, input.idToken);
  }
}

export class UnlinkProviderUseCase {
  constructor(private readonly federationPort: FederationPort) {}

  async execute(input: { uid: string; provider: FederationProvider }): Promise<void> {
    await this.federationPort.unlinkProvider(input.uid, input.provider);
  }
}

export class GetLinkedProvidersUseCase {
  constructor(private readonly federationPort: FederationPort) {}

  async execute(input: { uid: string }): Promise<FederatedIdentity[]> {
    return this.federationPort.getLinkedProviders(input.uid);
  }
}
