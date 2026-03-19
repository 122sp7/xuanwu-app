# Commands And Checks

**Verified from `package.json`:** 2026-03-19

## Install
- `npm install`

## Development
- `npm run dev`

## Build and start
- `npm run build`
- `npm run start`

## Lint
- `npm run lint`

## Firebase deploy commands
- `npm run deploy:firestore:indexes`
- `npm run deploy:firestore:rules`
- `npm run deploy:storage:rules`
- `npm run deploy:rules`
- `npm run deploy:apphosting`
- `npm run deploy:functions`
- `npm run deploy:functions:python`
- `npm run deploy:functions:all`
- `npm run deploy:firebase`

## Repomix / skill generation
- `npm run repomix:skill`
- `npm run repomix:remote`
- `npm run repomix:remote:vscode-docs`

## Validation guidance for this branch
- There is no `typecheck` script in `package.json`.
- There is no `test` script in `package.json`.
- There is no `check` script in `package.json`.
- Preferred repo-level validation is `npm run lint` or `npm run build`.

## Notes
- `deploy:functions` and `deploy:functions:python` both target `functions:functions-python`.
- If new validation scripts are added later, update this memory and the index.
