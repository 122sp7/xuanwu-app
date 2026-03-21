from app.rag_ingestion.domain.ports import RagTaxonomyClassifierPort

TAXONOMY_RULES: tuple[tuple[str, tuple[str, ...]], ...] = (
    ("finance", ("invoice", "payment")),
    ("governance", ("policy", "compliance")),
    ("legal", ("contract", "agreement")),
)


class SimpleRagTaxonomyClassifier(RagTaxonomyClassifierPort):
    def classify(self, text: str, taxonomy_hint: str | None = None) -> str:
        if taxonomy_hint and taxonomy_hint.strip():
            return taxonomy_hint.strip()

        lowered = text.lower()
        for taxonomy, keywords in TAXONOMY_RULES:
            if any(keyword in lowered for keyword in keywords):
                return taxonomy
        return "general"
