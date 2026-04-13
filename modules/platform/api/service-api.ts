import { v4 as uuid } from "@lib-uuid";
import { getFirebaseAuth } from "@integration-firebase";

import { accessControlService } from "../subdomains/access-control/api";
import { isAllowed, type PermissionDecision } from "../domain/value-objects/PermissionDecision";
import { firestoreInfrastructureApi, storageInfrastructureApi } from "./infrastructure-api";
import type {
	AuthAPI,
	AuthSession,
	FileAPI,
	PermissionAPI,
	UploadUserFileInput,
	UploadUserFileOutput,
} from "./contracts";

interface PlatformFileRecord {
	readonly fileId: string;
	readonly ownerId: string;
	readonly storagePath: string;
	readonly filename: string;
	readonly contentType: string;
	readonly url: string;
	readonly metadata: Record<string, string>;
	readonly createdAtISO: string;
	readonly deletedAtISO?: string;
}

const PLATFORM_FILE_COLLECTION = "platform-files";

function normalizeOwnerId(ownerId: string): string {
	const normalized = ownerId.trim();
	if (!normalized) {
		throw new Error("ownerId is required.");
	}
	return normalized;
}

function normalizeFileName(input: UploadUserFileInput): string {
	const candidate = input.fileName?.trim();
	if (candidate) return candidate;

	if ("name" in input.file && typeof input.file.name === "string" && input.file.name.trim()) {
		return input.file.name.trim();
	}

	return "uploaded-file";
}

function sanitizeFileName(fileName: string): string {
	return fileName.replace(/[^a-zA-Z0-9._-]+/g, "-");
}

function parseResource(resource: string): { resourceType: string; resourceId?: string } {
	const normalized = resource.trim();
	if (!normalized) {
		return { resourceType: "resource" };
	}

	const separator = normalized.indexOf(":");
	if (separator < 0) {
		return { resourceType: normalized };
	}

	const resourceType = normalized.slice(0, separator).trim() || "resource";
	const resourceId = normalized.slice(separator + 1).trim() || undefined;
	return { resourceType, resourceId };
}

function parsePermissionDecision(raw: string): PermissionDecision | null {
	try {
		const value = JSON.parse(raw) as Partial<PermissionDecision>;
		if (!value || typeof value !== "object") return null;
		if (typeof value.outcome !== "string") return null;
		if (typeof value.reason !== "string") return null;
		if (typeof value.evaluatedAt !== "string") return null;
		return value as PermissionDecision;
	} catch {
		return null;
	}
}

function buildFileRecordPath(fileId: string): string {
	return `${PLATFORM_FILE_COLLECTION}/${fileId}`;
}

export const authApi: AuthAPI = {
	async getSession(): Promise<AuthSession | null> {
		const auth = getFirebaseAuth();
		const user = auth.currentUser;
		if (!user) {
			return null;
		}

		return {
			userId: user.uid,
			email: user.email,
			displayName: user.displayName,
			isAnonymous: user.isAnonymous,
		};
	},

	async requireAuth(): Promise<AuthSession> {
		const session = await authApi.getSession();
		if (!session) {
			throw new Error("Unauthorized");
		}
		return session;
	},
};

export const permissionApi: PermissionAPI = {
	async can(userId: string, action: string, resource: string): Promise<boolean> {
		const subjectId = userId.trim();
		const normalizedAction = action.trim();
		if (!subjectId || !normalizedAction) {
			return false;
		}

		const { resourceType, resourceId } = parseResource(resource);
		const result = await accessControlService.evaluatePermission({
			subjectId,
			resourceType,
			resourceId,
			action: normalizedAction,
		});

		if (!result.success) {
			return false;
		}

		const decision = parsePermissionDecision(result.aggregateId);
		if (!decision) {
			return false;
		}

		return isAllowed(decision);
	},
};

export const fileApi: FileAPI = {
	async uploadUserFile(input: UploadUserFileInput): Promise<UploadUserFileOutput> {
		const ownerId = normalizeOwnerId(input.ownerId);
		const isAllowedToCreate = await permissionApi.can(ownerId, "create:file", `file-owner:${ownerId}`);
		if (!isAllowedToCreate) {
			throw new Error("Permission denied: create:file");
		}

		const fileId = uuid();
		const fileName = normalizeFileName(input);
		const normalizedFileName = sanitizeFileName(fileName);
		const storagePath =
			input.pathHint?.trim() || `user-files/${ownerId}/${fileId}/${normalizedFileName}`;
		const contentType = input.contentType?.trim() || input.file.type || "application/octet-stream";

		const url = await storageInfrastructureApi.upload(input.file, storagePath, {
			contentType,
			customMetadata: {
				ownerId,
				fileId,
				filename: fileName,
				...(input.metadata ?? {}),
			},
		});

		const record: PlatformFileRecord = {
			fileId,
			ownerId,
			storagePath,
			filename: fileName,
			contentType,
			url,
			metadata: input.metadata ?? {},
			createdAtISO: new Date().toISOString(),
		};

		await firestoreInfrastructureApi.set(buildFileRecordPath(fileId), record);

		return {
			url,
			fileId,
			storagePath,
			gcsUri: storageInfrastructureApi.toGsUri(storagePath),
		};
	},

	async deleteFile(fileId: string): Promise<void> {
		const normalizedFileId = fileId.trim();
		if (!normalizedFileId) {
			throw new Error("fileId is required.");
		}

		const recordPath = buildFileRecordPath(normalizedFileId);
		const record = await firestoreInfrastructureApi.get<PlatformFileRecord>(recordPath);
		if (!record || record.deletedAtISO) {
			return;
		}

		const isAllowedToDelete = await permissionApi.can(
			record.ownerId,
			"delete:file",
			`file:${normalizedFileId}`,
		);
		if (!isAllowedToDelete) {
			throw new Error("Permission denied: delete:file");
		}

		await storageInfrastructureApi.delete(record.storagePath);
		await firestoreInfrastructureApi.set(recordPath, {
			...record,
			deletedAtISO: new Date().toISOString(),
		});
	},
};
