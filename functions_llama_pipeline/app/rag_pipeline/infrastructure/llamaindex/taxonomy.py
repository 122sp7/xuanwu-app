"""[Layer 5] Simple keyword-based taxonomy classifier.

Implements TaxonomyClassifierPort.
"""

from __future__ import annotations

TAXONOMY_RULES: tuple[tuple[str, tuple[str, ...]], ...] = (
    ("finance", ("invoice", "payment", "revenue", "budget", "financial")),
    ("governance", ("policy", "compliance", "regulation", "governance")),
    ("legal", ("contract", "agreement", "clause", "liability", "legal")),
    ("technical", ("api", "architecture", "deployment", "server", "code")),
    ("hr", ("employee", "onboarding", "leave", "salary", "benefits")),
)


class SimpleTaxonomyClassifier:
    """Classify document text into a taxonomy category via keyword matching."""

    def classify(self, text: str, hint: str | None = None) -> str:
        if hint and hint.strip():
            return hint.strip()

        lowered = text[:5000].lower()
        for taxonomy, keywords in TAXONOMY_RULES:
            if any(keyword in lowered for keyword in keywords):
                return taxonomy
        return "general"
