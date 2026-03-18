# Firebase Functions (Python)

This codebase is configured as `functions-python` in `firebase.json` with runtime `python311`.

## Structure

- `main.py`: Firebase Functions entrypoint
- `app/bootstrap`: Firebase Admin bootstrap
- `app/config`: environment-based settings
- `app/document_ai`: MDDD layers for Document AI flow
  - `domain`
  - `application`
  - `infrastructure`
  - `interfaces`

## Install

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
```

## Local sanity check

```bash
python -m compileall -q .
```
