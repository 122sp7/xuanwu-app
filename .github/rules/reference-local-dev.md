---
title: Local Development Setup
impact: LOW
impactDescription: Gets developers productive quickly
tags: reference, local-dev, setup
---

## Local Development Setup

**Impact: LOW**

Steps to get the development environment running locally.

**Prerequisites:**
- Node.js 24 (see `engines` in `package.json`)
- npm (included with Node.js)
- Firebase CLI: `npx firebase` (no global install needed)

**Setup steps:**

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# Navigate to http://localhost:3000
```

**Common commands:**

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build (includes type-check) |
| `npm run lint` | Run ESLint |
| `npm run start` | Start production server |

**Firebase deployment (when needed):**

```bash
npm run deploy:rules          # Firestore + Storage rules
npm run deploy:functions      # Cloud Functions (Python)
npm run deploy:firebase       # Everything
```

**Key environment files:**
- Firebase config is in `firebase.json`
- App Hosting config is in `apphosting.yaml`
- Firestore rules are in `firestore.rules`
- Storage rules are in `storage.rules`

**Useful tips:**
- The dev server supports Fast Refresh — save a file and see changes instantly
- ESLint will block legacy import paths (`@/shared/*`, `@/infrastructure/*`, etc.) — use `@alias` paths
- TypeScript path aliases are defined in `tsconfig.json` — check there for available `@package` imports
