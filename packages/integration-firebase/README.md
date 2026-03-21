# integration-firebase

## Purpose

Unified Firebase SDK integration package. Provides a single import path for all Firebase services used in the application, abstracting the underlying SDK initialization and lazy-loading patterns.

## Belongs to Module

Infrastructure — used by all modules that need Firebase persistence, auth, or platform services.

## Public API

### App Instances

| Export | Description |
|--------|-------------|
| `firebaseClientApp` | Initialized Firebase client `FirebaseApp` instance |
| `firebaseAdminConfig` | Firebase Admin SDK configuration object |

### Authentication

| Export | Description |
|--------|-------------|
| `getFirebaseAuth()` | Get/initialize the Auth instance |
| `onFirebaseAuthStateChanged(auth, cb)` | Subscribe to auth state changes |
| `signOutFirebase(auth)` | Sign out the current user |
| `User` | Firebase `User` type |

### Firestore

| Export | Description |
|--------|-------------|
| `getFirebaseFirestore()` | Get/initialize the Firestore instance |
| `firestoreApi` | Low-level Firestore API helpers |
| `Firestore` | Firestore type |

### Storage, Functions, Messaging, etc.

See `index.ts` for the full export list.

## Dependencies

- `firebase` (client SDK)
- `libs/firebase/*` — internal SDK wrappers (do not import directly)

## Example

```typescript
import { getFirebaseFirestore, getFirebaseAuth } from "@integration-firebase";

const db = getFirebaseFirestore();
const auth = getFirebaseAuth();
```

## Rules

- Do not import `libs/firebase/*` directly — always use `@integration-firebase`
- Do not use in domain or application layers (only in infrastructure adapters)
- Server Components must use Admin SDK — never expose client SDK to server
