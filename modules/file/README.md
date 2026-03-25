# File Module (Retired)

`modules/file` is a deprecated compatibility bridge.

- Canonical implementation now lives in `modules/asset`.
- New code must import from `@/modules/asset/api` only.
- This module exists only for temporary backward compatibility.

## Public bridge

- `modules/file/index.ts`
- `modules/file/api/index.ts`

Both files re-export from `modules/asset/api`.

## Migration note

If you still import `@/modules/file`, migrate to `@/modules/asset/api`.
After all consumers are migrated and release window closes, this module can be removed.
