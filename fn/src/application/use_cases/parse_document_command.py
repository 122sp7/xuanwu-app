"""Authorized command wrapper for parse-document callable entry."""

from __future__ import annotations

from application.services.authorization import get_authorization
from application.services.document_pipeline import get_document_status_gateway
from application.use_cases.parse_document_pipeline import (
    ParseDocumentCommand,
    ParseDocumentResult,
    execute_parse_document,
)
from domain.repositories import AuthorizationGateway, DocumentStatusGateway


def execute_parse_document_command(
    *,
    actor_id: str,
    cmd: ParseDocumentCommand,
    auth_gateway: AuthorizationGateway | None = None,
    status_gateway: DocumentStatusGateway | None = None,
) -> ParseDocumentResult:
    auth_gateway = auth_gateway or get_authorization()
    status_gateway = status_gateway or get_document_status_gateway()

    auth_gateway.assert_actor_can_access_account(
        actor_id=actor_id,
        account_id=cmd.account_id,
    )
    auth_gateway.assert_workspace_belongs_account(
        account_id=cmd.account_id,
        workspace_id=cmd.workspace_id,
    )

    try:
        return execute_parse_document(cmd)
    except Exception as exc:
        status_gateway.record_error(
            cmd.doc_id,
            str(exc)[:200],
            account_id=cmd.account_id,
        )
        raise RuntimeError(f"parse_document execution failed for doc_id={cmd.doc_id}") from exc
