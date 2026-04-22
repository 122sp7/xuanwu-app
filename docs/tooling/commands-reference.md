# Build, Lint & Development Commands

## Development

- `npm run dev` — Start Next.js development server (App Router, port 3000)
- `npm run build` — Production build (Next.js + TypeScript type-check)
- `npm run start` — Start production server from build output

## Lint & Type Check

- `npm run lint` — Run ESLint (flat config, `eslint.config.mjs`)
- `npm run lint:markdown` — Run repo-wide Markdown linting (`.markdownlint-cli2.jsonc`)
- `npm run test` — Run Vitest unit tests
- TypeScript type-checking is included in `npm run build`

## Firebase Deployment

- `npm run deploy:firebase` — Deploy all Firebase resources
- `npm run deploy:firestore:indexes` — Deploy Firestore indexes only
- `npm run deploy:firestore:rules` — Deploy Firestore security rules only
- `npm run deploy:storage:rules` — Deploy Storage security rules only
- `npm run deploy:rules` — Deploy Firestore rules + Storage rules
- `npm run deploy:apphosting` — Deploy App Hosting configuration
- `npm run deploy:functions` — Deploy Cloud Functions (Python)
- `npm run deploy:functions:fn` — Deploy the `fn` Cloud Functions target
- `npm run deploy:functions:all` — Deploy all Cloud Functions

## Repomix (AI Skill Generation)

- `npm run repomix:all` — Generate all configured repomix skills in sequence
- `npm run repomix:skill` — Generate a repomix skill from the full codebase
- `npm run repomix:ai` — Generate the AI-focused skill (`xuanwu-ai-skill`)
- `npm run repomix:analytics` — Generate the analytics-focused skill (`xuanwu-analytics-skill`)
- `npm run repomix:billing` — Generate the billing-focused skill (`xuanwu-billing-skill`)
- `npm run repomix:iam` — Generate the IAM-focused skill (`xuanwu-iam-skill`)
- `npm run repomix:platform` — Generate the platform-focused skill (`xuanwu-platform-skill`)
- `npm run repomix:src` — Generate the src-focused skill (`xuanwu-src-skill`)
- `npm run repomix:fn` — Generate the Cloud Functions-focused skill (`xuanwu-fn-skill`)
- `npm run repomix:packages` — Generate the packages-focused skill (`xuanwu-packages-skill`)
- `npm run repomix:markdown` — Generate the markdown-only skill (`xuanwu-markdown-skill`)
- `npm run repomix:notebooklm` — Generate the notebooklm-focused skill (`xuanwu-notebooklm-skill`)
- `npm run repomix:notion` — Generate the notion-focused skill (`xuanwu-notion-skill`)
- `npm run repomix:workspace` — Generate the workspace-focused skill (`xuanwu-workspace-skill`)
- `npm run repomix:explore` — Run repomix with `repomix.config.json` for direct exploration output
- `npm run repomix:remote` — Generate a skill from a remote GitHub repository
- `npm run repomix:local` — Generate a skill from a local directory

## Key Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js 16 App Router configuration |
| `tsconfig.json` | TypeScript config with `@alias` path mappings |
| `eslint.config.mjs` | ESLint flat config with package boundary enforcement |
| `.markdownlint-cli2.jsonc` | Repo-wide Markdown lint configuration |
| `tailwind.config.ts` | Tailwind CSS 4 configuration |
| `firebase.json` | Firebase project configuration |
| `firestore.rules` | Firestore security rules |
| `firestore.indexes.json` | Firestore composite indexes |
| `storage.rules` | Cloud Storage security rules |
| `components.json` | shadcn CLI configuration (aliases → `@ui-shadcn/*`) |
| `apphosting.yaml` | Firebase App Hosting configuration |

## Environment Setup

- **Node.js**: Version 24 required (see `engines` in `package.json`)
- **Package manager**: npm
- Install dependencies: `npm install`
- Python test dependencies: `python -m pip install -r fn/requirements-dev.txt`
- Firebase CLI: `npx firebase` (no global install required)
