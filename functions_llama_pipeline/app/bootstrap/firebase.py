import firebase_admin


def ensure_firebase_app() -> firebase_admin.App:
    """Initialise Firebase Admin SDK once per cold start."""
    try:
        return firebase_admin.get_app()
    except ValueError:
        return firebase_admin.initialize_app()
