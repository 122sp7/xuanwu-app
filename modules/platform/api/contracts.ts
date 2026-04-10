/**
 * platform API contracts boundary.
 *
 * Keep the source of truth in application/domain and re-export here for API consumers.
 */

export * from "../application/dtos";
export type {
	PlatformContextView,
	PolicyCatalogView,
	SubscriptionEntitlementsView,
	WorkflowPolicyView,
} from "../domain/ports/output";
export * from "../domain/events";

// ── Identity session types ────────────────────────────────────────────────────
// AuthUser is the canonical projection of an authenticated identity subject.
// Platform/Identity BC owns this DTO; app/providers/auth-context re-exports it.

/** Minimal authenticated user record surfaced from identity auth state. */
export interface AuthUser {
	readonly id: string;
	readonly name: string;
	readonly email: string;
}

// ── Cross-cutting account context type ───────────────────────────────────────
// ActiveAccount is the union of an organization AccountEntity or a personal
// AuthUser. Owned by Platform BC; app/providers/app-context re-exports it.
import type { AccountEntity } from "../subdomains/account";
export type ActiveAccount = AccountEntity | AuthUser;
