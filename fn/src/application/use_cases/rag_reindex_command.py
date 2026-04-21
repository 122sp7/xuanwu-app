"""Authorized command wrapper for rag-reindex callable entry."""

from __future__ import annotations

from application.services.authorization import get_authorization
from application.services.document_pipeline import get_document_status_gateway
from application.use_cases.rag_reindex import (
    RagReindexCommand,
    RagReindexResult,
    execute_rag_reindex,
)
from domain.repositories import AuthorizationGateway, DocumentStatusGateway


def execute_rag_reindex_command(
    *,
    actor_id: str,
    cmd: RagReindexCommand,
    auth_gateway: AuthorizationGateway | None = None,
    status_gateway: DocumentStatusGateway | None = None,
) -> RagReindexResult:
    auth_gateway = auth_gateway or get_authorization()
    status_gateway = status_gateway or get_document_status_gateway()

    auth_gateway.assert_actor_can_access_account(
        actor_id=actor_id,
        account_id=cmd.account_id,
    )
    if cmd.workspace_id:
        auth_gateway.assert_workspace_belongs_account(
            account_id=cmd.account_id,
            workspace_id=cmd.workspace_id,
        )

    try:
        return execute_rag_reindex(cmd)
    except Exception as exc:
        status_gateway.record_rag_error(
            cmd.doc_id,
            str(exc)[:200],
            account_id=cmd.account_id,
        )
        raise RuntimeError(f"rag_reindex execution failed for doc_id={cmd.doc_id}") from exc
