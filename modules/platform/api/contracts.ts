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

export type FirestoreOrderDirection = "asc" | "desc";

export interface FirestoreOrderByClause {
	readonly field: string;
	readonly direction?: FirestoreOrderDirection;
}

export interface FirestoreQueryOptions {
	readonly limit?: number;
	readonly orderBy?: readonly FirestoreOrderByClause[];
}

export interface FirestoreCollectionDocument<T> {
	readonly id: string;
	readonly path: string;
	readonly data: T;
}

export interface FirestoreCollectionWatchHandlers<T> {
	readonly onNext: (documents: readonly FirestoreCollectionDocument<T>[]) => void;
	readonly onError?: (error: unknown) => void;
}

export interface FirestoreDocumentWatchHandlers<T> {
	readonly onNext: (document: FirestoreCollectionDocument<T> | null) => void;
	readonly onError?: (error: unknown) => void;
}

export interface FirestoreSetDocumentInput<T> {
	readonly path: string;
	readonly data: T;
}

export interface FirestoreAPI {
	get<T>(path: string): Promise<T | null>;
	set<T>(path: string, data: T): Promise<void>;
	setMany<T>(inputs: readonly FirestoreSetDocumentInput<T>[]): Promise<void>;
	update(path: string, data: Record<string, unknown>): Promise<void>;
	delete(path: string): Promise<void>;
	query<T>(
		collectionPath: string,
		where?: readonly FirestoreWhereClause[],
		options?: FirestoreQueryOptions,
	): Promise<T[]>;
	queryDocuments<T>(
		collectionPath: string,
		where?: readonly FirestoreWhereClause[],
		options?: FirestoreQueryOptions,
	): Promise<readonly FirestoreCollectionDocument<T>[]>;
	queryCollectionGroup<T>(
		collectionId: string,
		where?: readonly FirestoreWhereClause[],
		options?: FirestoreQueryOptions,
	): Promise<readonly FirestoreCollectionDocument<T>[]>;
	watchCollection<T>(
		collectionPath: string,
		handlers: FirestoreCollectionWatchHandlers<T>,
		where?: readonly FirestoreWhereClause[],
	): () => void;
	watchDocument<T>(path: string, handlers: FirestoreDocumentWatchHandlers<T>): () => void;
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

export interface FunctionsCallOptions {
	readonly region?: string;
}

export interface FunctionsAPI {
	call<TInput, TOutput>(
		functionName: string,
		input: TInput,
		options?: FunctionsCallOptions,
	): Promise<TOutput>;
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
