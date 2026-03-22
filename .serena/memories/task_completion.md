Before finishing a coding task:
- Run `npm run lint`.
- Run `npm run build` when change can affect runtime/build boundaries.
- Verify module boundaries/import rules still hold.
- If architecture/public contract/runtime ownership changed, update related docs/README/ADR.
- Do not include unrelated fixes in the same change unless requested.