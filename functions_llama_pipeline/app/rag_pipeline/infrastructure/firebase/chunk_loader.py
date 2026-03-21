"""Load ready chunks from Firestore for the RAG query path."""

from __future__ import annotations

from firebase_admin import firestore


def load_ready_chunks(
    organization_id: str,
    workspace_id: str | None = None,
    taxonomy: str | None = None,
    limit: int = 200,
) -> list[dict]:
    """Fetch chunks from Firestore that belong to ready documents.

    Returns raw Firestore dicts suitable for building a LlamaIndex Document list.
    """
    db = firestore.client()

    # Query chunks via the top-level collection-group path.
    base = db.collection_group("chunks").where("organizationId", "==", organization_id)

    if workspace_id:
        base = base.where("workspaceId", "==", workspace_id)
    if taxonomy:
        base = base.where("taxonomy", "==", taxonomy)

    base = base.limit(limit)
    snapshots = base.get()
    return [snap.to_dict() for snap in snapshots]
