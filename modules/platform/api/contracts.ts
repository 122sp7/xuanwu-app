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

// ── Infrastructure API contracts (platform-owned) ───────────────────────────

export type FirestoreWhereOperator =
	| "<"
	| "<="
	| "=="
	| "!="
	| ">="
	| ">"
	| "array-contains"
	| "array-contains-any"
	| "in"
	| "not-in";

export interface FirestoreWhereClause {
	readonly field: string;
	readonly op: FirestoreWhereOperator;
	readonly value: unknown;
}

export interface FirestoreAPI {
	get<T>(path: string): Promise<T | null>;
	set<T>(path: string, data: T): Promise<void>;
	query<T>(collectionPath: string, where?: readonly FirestoreWhereClause[]): Promise<T[]>;
}

export interface StorageUploadOptions {
	readonly contentType?: string;
	readonly customMetadata?: Record<string, string>;
}

export interface StorageAPI {
	upload(file: Blob, path: string, options?: StorageUploadOptions): Promise<string>;
	getUrl(path: string): Promise<string>;
	delete(path: string): Promise<void>;
	toGsUri(path: string): string;
}

export interface GenkitAPI {
	runFlow<TInput, TOutput>(flow: string, input: TInput): Promise<TOutput>;
}

// ── Platform Service API contracts (cross-domain) ───────────────────────────

export interface AuthSession {
	readonly userId: string;
	readonly email: string | null;
	readonly displayName: string | null;
	readonly isAnonymous: boolean;
}

export interface AuthAPI {
	getSession(): Promise<AuthSession | null>;
	requireAuth(): Promise<AuthSession>;
}

export interface PermissionAPI {
	can(userId: string, action: string, resource: string): Promise<boolean>;
}

export interface UploadUserFileInput {
	readonly file: Blob;
	readonly ownerId: string;
	readonly fileName?: string;
	readonly contentType?: string;
	readonly metadata?: Record<string, string>;
	readonly pathHint?: string;
}

export interface UploadUserFileOutput {
	readonly url: string;
	readonly fileId: string;
	readonly storagePath: string;
	readonly gcsUri: string;
}

export interface FileAPI {
	uploadUserFile(input: UploadUserFileInput): Promise<UploadUserFileOutput>;
	deleteFile(fileId: string): Promise<void>;
}

// ── Cross-cutting account context type ───────────────────────────────────────
// ActiveAccount is the union of an organization AccountEntity or a personal
// AuthUser. Owned by Platform BC; app/providers/app-context re-exports it.
import type { AccountEntity } from "../subdomains/account/api";
export type ActiveAccount = AccountEntity | AuthUser;
