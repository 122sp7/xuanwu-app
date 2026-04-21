from __future__ import annotations

from domain.repositories import AuthorizationGateway, get_authorization_gateway


def get_authorization() -> AuthorizationGateway:
    return get_authorization_gateway()
