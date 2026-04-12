import {
	functionsApi,
	firestoreApi,
	getFirebaseFirestore,
	getFirebaseFunctions,
	getFirebaseStorage,
	storageApi,
} from "@integration-firebase";

import type {
	FirestoreAPI,
	FunctionsAPI,
	FunctionsCallOptions,
	FirestoreWhereClause,
	GenkitAPI,
	StorageAPI,
	StorageUploadOptions,
} from "./contracts";

const DEFAULT_STORAGE_BUCKET = "xuanwu-i-00708880-4e2d8.firebasestorage.app";
const DEFAULT_FUNCTION_REGION = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION ?? "asia-east1";

function splitPath(path: string): string[] {
	const segments = path
		.split("/")
		.map((segment) => segment.trim())
		.filter(Boolean);

	if (segments.length === 0) {
		throw new Error("Path is required.");
	}

	return segments;
}

function resolveDocumentPath(path: string): string[] {
	const segments = splitPath(path);
	if (segments.length % 2 !== 0) {
		throw new Error(`Expected a document path but got collection path: ${path}`);
	}
	return segments;
}

function resolveCollectionPath(path: string): string[] {
	const segments = splitPath(path);
	if (segments.length % 2 === 0) {
		throw new Error(`Expected a collection path but got document path: ${path}`);
	}
	return segments;
}

function resolveStorageBucket(): string {
	return process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() || DEFAULT_STORAGE_BUCKET;
}

function resolveStoragePath(path: string): string {
	const normalized = path.trim().replace(/^\/+/, "");
	if (!normalized) {
		throw new Error("Storage path is required.");
	}
	return normalized;
}

function toUploadMetadata(options?: StorageUploadOptions) {
	if (!options) return undefined;
	return {
		contentType: options.contentType,
		customMetadata: options.customMetadata,
	};
}

export const firestoreInfrastructureApi: FirestoreAPI = {
	async get<T>(path: string): Promise<T | null> {
		const db = getFirebaseFirestore();
		const ref = firestoreApi.doc(db, resolveDocumentPath(path).join("/"));
		const snapshot = await firestoreApi.getDoc(ref);
		if (!snapshot.exists()) return null;
		return snapshot.data() as T;
	},

	async set<T>(path: string, data: T): Promise<void> {
		const db = getFirebaseFirestore();
		const ref = firestoreApi.doc(db, resolveDocumentPath(path).join("/"));
		await firestoreApi.setDoc(ref, data as Record<string, unknown>);
	},

	async query<T>(collectionPath: string, where: readonly FirestoreWhereClause[] = []): Promise<T[]> {
		const db = getFirebaseFirestore();
		const collectionRef = firestoreApi.collection(
			db,
			resolveCollectionPath(collectionPath).join("/"),
		);

		const queryConstraints = where.map((clause) =>
			firestoreApi.where(clause.field, clause.op, clause.value),
		);

		const queryRef = firestoreApi.query(collectionRef, ...queryConstraints);
		const snapshot = await firestoreApi.getDocs(queryRef);
		return snapshot.docs.map((doc) => doc.data() as T);
	},

	watchCollection<T>(
		collectionPath: string,
		handlers: {
			onNext: (documents: readonly { id: string; data: T }[]) => void;
			onError?: (error: unknown) => void;
		},
		where: readonly FirestoreWhereClause[] = [],
	): () => void {
		const db = getFirebaseFirestore();
		const collectionRef = firestoreApi.collection(
			db,
			resolveCollectionPath(collectionPath).join("/"),
		);

		const queryConstraints = where.map((clause) =>
			firestoreApi.where(clause.field, clause.op, clause.value),
		);
		const queryRef = firestoreApi.query(collectionRef, ...queryConstraints);

		return firestoreApi.onSnapshot(
			queryRef,
			(snapshot) => {
				handlers.onNext(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						data: doc.data() as T,
					})),
				);
			},
			(error) => {
				handlers.onError?.(error);
			},
		);
	},
};

export const storageInfrastructureApi: StorageAPI = {
	async upload(file: Blob, path: string, options?: StorageUploadOptions): Promise<string> {
		const normalizedPath = resolveStoragePath(path);
		const storage = getFirebaseStorage(resolveStorageBucket());
		const ref = storageApi.ref(storage, normalizedPath);
		await storageApi.uploadBytes(ref, file, toUploadMetadata(options));
		return storageApi.getDownloadURL(ref);
	},

	async getUrl(path: string): Promise<string> {
		const normalizedPath = resolveStoragePath(path);
		const storage = getFirebaseStorage(resolveStorageBucket());
		const ref = storageApi.ref(storage, normalizedPath);
		return storageApi.getDownloadURL(ref);
	},

	async delete(path: string): Promise<void> {
		const normalizedPath = resolveStoragePath(path);
		const storage = getFirebaseStorage(resolveStorageBucket());
		const ref = storageApi.ref(storage, normalizedPath);
		await storageApi.deleteObject(ref);
	},

	toGsUri(path: string): string {
		const normalizedPath = resolveStoragePath(path);
		return `gs://${resolveStorageBucket()}/${normalizedPath}`;
	},
};

export const genkitInfrastructureApi: GenkitAPI = {
	async runFlow<TInput, TOutput>(flow: string, input: TInput): Promise<TOutput> {
		const normalizedFlow = flow.trim();
		if (!normalizedFlow) {
			throw new Error("Flow name is required.");
		}

		const functions = getFirebaseFunctions(DEFAULT_FUNCTION_REGION);
		const runFlow = functionsApi.httpsCallable(functions, "platform_run_genkit_flow");
		const response = await runFlow({ flow: normalizedFlow, input });
		return response.data as TOutput;
	},
};

export const functionsInfrastructureApi: FunctionsAPI = {
	async call<TInput, TOutput>(
		functionName: string,
		input: TInput,
		options?: FunctionsCallOptions,
	): Promise<TOutput> {
		const normalizedName = functionName.trim();
		if (!normalizedName) {
			throw new Error("Function name is required.");
		}

		const region = options?.region?.trim() || DEFAULT_FUNCTION_REGION;
		const functions = getFirebaseFunctions(region);
		const callable = functionsApi.httpsCallable(functions, normalizedName);
		const response = await callable(input);
		return response.data as TOutput;
	},
};
