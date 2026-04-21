"""Infrastructure implementation of DocumentRateLimitGateway."""

from __future__ import annotations

from infrastructure.external.upstash.clients import redis_fixed_window_allow


class InfraDocumentRateLimitGateway:
    def redis_fixed_window_allow(
        self,
        key: str,
        max_requests: int,
        window_seconds: int,
    ) -> tuple[bool, int]:
        return redis_fixed_window_allow(
            key=key,
            max_requests=max_requests,
            window_seconds=window_seconds,
        )
