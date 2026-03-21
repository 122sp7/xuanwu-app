"""[Layer 6] Text preprocessor — clean and normalise extracted text.

Implements TextPreprocessorPort.
"""

from __future__ import annotations

import re


class LlamaTextPreprocessor:
    """Normalise raw extracted text before chunking."""

    def preprocess(self, text: str) -> str:
        cleaned = text.strip()
        # Collapse multiple whitespace/newlines into a single space.
        cleaned = re.sub(r"\s+", " ", cleaned)
        # Remove common Markdown artefacts that add no retrieval value.
        cleaned = re.sub(r"#{1,6}\s*", "", cleaned)
        return cleaned
