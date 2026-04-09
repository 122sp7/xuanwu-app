<!-- Purpose: Subdomain scaffold overview for platform 'identity'. -->

## Overview

The **identity** subdomain is responsible for authenticating and identifying human and service actors within Xuanwu. It establishes trust in who is requesting an action and provides cryptographic evidence of identity.

### Core Responsibility

- Authentication signal capture (credentials, tokens, sessions)
- Identity verification and trust establishment
- Actor type classification (human user, service principal, API client)
- Cryptographic identity artifacts (keys, certificates, tokens)

### Key Aggregates

- **AuthenticationSession** — authenticated user context with token lifecycle
- **Actor** — authenticated principal (human or service)
- **IdentityProvider** — federated identity source (Google, GitHub, custom)

### Domain Events

- `ActorAuthenticated` — Actor passed credential verification
- `SessionInitialized` — New authenticated session created
- `SessionRevoked` — Session invalidated or expired
- `IdentityProviderVerified` — External identity source confirmed

### Cross-Subdomain Contracts

- **→ account**: provides authenticated Actor with identity signals
- **→ organization**: supplies actor identity for membership & roles
- **← access-control**: consumes Actor context for permission gates
- **← platform-config**: reads authentication policy rules

### Repository Interfaces

- `IAuthenticationSessionRepository` — session persistence contract
- `IActorRepository` — actor identity storage contract
- `IIdentityProviderRepository` — IdP metadata persistence contract

### Technology Stack

- Firebase Authentication (credential verification, token issuance)
- Session storage (Firestore + memory cache)
- JWT token validation (Firebase ID tokens)
