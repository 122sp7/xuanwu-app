# py_fn Notes

## Current Runtime

This runtime currently uses Firebase Functions + Upstash Vector/Redis/QStash for the wiki-beta RAG path.

## Future: Upstash Workflow

When we move to a workflow-orchestrated pipeline (multi-step, retryable, long-running tasks), install these packages:

```bash
pip install fastapi uvicorn upstash-workflow
```

Use this only when workflow endpoints are actually introduced.

## Why Not Install Now

- Keep dependencies minimal (Occam's razor).
- Avoid unused runtime surface in Firebase Functions.
- Add only when workflow serve endpoints are implemented.
