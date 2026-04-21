from __future__ import annotations


class UnauthenticatedError(PermissionError):
    """Raised when a callable command requires an authenticated actor."""


class AuthorizationError(PermissionError):
    """Raised when an actor lacks access to the requested scope."""
