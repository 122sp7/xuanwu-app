"""Infrastructure implementation of AuthorizationGateway."""

from __future__ import annotations

import firebase_admin.firestore as fb_firestore
from core.auth_errors import AuthorizationError, UnauthenticatedError


class FirestoreAuthorizationGateway:
    def assert_actor_can_access_account(self, *, actor_id: str, account_id: str) -> None:
        if not actor_id:
            raise UnauthenticatedError("authentication required")
        if actor_id == account_id:
            return

        db = fb_firestore.client()
        snap = db.collection("accounts").document(account_id).get()
        if not snap.exists:
            raise AuthorizationError("account not found or inaccessible")

        data = snap.to_dict() or {}
        owner_id = str(data.get("ownerId", "")).strip()
        member_ids = data.get("memberIds") if isinstance(data.get("memberIds"), list) else []
        member_set = {str(item or "").strip() for item in member_ids}
        if owner_id == actor_id or actor_id in member_set:
            return

        raise AuthorizationError("you do not have access to this account scope")

    def assert_workspace_belongs_account(self, *, account_id: str, workspace_id: str) -> None:
        db = fb_firestore.client()
        snap = db.collection("workspaces").document(workspace_id).get()
        if not snap.exists:
            raise ValueError("workspace not found")

        data = snap.to_dict() or {}
        bound_account_id = str(data.get("accountId", "")).strip()
        if bound_account_id != account_id:
            raise AuthorizationError("workspace does not belong to account scope")
