# Commands And Checks

Install:
- npm install

Development:
- npm run dev

Build and start:
- npm run build
- npm run start

Lint:
- npm run lint

Validation guidance for this snapshot:
- There is no package.json script for typecheck.
- There is no package.json script for test.
- There is no package.json script for check.
- When validating a change, prefer lint or a targeted build unless new scripts are added.

Environment note:
- Firebase web env vars are expected via NEXT_PUBLIC_FIREBASE_* keys.
- The client currently contains hardcoded fallbacks for Firebase config when env vars are missing.
