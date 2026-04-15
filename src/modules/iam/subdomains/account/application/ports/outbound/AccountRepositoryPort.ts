import type { AccountRepository } from "../../domain/repositories/AccountRepository";
import type { AccountQueryRepository } from "../../domain/repositories/AccountQueryRepository";
import type { AccountPolicyRepository } from "../../domain/repositories/AccountPolicyRepository";
import type { TokenRefreshPort } from "../../domain/ports/TokenRefreshPort";

/** Outbound port contract for account persistence — mirrors AccountRepository. */
export type { AccountRepository as AccountRepositoryPort };

/** Outbound port contract for account read queries. */
export type { AccountQueryRepository as AccountQueryRepositoryPort };

/** Outbound port contract for account policy persistence. */
export type { AccountPolicyRepository as AccountPolicyRepositoryPort };

/** Outbound port for token-refresh signaling. */
export type { TokenRefreshPort as TokenRefreshPortContract };
