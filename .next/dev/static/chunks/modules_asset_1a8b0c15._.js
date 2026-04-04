(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/modules/asset/interfaces/hooks/useDocumentsSnapshot.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapToAssetLiveDocument",
    ()=>mapToAssetLiveDocument,
    "useDocumentsSnapshot",
    ()=>useDocumentsSnapshot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/firestore.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
// ─── Internal helpers ─────────────────────────────────────────────────────────
function isRecord(value) {
    return typeof value === "object" && value !== null;
}
function objectOrEmpty(value) {
    return isRecord(value) ? value : {};
}
function toDateOrNull(value) {
    if (!isRecord(value)) return null;
    if (typeof value.toDate === "function") {
        try {
            const d = value.toDate();
            if (d instanceof Date) return d;
        } catch  {
        // fall through
        }
    }
    if (typeof value.toMillis === "function") {
        try {
            const ms = value.toMillis();
            if (typeof ms === "number" && Number.isFinite(ms)) return new Date(ms);
        } catch  {
        // fall through
        }
    }
    return null;
}
function resolveFilename(data) {
    const source = objectOrEmpty(data.source);
    const metadata = objectOrEmpty(data.metadata);
    const candidates = [
        source.filename,
        source.display_name,
        data.title,
        metadata.filename,
        metadata.display_name,
        source.original_filename,
        metadata.original_filename
    ];
    for (const c of candidates){
        if (typeof c === "string" && c.trim()) return c;
    }
    return "";
}
function mapToAssetLiveDocument(id, data) {
    const source = objectOrEmpty(data.source);
    const parsed = objectOrEmpty(data.parsed);
    const rag = objectOrEmpty(data.rag);
    const metadata = objectOrEmpty(data.metadata);
    const error = objectOrEmpty(data.error);
    const n = (v)=>typeof v === "number" && Number.isFinite(v) ? v : 0;
    return {
        id,
        filename: resolveFilename(data) || id,
        workspaceId: (typeof data.spaceId === "string" ? data.spaceId : "") || (typeof metadata.space_id === "string" ? metadata.space_id : ""),
        sourceGcsUri: (typeof source.gcs_uri === "string" ? source.gcs_uri : "") || (typeof metadata.source_gcs_uri === "string" ? metadata.source_gcs_uri : ""),
        jsonGcsUri: (typeof parsed.json_gcs_uri === "string" ? parsed.json_gcs_uri : "") || (typeof metadata.json_gcs_uri === "string" ? metadata.json_gcs_uri : ""),
        pageCount: n(parsed.page_count) || n(metadata.page_count) || n(data.pageCount),
        status: typeof data.status === "string" ? data.status : "unknown",
        ragStatus: typeof rag.status === "string" ? rag.status : "",
        uploadedAt: toDateOrNull(source.uploaded_at) ?? toDateOrNull(data.createdAt),
        errorMessage: typeof error.message === "string" ? error.message : "",
        ragError: typeof rag.error === "string" ? rag.error : ""
    };
}
function useDocumentsSnapshot(accountId, workspaceId) {
    _s();
    const [rawDocs, setRawDocs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [rawPending, setRawPending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [receivedKey, setReceivedKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const statusMapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    const addPending = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDocumentsSnapshot.useCallback[addPending]": (doc)=>{
            setRawPending({
                "useDocumentsSnapshot.useCallback[addPending]": (prev)=>[
                        doc,
                        ...prev.filter({
                            "useDocumentsSnapshot.useCallback[addPending]": (p)=>p.id !== doc.id
                        }["useDocumentsSnapshot.useCallback[addPending]"])
                    ]
            }["useDocumentsSnapshot.useCallback[addPending]"]);
        }
    }["useDocumentsSnapshot.useCallback[addPending]"], []);
    const removePending = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDocumentsSnapshot.useCallback[removePending]": (id)=>{
            setRawPending({
                "useDocumentsSnapshot.useCallback[removePending]": (prev)=>prev.filter({
                        "useDocumentsSnapshot.useCallback[removePending]": (p)=>p.id !== id
                    }["useDocumentsSnapshot.useCallback[removePending]"])
            }["useDocumentsSnapshot.useCallback[removePending]"]);
        }
    }["useDocumentsSnapshot.useCallback[removePending]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDocumentsSnapshot.useEffect": ()=>{
            if (!accountId) return;
            const subKey = `${accountId}/${workspaceId ?? ""}`;
            statusMapRef.current = {};
            const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirebaseFirestore"])();
            const colRef = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firestoreApi"].collection(db, "accounts", accountId, "documents");
            const unsubscribe = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firestoreApi"].onSnapshot(colRef, {
                "useDocumentsSnapshot.useEffect.unsubscribe": (snapshot)=>{
                    const mapped = snapshot.docs.map({
                        "useDocumentsSnapshot.useEffect.unsubscribe.mapped": (item)=>mapToAssetLiveDocument(item.id, objectOrEmpty(item.data()))
                    }["useDocumentsSnapshot.useEffect.unsubscribe.mapped"]).filter({
                        "useDocumentsSnapshot.useEffect.unsubscribe.mapped": (item)=>!workspaceId || item.workspaceId === workspaceId
                    }["useDocumentsSnapshot.useEffect.unsubscribe.mapped"]).sort({
                        "useDocumentsSnapshot.useEffect.unsubscribe.mapped": (a, b)=>(b.uploadedAt?.getTime() ?? 0) - (a.uploadedAt?.getTime() ?? 0)
                    }["useDocumentsSnapshot.useEffect.unsubscribe.mapped"]);
                    const nextMap = {};
                    mapped.forEach({
                        "useDocumentsSnapshot.useEffect.unsubscribe": (doc)=>{
                            nextMap[doc.id] = `${doc.status}/${doc.ragStatus}`;
                        }
                    }["useDocumentsSnapshot.useEffect.unsubscribe"]);
                    statusMapRef.current = nextMap;
                    setRawDocs(mapped);
                    setRawPending({
                        "useDocumentsSnapshot.useEffect.unsubscribe": (prev)=>prev.filter({
                                "useDocumentsSnapshot.useEffect.unsubscribe": (p)=>!mapped.some({
                                        "useDocumentsSnapshot.useEffect.unsubscribe": (d)=>d.id === p.id
                                    }["useDocumentsSnapshot.useEffect.unsubscribe"])
                            }["useDocumentsSnapshot.useEffect.unsubscribe"])
                    }["useDocumentsSnapshot.useEffect.unsubscribe"]);
                    setReceivedKey(subKey);
                }
            }["useDocumentsSnapshot.useEffect.unsubscribe"], {
                "useDocumentsSnapshot.useEffect.unsubscribe": ()=>{
                    setReceivedKey(subKey);
                }
            }["useDocumentsSnapshot.useEffect.unsubscribe"]);
            return ({
                "useDocumentsSnapshot.useEffect": ()=>{
                    unsubscribe();
                    statusMapRef.current = {};
                }
            })["useDocumentsSnapshot.useEffect"];
        }
    }["useDocumentsSnapshot.useEffect"], [
        accountId,
        workspaceId
    ]);
    const currentKey = `${accountId}/${workspaceId ?? ""}`;
    const docs = accountId ? rawDocs : [];
    const loading = Boolean(accountId) && receivedKey !== currentKey;
    const pendingDocs = accountId ? rawPending : [];
    return {
        docs,
        loading,
        pendingDocs,
        addPending,
        removePending
    };
}
_s(useDocumentsSnapshot, "qzUhXBJGUIF3EirL0lj+f4oaE0U=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/asset/domain/services/resolve-file-organization-id.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "resolveFileOrganizationId",
    ()=>resolveFileOrganizationId
]);
function resolveFileOrganizationId(accountType, accountId) {
    return accountType === "organization" ? accountId : `personal:${accountId}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/asset/application/use-cases/list-workspace-files.use-case.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ListWorkspaceFilesUseCase",
    ()=>ListWorkspaceFilesUseCase
]);
const DEFAULT_FILE_SOURCE = "file-module";
const DEFAULT_FILE_DETAIL = "File metadata mapped from current workspace context.";
class ListWorkspaceFilesUseCase {
    fileRepository;
    constructor(fileRepository){
        this.fileRepository = fileRepository;
    }
    async execute(scope) {
        const workspaceId = scope.workspaceId.trim();
        const organizationId = scope.organizationId.trim();
        const actorAccountId = scope.actorAccountId.trim();
        if (!workspaceId || !organizationId || !actorAccountId) {
            return [];
        }
        const files = await this.fileRepository.listByWorkspace({
            workspaceId,
            organizationId,
            actorAccountId
        });
        return files.map((file)=>({
                id: file.id,
                workspaceId: file.workspaceId,
                organizationId: file.organizationId,
                name: file.name,
                status: file.status,
                kind: file.classification,
                source: file.source ?? DEFAULT_FILE_SOURCE,
                detail: file.detail ?? DEFAULT_FILE_DETAIL,
                href: file.href
            }));
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/asset/infrastructure/firebase/FirebaseFileRepository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseFileRepository",
    ()=>FirebaseFileRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/client.ts [app-client] (ecmascript)");
;
;
const FILE_COLLECTION = "workspaceFiles";
const VERSION_SUBCOLLECTION = "versions";
function isFileStatus(value) {
    return value === "active" || value === "archived" || value === "deleted";
}
function isFileClassification(value) {
    return value === "image" || value === "manifest" || value === "record" || value === "other";
}
function toStringArray(value) {
    if (!Array.isArray(value)) {
        return [];
    }
    return value.filter((item)=>typeof item === "string");
}
function toFileEntity(fileId, data) {
    return {
        id: fileId,
        workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
        organizationId: typeof data.organizationId === "string" ? data.organizationId : "",
        accountId: typeof data.accountId === "string" ? data.accountId : "",
        name: typeof data.name === "string" ? data.name : "",
        mimeType: typeof data.mimeType === "string" ? data.mimeType : "application/octet-stream",
        sizeBytes: typeof data.sizeBytes === "number" ? data.sizeBytes : 0,
        classification: isFileClassification(data.classification) ? data.classification : "other",
        tags: toStringArray(data.tags),
        currentVersionId: typeof data.currentVersionId === "string" ? data.currentVersionId : "",
        retentionPolicyId: typeof data.retentionPolicyId === "string" ? data.retentionPolicyId : undefined,
        status: isFileStatus(data.status) ? data.status : "active",
        source: typeof data.source === "string" ? data.source : undefined,
        detail: typeof data.detail === "string" ? data.detail : undefined,
        href: typeof data.href === "string" ? data.href : undefined,
        createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
        updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
        deletedAtISO: typeof data.deletedAtISO === "string" ? data.deletedAtISO : undefined
    };
}
function isFileVersionStatus(value) {
    return value === "pending" || value === "stored" || value === "active" || value === "superseded";
}
function toFileVersionEntity(versionId, data) {
    return {
        id: versionId,
        fileId: typeof data.fileId === "string" ? data.fileId : "",
        versionNumber: typeof data.versionNumber === "number" ? data.versionNumber : 0,
        status: isFileVersionStatus(data.status) ? data.status : "pending",
        storagePath: typeof data.storagePath === "string" ? data.storagePath : "",
        checksum: typeof data.checksum === "string" ? data.checksum : undefined,
        createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : ""
    };
}
class FirebaseFileRepository {
    db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirestore"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firebaseClientApp"]);
    get collectionRef() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(this.db, FILE_COLLECTION);
    }
    async findById(fileId) {
        const normalizedFileId = fileId.trim();
        if (!normalizedFileId) {
            return null;
        }
        const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(this.db, FILE_COLLECTION, normalizedFileId));
        if (!snapshot.exists()) {
            return null;
        }
        return toFileEntity(snapshot.id, snapshot.data());
    }
    async findVersion(fileId, versionId) {
        const normalizedFileId = fileId.trim();
        const normalizedVersionId = versionId.trim();
        if (!normalizedFileId || !normalizedVersionId) {
            return null;
        }
        const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(this.db, FILE_COLLECTION, normalizedFileId, VERSION_SUBCOLLECTION, normalizedVersionId));
        if (!snapshot.exists()) {
            return null;
        }
        return toFileVersionEntity(snapshot.id, snapshot.data());
    }
    async listByWorkspace(scope) {
        const workspaceId = scope.workspaceId.trim();
        const organizationId = scope.organizationId.trim();
        if (!workspaceId) {
            return [];
        }
        const snapshots = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])(this.collectionRef, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("workspaceId", "==", workspaceId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("organizationId", "==", organizationId)));
        return snapshots.docs.map((snapshot)=>toFileEntity(snapshot.id, snapshot.data())).sort((left, right)=>right.updatedAtISO.localeCompare(left.updatedAtISO));
    }
    async save(file, versions = []) {
        const batch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writeBatch"])(this.db);
        const fileRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(this.db, FILE_COLLECTION, file.id);
        batch.set(fileRef, {
            workspaceId: file.workspaceId,
            organizationId: file.organizationId,
            accountId: file.accountId,
            name: file.name,
            mimeType: file.mimeType,
            sizeBytes: file.sizeBytes,
            classification: file.classification,
            tags: [
                ...file.tags
            ],
            currentVersionId: file.currentVersionId,
            ...file.retentionPolicyId ? {
                retentionPolicyId: file.retentionPolicyId
            } : {},
            status: file.status,
            ...file.source ? {
                source: file.source
            } : {},
            ...file.detail ? {
                detail: file.detail
            } : {},
            ...file.href ? {
                href: file.href
            } : {},
            createdAtISO: file.createdAtISO,
            updatedAtISO: file.updatedAtISO,
            ...file.deletedAtISO ? {
                deletedAtISO: file.deletedAtISO
            } : {}
        });
        versions.forEach((version)=>{
            batch.set((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(fileRef, VERSION_SUBCOLLECTION, version.id), {
                fileId: version.fileId,
                versionNumber: version.versionNumber,
                status: version.status,
                storagePath: version.storagePath,
                ...version.checksum ? {
                    checksum: version.checksum
                } : {},
                createdAtISO: version.createdAtISO
            });
        });
        await batch.commit();
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/asset/infrastructure/firebase/FirebaseRagDocumentRepository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseRagDocumentRepository",
    ()=>FirebaseRagDocumentRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/client.ts [app-client] (ecmascript)");
;
;
function buildKnowledgeDocumentRef(input) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirestore"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firebaseClientApp"]), "knowledge_base", input.organizationId, "workspaces", input.workspaceId, "documents", input.documentId);
}
function buildKnowledgeDocumentsCollection(input) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirestore"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firebaseClientApp"]), "knowledge_base", input.organizationId, "workspaces", input.workspaceId, "documents");
}
function toStringArray(value) {
    if (!Array.isArray(value)) {
        return [];
    }
    return value.filter((item)=>typeof item === "string");
}
function toRagDocumentRecord(documentId, data, fallbackScope) {
    return {
        id: documentId,
        organizationId: typeof data.organizationId === "string" ? data.organizationId : fallbackScope.organizationId,
        workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : fallbackScope.workspaceId,
        displayName: typeof data.displayName === "string" && data.displayName || typeof data.sourceFileName === "string" && data.sourceFileName || "",
        title: typeof data.title === "string" ? data.title : "",
        sourceFileName: typeof data.sourceFileName === "string" ? data.sourceFileName : "",
        mimeType: typeof data.mimeType === "string" ? data.mimeType : "application/octet-stream",
        storagePath: typeof data.storagePath === "string" ? data.storagePath : "",
        sizeBytes: typeof data.sizeBytes === "number" ? data.sizeBytes : 0,
        status: data.status === "uploaded" || data.status === "processing" || data.status === "ready" || data.status === "failed" || data.status === "archived" ? data.status : "uploaded",
        statusMessage: typeof data.statusMessage === "string" ? data.statusMessage : undefined,
        checksum: typeof data.checksum === "string" ? data.checksum : undefined,
        taxonomy: typeof data.taxonomy === "string" ? data.taxonomy : undefined,
        category: typeof data.category === "string" ? data.category : undefined,
        department: typeof data.department === "string" ? data.department : undefined,
        tags: toStringArray(data.tags),
        language: typeof data.language === "string" ? data.language : undefined,
        accessControl: toStringArray(data.accessControl),
        versionGroupId: typeof data.versionGroupId === "string" ? data.versionGroupId : documentId,
        versionNumber: typeof data.versionNumber === "number" ? data.versionNumber : 1,
        isLatest: typeof data.isLatest === "boolean" ? data.isLatest : true,
        updateLog: typeof data.updateLog === "string" ? data.updateLog : undefined,
        accountId: typeof data.accountId === "string" ? data.accountId : "",
        chunkCount: typeof data.chunkCount === "number" ? data.chunkCount : undefined,
        indexedAtISO: typeof data.indexedAtISO === "string" ? data.indexedAtISO : undefined,
        expiresAtISO: typeof data.expiresAtISO === "string" ? data.expiresAtISO : undefined,
        createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
        updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : ""
    };
}
class FirebaseRagDocumentRepository {
    async findByStoragePath(scope) {
        const snapshots = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])(buildKnowledgeDocumentsCollection({
            organizationId: scope.organizationId,
            workspaceId: scope.workspaceId
        }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("storagePath", "==", scope.storagePath), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["limit"])(1)));
        const [firstMatch] = snapshots.docs;
        if (!firstMatch) {
            return null;
        }
        return toRagDocumentRecord(firstMatch.id, firstMatch.data(), {
            organizationId: scope.organizationId,
            workspaceId: scope.workspaceId
        });
    }
    async findByWorkspace(scope) {
        const snapshots = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])(buildKnowledgeDocumentsCollection({
            organizationId: scope.organizationId,
            workspaceId: scope.workspaceId
        }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["orderBy"])("createdAtISO", "desc")));
        return snapshots.docs.map((docSnap)=>toRagDocumentRecord(docSnap.id, docSnap.data(), {
                organizationId: scope.organizationId,
                workspaceId: scope.workspaceId
            }));
    }
    async saveUploaded(record) {
        const documentRef = buildKnowledgeDocumentRef({
            organizationId: record.organizationId,
            workspaceId: record.workspaceId,
            documentId: record.id
        });
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])(documentRef, {
            // Duplicate the document id in the payload so collection-group consumers can project
            // a stable field without depending on Firestore snapshot metadata.
            id: record.id,
            organizationId: record.organizationId,
            workspaceId: record.workspaceId,
            displayName: record.displayName,
            title: record.title,
            sourceFileName: record.sourceFileName,
            mimeType: record.mimeType,
            storagePath: record.storagePath,
            sizeBytes: record.sizeBytes,
            status: record.status,
            ...record.statusMessage ? {
                statusMessage: record.statusMessage
            } : {},
            ...record.checksum ? {
                checksum: record.checksum
            } : {},
            ...record.taxonomy ? {
                taxonomy: record.taxonomy
            } : {},
            ...record.category ? {
                category: record.category
            } : {},
            ...record.department ? {
                department: record.department
            } : {},
            tags: record.tags ?? [],
            ...record.language ? {
                language: record.language
            } : {},
            accessControl: record.accessControl ?? [],
            versionGroupId: record.versionGroupId,
            versionNumber: record.versionNumber,
            isLatest: record.isLatest,
            ...record.updateLog ? {
                updateLog: record.updateLog
            } : {},
            accountId: record.accountId,
            ...record.chunkCount !== undefined ? {
                chunkCount: record.chunkCount
            } : {},
            ...record.indexedAtISO ? {
                indexedAtISO: record.indexedAtISO
            } : {},
            ...record.expiresAtISO ? {
                expiresAtISO: record.expiresAtISO
            } : {},
            createdAtISO: record.createdAtISO,
            updatedAtISO: record.updatedAtISO,
            createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/asset/interfaces/queries/file.queries.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getWorkspaceFiles",
    ()=>getWorkspaceFiles,
    "getWorkspaceRagDocuments",
    ()=>getWorkspaceRagDocuments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$domain$2f$services$2f$resolve$2d$file$2d$organization$2d$id$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/asset/domain/services/resolve-file-organization-id.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$application$2f$use$2d$cases$2f$list$2d$workspace$2d$files$2e$use$2d$case$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/asset/application/use-cases/list-workspace-files.use-case.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$infrastructure$2f$firebase$2f$FirebaseFileRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/asset/infrastructure/firebase/FirebaseFileRepository.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$infrastructure$2f$firebase$2f$FirebaseRagDocumentRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/asset/infrastructure/firebase/FirebaseRagDocumentRepository.ts [app-client] (ecmascript)");
;
;
;
;
async function getWorkspaceFiles(workspace) {
    const listWorkspaceFilesUseCase = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$application$2f$use$2d$cases$2f$list$2d$workspace$2d$files$2e$use$2d$case$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ListWorkspaceFilesUseCase"](new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$infrastructure$2f$firebase$2f$FirebaseFileRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FirebaseFileRepository"]());
    const organizationId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$domain$2f$services$2f$resolve$2d$file$2d$organization$2d$id$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveFileOrganizationId"])(workspace.accountType, workspace.accountId);
    return listWorkspaceFilesUseCase.execute({
        workspaceId: workspace.id,
        organizationId,
        actorAccountId: workspace.accountId
    });
}
async function getWorkspaceRagDocuments(workspace) {
    const organizationId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$domain$2f$services$2f$resolve$2d$file$2d$organization$2d$id$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveFileOrganizationId"])(workspace.accountType, workspace.accountId);
    const repo = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$infrastructure$2f$firebase$2f$FirebaseRagDocumentRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FirebaseRagDocumentRepository"]();
    return repo.findByWorkspace({
        organizationId,
        workspaceId: workspace.id
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/asset/interfaces/_actions/data:e32fc7 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "uploadCompleteFile",
    ()=>$$RSC_SERVER_ACTION_1
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"4067b68307f0349ed04dd488d1b366c69ee93db14d":"uploadCompleteFile"},"modules/asset/interfaces/_actions/file.actions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("4067b68307f0349ed04dd488d1b366c69ee93db14d", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "uploadCompleteFile");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vZmlsZS5hY3Rpb25zLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHNlcnZlclwiO1xyXG5cclxuaW1wb3J0IHR5cGUge1xyXG4gIFVwbG9hZENvbXBsZXRlRmlsZUlucHV0RHRvLFxyXG4gIFVwbG9hZENvbXBsZXRlRmlsZU91dHB1dER0byxcclxuICBVcGxvYWRJbml0RmlsZUlucHV0RHRvLFxyXG4gIFVwbG9hZEluaXRGaWxlT3V0cHV0RHRvLFxyXG59IGZyb20gXCIuLi8uLi9hcHBsaWNhdGlvbi9kdG8vZmlsZS5kdG9cIjtcclxuaW1wb3J0IHR5cGUge1xyXG4gIFJlZ2lzdGVyVXBsb2FkZWRSYWdEb2N1bWVudElucHV0RHRvLFxyXG4gIFJlZ2lzdGVyVXBsb2FkZWRSYWdEb2N1bWVudFJlc3VsdCxcclxufSBmcm9tIFwiLi4vLi4vYXBwbGljYXRpb24vZHRvL3JhZy1kb2N1bWVudC5kdG9cIjtcclxuaW1wb3J0IHsgUmVnaXN0ZXJVcGxvYWRlZFJhZ0RvY3VtZW50VXNlQ2FzZSB9IGZyb20gXCIuLi8uLi9hcHBsaWNhdGlvbi91c2UtY2FzZXMvcmVnaXN0ZXItdXBsb2FkZWQtcmFnLWRvY3VtZW50LnVzZS1jYXNlXCI7XHJcbmltcG9ydCB7IFVwbG9hZENvbXBsZXRlRmlsZVVzZUNhc2UgfSBmcm9tIFwiLi4vLi4vYXBwbGljYXRpb24vdXNlLWNhc2VzL3VwbG9hZC1jb21wbGV0ZS1maWxlLnVzZS1jYXNlXCI7XHJcbmltcG9ydCB7IFVwbG9hZEluaXRGaWxlVXNlQ2FzZSB9IGZyb20gXCIuLi8uLi9hcHBsaWNhdGlvbi91c2UtY2FzZXMvdXBsb2FkLWluaXQtZmlsZS51c2UtY2FzZVwiO1xyXG5pbXBvcnQgeyBGaXJlYmFzZUZpbGVSZXBvc2l0b3J5IH0gZnJvbSBcIi4uLy4uL2luZnJhc3RydWN0dXJlL2ZpcmViYXNlL0ZpcmViYXNlRmlsZVJlcG9zaXRvcnlcIjtcclxuaW1wb3J0IHsgRmlyZWJhc2VSYWdEb2N1bWVudFJlcG9zaXRvcnkgfSBmcm9tIFwiLi4vLi4vaW5mcmFzdHJ1Y3R1cmUvZmlyZWJhc2UvRmlyZWJhc2VSYWdEb2N1bWVudFJlcG9zaXRvcnlcIjtcclxuaW1wb3J0IHsgS25vd2xlZGdlSW5nZXN0aW9uQXBpIH0gZnJvbSBcIkAvbW9kdWxlcy9rbm93bGVkZ2UvYXBpXCI7XHJcbmltcG9ydCB0eXBlIHsgRmlsZUNvbW1hbmRSZXN1bHQgfSBmcm9tIFwiLi4vY29udHJhY3RzL2ZpbGUtY29tbWFuZC1yZXN1bHRcIjtcclxuXHJcbmNvbnN0IGtub3dsZWRnZUluZ2VzdGlvbkFwaSA9IG5ldyBLbm93bGVkZ2VJbmdlc3Rpb25BcGkoKTtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUNvbW1hbmRJZChpZGVtcG90ZW5jeUtleT86IHN0cmluZykge1xyXG4gIGNvbnN0IG5vcm1hbGl6ZWQgPSBpZGVtcG90ZW5jeUtleT8udHJpbSgpO1xyXG4gIGlmIChub3JtYWxpemVkKSB7XHJcbiAgICByZXR1cm4gbm9ybWFsaXplZDtcclxuICB9XHJcblxyXG4gIHJldHVybiBgZmlsZS11cGxvYWQtaW5pdC0ke2NyeXB0by5yYW5kb21VVUlEKCl9YDtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwbG9hZEluaXRGaWxlKFxyXG4gIGlucHV0OiBVcGxvYWRJbml0RmlsZUlucHV0RHRvLFxyXG4pOiBQcm9taXNlPEZpbGVDb21tYW5kUmVzdWx0PFVwbG9hZEluaXRGaWxlT3V0cHV0RHRvPj4ge1xyXG4gIGNvbnN0IGNvbW1hbmRJZCA9IGNyZWF0ZUNvbW1hbmRJZChpbnB1dC5pZGVtcG90ZW5jeUtleSk7XHJcbiAgY29uc3QgdXNlQ2FzZSA9IG5ldyBVcGxvYWRJbml0RmlsZVVzZUNhc2UobmV3IEZpcmViYXNlRmlsZVJlcG9zaXRvcnkoKSk7XHJcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdXNlQ2FzZS5leGVjdXRlKGlucHV0KTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIC4uLnJlc3VsdCxcclxuICAgIGNvbW1hbmRJZCxcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBsb2FkQ29tcGxldGVGaWxlKFxyXG4gIGlucHV0OiBVcGxvYWRDb21wbGV0ZUZpbGVJbnB1dER0byxcclxuKTogUHJvbWlzZTxGaWxlQ29tbWFuZFJlc3VsdDxVcGxvYWRDb21wbGV0ZUZpbGVPdXRwdXREdG8+PiB7XHJcbiAgY29uc3QgZmlsZVJlcG9zaXRvcnkgPSBuZXcgRmlyZWJhc2VGaWxlUmVwb3NpdG9yeSgpO1xyXG4gIGNvbnN0IHVzZUNhc2UgPSBuZXcgVXBsb2FkQ29tcGxldGVGaWxlVXNlQ2FzZShcclxuICAgIGZpbGVSZXBvc2l0b3J5LFxyXG4gICAgbmV3IEZpcmViYXNlUmFnRG9jdW1lbnRSZXBvc2l0b3J5KCksXHJcbiAgKTtcclxuICBjb25zdCBjb21tYW5kSWQgPSBjcmVhdGVDb21tYW5kSWQoaW5wdXQudmVyc2lvbklkKTtcclxuICBjb25zdCByZXN1bHQgPSBhd2FpdCB1c2VDYXNlLmV4ZWN1dGUoaW5wdXQpO1xyXG5cclxuICAvLyBCZXN0LWVmZm9ydCBoYW5kb2ZmOiB1cGxvYWQgY29tcGxldGlvbiBjYW4gcHJvY2VlZCBldmVuIGlmIGluZ2VzdGlvbiByZWdpc3RyYXRpb24gZmFpbHMuXHJcbiAgaWYgKHJlc3VsdC5vaykge1xyXG4gICAgY29uc3QgZmlsZSA9IGF3YWl0IGZpbGVSZXBvc2l0b3J5LmZpbmRCeUlkKGlucHV0LmZpbGVJZCk7XHJcblxyXG4gICAgY29uc3QgcmVnaXN0cmF0aW9uID0gYXdhaXQga25vd2xlZGdlSW5nZXN0aW9uQXBpLnJlZ2lzdGVyRG9jdW1lbnQoe1xyXG4gICAgICBvcmdhbml6YXRpb25JZDogaW5wdXQub3JnYW5pemF0aW9uSWQsXHJcbiAgICAgIHdvcmtzcGFjZUlkOiBpbnB1dC53b3Jrc3BhY2VJZCxcclxuICAgICAgc291cmNlRmlsZUlkOiBpbnB1dC5maWxlSWQsXHJcbiAgICAgIHRpdGxlOiBmaWxlPy5uYW1lID8/IGB1cGxvYWRlZC1maWxlLSR7aW5wdXQuZmlsZUlkfWAsXHJcbiAgICAgIG1pbWVUeXBlOiBmaWxlPy5taW1lVHlwZSA/PyBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiLFxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCFyZWdpc3RyYXRpb24ub2sgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybihcclxuICAgICAgICBcIlt1cGxvYWRDb21wbGV0ZUZpbGVdIEtub3dsZWRnZSBpbmdlc3Rpb24gcmVnaXN0cmF0aW9uIGZhaWxlZDpcIixcclxuICAgICAgICByZWdpc3RyYXRpb24uZXJyb3IuY29kZSxcclxuICAgICAgICByZWdpc3RyYXRpb24uZXJyb3IubWVzc2FnZSxcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICAuLi5yZXN1bHQsXHJcbiAgICBjb21tYW5kSWQsXHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlZ2lzdGVyVXBsb2FkZWRSYWdEb2N1bWVudChcclxuICBpbnB1dDogUmVnaXN0ZXJVcGxvYWRlZFJhZ0RvY3VtZW50SW5wdXREdG8sXHJcbik6IFByb21pc2U8UmVnaXN0ZXJVcGxvYWRlZFJhZ0RvY3VtZW50UmVzdWx0PiB7XHJcbiAgY29uc3QgdXNlQ2FzZSA9IG5ldyBSZWdpc3RlclVwbG9hZGVkUmFnRG9jdW1lbnRVc2VDYXNlKG5ldyBGaXJlYmFzZVJhZ0RvY3VtZW50UmVwb3NpdG9yeSgpKTtcclxuICBjb25zdCBjb21tYW5kSWQgPSBjcmVhdGVDb21tYW5kSWQoaW5wdXQuc3RvcmFnZVBhdGgpO1xyXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHVzZUNhc2UuZXhlY3V0ZShpbnB1dCk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICAuLi5yZXN1bHQsXHJcbiAgICBjb21tYW5kSWQsXHJcbiAgfTtcclxufVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IndUQTRDc0IsK0xBQUEifQ==
}),
"[project]/modules/asset/interfaces/_actions/data:067561 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "uploadInitFile",
    ()=>$$RSC_SERVER_ACTION_0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"40ae90a46eb874ae059c11615225a78d26448a3b54":"uploadInitFile"},"modules/asset/interfaces/_actions/file.actions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("40ae90a46eb874ae059c11615225a78d26448a3b54", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "uploadInitFile");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
 //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vZmlsZS5hY3Rpb25zLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHNlcnZlclwiO1xyXG5cclxuaW1wb3J0IHR5cGUge1xyXG4gIFVwbG9hZENvbXBsZXRlRmlsZUlucHV0RHRvLFxyXG4gIFVwbG9hZENvbXBsZXRlRmlsZU91dHB1dER0byxcclxuICBVcGxvYWRJbml0RmlsZUlucHV0RHRvLFxyXG4gIFVwbG9hZEluaXRGaWxlT3V0cHV0RHRvLFxyXG59IGZyb20gXCIuLi8uLi9hcHBsaWNhdGlvbi9kdG8vZmlsZS5kdG9cIjtcclxuaW1wb3J0IHR5cGUge1xyXG4gIFJlZ2lzdGVyVXBsb2FkZWRSYWdEb2N1bWVudElucHV0RHRvLFxyXG4gIFJlZ2lzdGVyVXBsb2FkZWRSYWdEb2N1bWVudFJlc3VsdCxcclxufSBmcm9tIFwiLi4vLi4vYXBwbGljYXRpb24vZHRvL3JhZy1kb2N1bWVudC5kdG9cIjtcclxuaW1wb3J0IHsgUmVnaXN0ZXJVcGxvYWRlZFJhZ0RvY3VtZW50VXNlQ2FzZSB9IGZyb20gXCIuLi8uLi9hcHBsaWNhdGlvbi91c2UtY2FzZXMvcmVnaXN0ZXItdXBsb2FkZWQtcmFnLWRvY3VtZW50LnVzZS1jYXNlXCI7XHJcbmltcG9ydCB7IFVwbG9hZENvbXBsZXRlRmlsZVVzZUNhc2UgfSBmcm9tIFwiLi4vLi4vYXBwbGljYXRpb24vdXNlLWNhc2VzL3VwbG9hZC1jb21wbGV0ZS1maWxlLnVzZS1jYXNlXCI7XHJcbmltcG9ydCB7IFVwbG9hZEluaXRGaWxlVXNlQ2FzZSB9IGZyb20gXCIuLi8uLi9hcHBsaWNhdGlvbi91c2UtY2FzZXMvdXBsb2FkLWluaXQtZmlsZS51c2UtY2FzZVwiO1xyXG5pbXBvcnQgeyBGaXJlYmFzZUZpbGVSZXBvc2l0b3J5IH0gZnJvbSBcIi4uLy4uL2luZnJhc3RydWN0dXJlL2ZpcmViYXNlL0ZpcmViYXNlRmlsZVJlcG9zaXRvcnlcIjtcclxuaW1wb3J0IHsgRmlyZWJhc2VSYWdEb2N1bWVudFJlcG9zaXRvcnkgfSBmcm9tIFwiLi4vLi4vaW5mcmFzdHJ1Y3R1cmUvZmlyZWJhc2UvRmlyZWJhc2VSYWdEb2N1bWVudFJlcG9zaXRvcnlcIjtcclxuaW1wb3J0IHsgS25vd2xlZGdlSW5nZXN0aW9uQXBpIH0gZnJvbSBcIkAvbW9kdWxlcy9rbm93bGVkZ2UvYXBpXCI7XHJcbmltcG9ydCB0eXBlIHsgRmlsZUNvbW1hbmRSZXN1bHQgfSBmcm9tIFwiLi4vY29udHJhY3RzL2ZpbGUtY29tbWFuZC1yZXN1bHRcIjtcclxuXHJcbmNvbnN0IGtub3dsZWRnZUluZ2VzdGlvbkFwaSA9IG5ldyBLbm93bGVkZ2VJbmdlc3Rpb25BcGkoKTtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUNvbW1hbmRJZChpZGVtcG90ZW5jeUtleT86IHN0cmluZykge1xyXG4gIGNvbnN0IG5vcm1hbGl6ZWQgPSBpZGVtcG90ZW5jeUtleT8udHJpbSgpO1xyXG4gIGlmIChub3JtYWxpemVkKSB7XHJcbiAgICByZXR1cm4gbm9ybWFsaXplZDtcclxuICB9XHJcblxyXG4gIHJldHVybiBgZmlsZS11cGxvYWQtaW5pdC0ke2NyeXB0by5yYW5kb21VVUlEKCl9YDtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwbG9hZEluaXRGaWxlKFxyXG4gIGlucHV0OiBVcGxvYWRJbml0RmlsZUlucHV0RHRvLFxyXG4pOiBQcm9taXNlPEZpbGVDb21tYW5kUmVzdWx0PFVwbG9hZEluaXRGaWxlT3V0cHV0RHRvPj4ge1xyXG4gIGNvbnN0IGNvbW1hbmRJZCA9IGNyZWF0ZUNvbW1hbmRJZChpbnB1dC5pZGVtcG90ZW5jeUtleSk7XHJcbiAgY29uc3QgdXNlQ2FzZSA9IG5ldyBVcGxvYWRJbml0RmlsZVVzZUNhc2UobmV3IEZpcmViYXNlRmlsZVJlcG9zaXRvcnkoKSk7XHJcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdXNlQ2FzZS5leGVjdXRlKGlucHV0KTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIC4uLnJlc3VsdCxcclxuICAgIGNvbW1hbmRJZCxcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBsb2FkQ29tcGxldGVGaWxlKFxyXG4gIGlucHV0OiBVcGxvYWRDb21wbGV0ZUZpbGVJbnB1dER0byxcclxuKTogUHJvbWlzZTxGaWxlQ29tbWFuZFJlc3VsdDxVcGxvYWRDb21wbGV0ZUZpbGVPdXRwdXREdG8+PiB7XHJcbiAgY29uc3QgZmlsZVJlcG9zaXRvcnkgPSBuZXcgRmlyZWJhc2VGaWxlUmVwb3NpdG9yeSgpO1xyXG4gIGNvbnN0IHVzZUNhc2UgPSBuZXcgVXBsb2FkQ29tcGxldGVGaWxlVXNlQ2FzZShcclxuICAgIGZpbGVSZXBvc2l0b3J5LFxyXG4gICAgbmV3IEZpcmViYXNlUmFnRG9jdW1lbnRSZXBvc2l0b3J5KCksXHJcbiAgKTtcclxuICBjb25zdCBjb21tYW5kSWQgPSBjcmVhdGVDb21tYW5kSWQoaW5wdXQudmVyc2lvbklkKTtcclxuICBjb25zdCByZXN1bHQgPSBhd2FpdCB1c2VDYXNlLmV4ZWN1dGUoaW5wdXQpO1xyXG5cclxuICAvLyBCZXN0LWVmZm9ydCBoYW5kb2ZmOiB1cGxvYWQgY29tcGxldGlvbiBjYW4gcHJvY2VlZCBldmVuIGlmIGluZ2VzdGlvbiByZWdpc3RyYXRpb24gZmFpbHMuXHJcbiAgaWYgKHJlc3VsdC5vaykge1xyXG4gICAgY29uc3QgZmlsZSA9IGF3YWl0IGZpbGVSZXBvc2l0b3J5LmZpbmRCeUlkKGlucHV0LmZpbGVJZCk7XHJcblxyXG4gICAgY29uc3QgcmVnaXN0cmF0aW9uID0gYXdhaXQga25vd2xlZGdlSW5nZXN0aW9uQXBpLnJlZ2lzdGVyRG9jdW1lbnQoe1xyXG4gICAgICBvcmdhbml6YXRpb25JZDogaW5wdXQub3JnYW5pemF0aW9uSWQsXHJcbiAgICAgIHdvcmtzcGFjZUlkOiBpbnB1dC53b3Jrc3BhY2VJZCxcclxuICAgICAgc291cmNlRmlsZUlkOiBpbnB1dC5maWxlSWQsXHJcbiAgICAgIHRpdGxlOiBmaWxlPy5uYW1lID8/IGB1cGxvYWRlZC1maWxlLSR7aW5wdXQuZmlsZUlkfWAsXHJcbiAgICAgIG1pbWVUeXBlOiBmaWxlPy5taW1lVHlwZSA/PyBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiLFxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCFyZWdpc3RyYXRpb24ub2sgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybihcclxuICAgICAgICBcIlt1cGxvYWRDb21wbGV0ZUZpbGVdIEtub3dsZWRnZSBpbmdlc3Rpb24gcmVnaXN0cmF0aW9uIGZhaWxlZDpcIixcclxuICAgICAgICByZWdpc3RyYXRpb24uZXJyb3IuY29kZSxcclxuICAgICAgICByZWdpc3RyYXRpb24uZXJyb3IubWVzc2FnZSxcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICAuLi5yZXN1bHQsXHJcbiAgICBjb21tYW5kSWQsXHJcbiAgfTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlZ2lzdGVyVXBsb2FkZWRSYWdEb2N1bWVudChcclxuICBpbnB1dDogUmVnaXN0ZXJVcGxvYWRlZFJhZ0RvY3VtZW50SW5wdXREdG8sXHJcbik6IFByb21pc2U8UmVnaXN0ZXJVcGxvYWRlZFJhZ0RvY3VtZW50UmVzdWx0PiB7XHJcbiAgY29uc3QgdXNlQ2FzZSA9IG5ldyBSZWdpc3RlclVwbG9hZGVkUmFnRG9jdW1lbnRVc2VDYXNlKG5ldyBGaXJlYmFzZVJhZ0RvY3VtZW50UmVwb3NpdG9yeSgpKTtcclxuICBjb25zdCBjb21tYW5kSWQgPSBjcmVhdGVDb21tYW5kSWQoaW5wdXQuc3RvcmFnZVBhdGgpO1xyXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHVzZUNhc2UuZXhlY3V0ZShpbnB1dCk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICAuLi5yZXN1bHQsXHJcbiAgICBjb21tYW5kSWQsXHJcbiAgfTtcclxufVxyXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Im9UQStCc0IsMkxBQUEifQ==
}),
"[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorkspaceFilesTab",
    ()=>WorkspaceFilesTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$storage$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/storage/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/storage/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$interfaces$2f$queries$2f$file$2e$queries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/asset/interfaces/queries/file.queries.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$domain$2f$services$2f$resolve$2d$file$2d$organization$2d$id$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/asset/domain/services/resolve-file-organization-id.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$interfaces$2f$_actions$2f$data$3a$e32fc7__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/modules/asset/interfaces/_actions/data:e32fc7 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$interfaces$2f$_actions$2f$data$3a$067561__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/modules/asset/interfaces/_actions/data:067561 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/integration-firebase/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/storage.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
function WorkspaceFilesTab({ workspace }) {
    _s();
    const [assets, setAssets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadState, setLoadState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("loading");
    const [uploadState, setUploadState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("idle");
    const [uploadMessage, setUploadMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const reloadFiles = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WorkspaceFilesTab.useCallback[reloadFiles]": async ()=>{
            setLoadState("loading");
            try {
                const nextAssets = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$interfaces$2f$queries$2f$file$2e$queries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWorkspaceFiles"])(workspace);
                setAssets(nextAssets);
                setLoadState("loaded");
            } catch (error) {
                if ("TURBOPACK compile-time truthy", 1) {
                    console.warn("[WorkspaceFilesTab] Failed to load file metadata:", error instanceof Error ? error.message : "unknown error");
                }
                setAssets([]);
                setLoadState("error");
            }
        }
    }["WorkspaceFilesTab.useCallback[reloadFiles]"], [
        workspace
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkspaceFilesTab.useEffect": ()=>{
            let cancelled = false;
            async function loadFiles() {
                await reloadFiles();
                if (cancelled) {
                    return;
                }
            }
            void loadFiles();
            return ({
                "WorkspaceFilesTab.useEffect": ()=>{
                    cancelled = true;
                }
            })["WorkspaceFilesTab.useEffect"];
        }
    }["WorkspaceFilesTab.useEffect"], [
        reloadFiles
    ]);
    async function handleUploadFile(file) {
        const organizationId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$domain$2f$services$2f$resolve$2d$file$2d$organization$2d$id$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveFileOrganizationId"])(workspace.accountType, workspace.accountId);
        setUploadState("uploading");
        setUploadMessage(null);
        try {
            const initResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$interfaces$2f$_actions$2f$data$3a$067561__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["uploadInitFile"])({
                workspaceId: workspace.id,
                organizationId,
                actorAccountId: workspace.accountId,
                fileName: file.name,
                mimeType: file.type || "application/octet-stream",
                sizeBytes: file.size
            });
            if (!initResult.ok) {
                setUploadState("error");
                setUploadMessage(`Upload initialization failed: ${initResult.error.message}`);
                return;
            }
            const storage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirebaseStorage"])();
            const storageRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ref"])(storage, initResult.data.uploadPath);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uploadBytes"])(storageRef, file, {
                contentType: file.type || "application/octet-stream"
            });
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDownloadURL"])(storageRef);
            const completeResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$interfaces$2f$_actions$2f$data$3a$e32fc7__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["uploadCompleteFile"])({
                workspaceId: workspace.id,
                organizationId,
                actorAccountId: workspace.accountId,
                fileId: initResult.data.fileId,
                versionId: initResult.data.versionId
            });
            if (!completeResult.ok) {
                setUploadState("error");
                setUploadMessage(`Upload completion failed: ${completeResult.error.message}`);
                return;
            }
            setUploadState("success");
            setUploadMessage(`Uploaded ${file.name}; document ${completeResult.data.ragDocumentId} is ${completeResult.data.ragDocumentStatus}.`);
            await reloadFiles();
        } catch (error) {
            if ("TURBOPACK compile-time truthy", 1) {
                console.warn("[WorkspaceFilesTab] Upload flow failed:", error);
            }
            setUploadState("error");
            setUploadMessage(error instanceof Error ? `Storage upload failed: ${error.message}` : "Storage upload failed unexpectedly.");
        }
    }
    const availableCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "WorkspaceFilesTab.useMemo[availableCount]": ()=>assets.filter({
                "WorkspaceFilesTab.useMemo[availableCount]": (asset)=>asset.status === "active"
            }["WorkspaceFilesTab.useMemo[availableCount]"]).length
    }["WorkspaceFilesTab.useMemo[availableCount]"], [
        assets
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        className: "border border-border/50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                        children: "Files"
                    }, void 0, false, {
                        fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                        children: "盤點目前已註冊或可立即導出的工作區資產，並提供 upload → storage → firestore 的完整流程入口。"
                    }, void 0, false, {
                        fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                        lineNumber: 141,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                lineNumber: 139,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-xl border border-border/40 px-4 py-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                htmlFor: "workspace-file-upload",
                                                className: "text-sm font-semibold text-foreground",
                                                children: "Upload file"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                                lineNumber: 149,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground",
                                                children: "This triggers upload-init, uploads binary to Storage, then writes completion + RAG registration to Firestore."
                                            }, void 0, false, {
                                                fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                                lineNumber: 152,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                        lineNumber: 148,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                        id: "workspace-file-upload",
                                        type: "file",
                                        className: "max-w-xs",
                                        disabled: uploadState === "uploading",
                                        onChange: (event)=>{
                                            const nextFile = event.target.files?.[0];
                                            if (!nextFile) {
                                                return;
                                            }
                                            void handleUploadFile(nextFile);
                                            event.currentTarget.value = "";
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                        lineNumber: 156,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                lineNumber: 147,
                                columnNumber: 11
                            }, this),
                            uploadMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `mt-3 text-xs ${uploadState === "error" ? "text-destructive" : "text-emerald-600"}`,
                                children: uploadMessage
                            }, void 0, false, {
                                fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                lineNumber: 173,
                                columnNumber: 13
                            }, this),
                            uploadState === "uploading" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-3 text-xs text-muted-foreground",
                                children: "Uploading and persisting metadata…"
                            }, void 0, false, {
                                fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                lineNumber: 182,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this),
                    loadState === "loading" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-muted-foreground",
                        children: "Loading file metadata…"
                    }, void 0, false, {
                        fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                        lineNumber: 187,
                        columnNumber: 11
                    }, this),
                    loadState === "error" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-destructive",
                        children: "無法載入已持久化的檔案資料，請稍後再試。"
                    }, void 0, false, {
                        fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                        lineNumber: 191,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid gap-3 sm:grid-cols-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-border/40 px-4 py-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: "Registered assets"
                                    }, void 0, false, {
                                        fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                        lineNumber: 198,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-xl font-semibold",
                                        children: assets.length
                                    }, void 0, false, {
                                        fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                        lineNumber: 199,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                lineNumber: 197,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-border/40 px-4 py-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: "Directly available"
                                    }, void 0, false, {
                                        fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                        lineNumber: 202,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-xl font-semibold",
                                        children: availableCount
                                    }, void 0, false, {
                                        fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                        lineNumber: 203,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                lineNumber: 201,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-border/40 px-4 py-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: "Derived manifests"
                                    }, void 0, false, {
                                        fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                        lineNumber: 206,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-1 text-xl font-semibold",
                                        children: assets.length - availableCount
                                    }, void 0, false, {
                                        fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                        lineNumber: 207,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                lineNumber: 205,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                        lineNumber: 196,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: [
                            loadState === "loaded" && assets.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-dashed border-border/40 px-4 py-6 text-sm text-muted-foreground",
                                children: "尚未有持久化的檔案紀錄，後續 upload-init 流程會先在此建立 metadata。"
                            }, void 0, false, {
                                fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                lineNumber: 213,
                                columnNumber: 13
                            }, this),
                            assets.map((asset)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-xl border border-border/40 px-4 py-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-wrap items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm font-semibold text-foreground",
                                                                children: asset.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                                                lineNumber: 223,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                variant: asset.status === "active" ? "secondary" : "outline",
                                                                children: asset.status
                                                            }, void 0, false, {
                                                                fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                                                lineNumber: 224,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                variant: "outline",
                                                                children: asset.kind
                                                            }, void 0, false, {
                                                                fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                                                lineNumber: 227,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                                        lineNumber: 222,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-muted-foreground",
                                                        children: asset.detail
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                                        lineNumber: 229,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                                lineNumber: 221,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-muted-foreground sm:text-right",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: [
                                                            "Source: ",
                                                            asset.source
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                                        lineNumber: 232,
                                                        columnNumber: 19
                                                    }, this),
                                                    asset.href && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        asChild: true,
                                                        variant: "link",
                                                        className: "mt-1 inline-flex h-auto p-0 text-xs",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            href: asset.href,
                                                            target: "_blank",
                                                            rel: "noreferrer",
                                                            children: "Open asset"
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                                            lineNumber: 235,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                                        lineNumber: 234,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                                lineNumber: 231,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                        lineNumber: 220,
                                        columnNumber: 15
                                    }, this)
                                }, asset.id, false, {
                                    fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                                    lineNumber: 219,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                        lineNumber: 211,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx",
        lineNumber: 138,
        columnNumber: 5
    }, this);
}
_s(WorkspaceFilesTab, "qlAsAERIEw9UmyFxqGMGbJnDSyA=");
_c = WorkspaceFilesTab;
var _c;
__turbopack_context__.k.register(_c, "WorkspaceFilesTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AssetDocumentsView",
    ()=>AssetDocumentsView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-up.js [app-client] (ecmascript) <export default as FileUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.js [app-client] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$app$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/providers/app-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/firestore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/storage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$interfaces$2f$hooks$2f$useDocumentsSnapshot$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/asset/interfaces/hooks/useDocumentsSnapshot.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
const UPLOAD_BUCKET = "xuanwu-i-00708880-4e2d8.firebasestorage.app";
const WATCH_PATH = "uploads/";
const ACCEPTED_MIME = {
    "application/pdf": ".pdf",
    "image/tiff": ".tif/.tiff",
    "image/png": ".png",
    "image/jpeg": ".jpg/.jpeg"
};
const ACCEPTED_EXTS = Object.values(ACCEPTED_MIME).join(", ");
function StatusBadge({ doc }) {
    if (doc.status === "completed") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
            variant: "outline",
            className: "gap-1 border-emerald-500/40 bg-emerald-500/10 text-emerald-700",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                    className: "size-3"
                }, void 0, false, {
                    fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                    lineNumber: 38,
                    columnNumber: 9
                }, this),
                " ✓ ready"
            ]
        }, void 0, true, {
            fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
            lineNumber: 37,
            columnNumber: 7
        }, this);
    }
    if (doc.status === "processing") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
            variant: "outline",
            className: "gap-1 border-blue-500/40 bg-blue-500/10 text-blue-700",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                    className: "size-3 animate-spin"
                }, void 0, false, {
                    fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, this),
                " ⏳ processing"
            ]
        }, void 0, true, {
            fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
            lineNumber: 44,
            columnNumber: 7
        }, this);
    }
    if (doc.status === "error") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
            variant: "outline",
            className: "gap-1 border-destructive/40 bg-destructive/10 text-destructive",
            title: doc.errorMessage || "未知錯誤",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                    className: "size-3"
                }, void 0, false, {
                    fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, this),
                " ✗ error"
            ]
        }, void 0, true, {
            fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
            lineNumber: 51,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
        variant: "outline",
        children: doc.status || "unknown"
    }, void 0, false, {
        fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
        lineNumber: 60,
        columnNumber: 10
    }, this);
}
_c = StatusBadge;
function RagBadge({ doc }) {
    if (doc.ragStatus === "ready") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
            variant: "outline",
            className: "gap-1 border-emerald-500/40 bg-emerald-500/10 text-emerald-700",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                    className: "size-3"
                }, void 0, false, {
                    fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                    lineNumber: 67,
                    columnNumber: 9
                }, this),
                " indexed"
            ]
        }, void 0, true, {
            fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
            lineNumber: 66,
            columnNumber: 7
        }, this);
    }
    if (doc.ragStatus === "error") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
            variant: "outline",
            className: "gap-1 border-destructive/40 bg-destructive/10 text-destructive",
            title: doc.ragError || "未知錯誤",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                    className: "size-3"
                }, void 0, false, {
                    fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                    lineNumber: 78,
                    columnNumber: 9
                }, this),
                " rag error"
            ]
        }, void 0, true, {
            fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
            lineNumber: 73,
            columnNumber: 7
        }, this);
    }
    if (doc.ragStatus) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
            variant: "outline",
            className: "gap-1 border-blue-500/40 bg-blue-500/10 text-blue-700",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                    className: "size-3 animate-spin"
                }, void 0, false, {
                    fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                    lineNumber: 85,
                    columnNumber: 9
                }, this),
                " ",
                doc.ragStatus
            ]
        }, void 0, true, {
            fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
            lineNumber: 84,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "text-xs text-muted-foreground",
        children: "-"
    }, void 0, false, {
        fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
        lineNumber: 89,
        columnNumber: 10
    }, this);
}
_c1 = RagBadge;
function formatDate(value) {
    if (!value) return "-";
    return value.toLocaleString("zh-TW", {
        hour12: false
    });
}
function AssetDocumentsView({ workspaceId }) {
    _s();
    const { state: appState } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$app$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"])();
    const activeAccountId = appState.activeAccount?.id ?? "";
    const effectiveWorkspaceId = workspaceId?.trim() ?? "";
    const { docs, loading, pendingDocs, addPending } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$interfaces$2f$hooks$2f$useDocumentsSnapshot$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDocumentsSnapshot"])(activeAccountId, effectiveWorkspaceId || undefined);
    const [selectedFile, setSelectedFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [uploading, setUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [dragging, setDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [deletingId, setDeletingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [renamingId, setRenamingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const allDocs = [
        ...pendingDocs,
        ...docs.filter((d)=>!pendingDocs.some((p)=>p.id === d.id))
    ].sort((a, b)=>(b.uploadedAt?.getTime() ?? 0) - (a.uploadedAt?.getTime() ?? 0));
    function handleFileChange(file) {
        if (!file) {
            setSelectedFile(null);
            return;
        }
        if (!(file.type in ACCEPTED_MIME)) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`僅支援 ${ACCEPTED_EXTS}`);
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }
        setSelectedFile(file);
    }
    async function handleUpload() {
        if (!selectedFile) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("請先選擇檔案");
            return;
        }
        if (!activeAccountId) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("目前沒有 active account，無法上傳");
            return;
        }
        const ext = selectedFile.name.includes(".") ? `.${selectedFile.name.split(".").pop() ?? ""}` : "";
        const docId = crypto.randomUUID();
        const uploadPath = `${WATCH_PATH}${activeAccountId}/${docId}${ext}`;
        setUploading(true);
        addPending({
            id: docId,
            filename: selectedFile.name,
            workspaceId: effectiveWorkspaceId,
            sourceGcsUri: `gs://${UPLOAD_BUCKET}/${uploadPath}`,
            jsonGcsUri: "",
            pageCount: 0,
            status: "processing",
            ragStatus: "",
            uploadedAt: new Date(),
            errorMessage: "",
            ragError: "",
            isClientPending: true
        });
        try {
            const storage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirebaseStorage"])(UPLOAD_BUCKET);
            const fileRef = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["storageApi"].ref(storage, uploadPath);
            const customMetadata = {
                account_id: activeAccountId,
                filename: selectedFile.name,
                original_filename: selectedFile.name,
                display_name: selectedFile.name
            };
            if (effectiveWorkspaceId) customMetadata.workspace_id = effectiveWorkspaceId;
            await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["storageApi"].uploadBytes(fileRef, selectedFile, {
                customMetadata
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("上傳成功，背景已開始解析與入庫");
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.error(error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("上傳失敗");
        } finally{
            setUploading(false);
        }
    }
    async function handleDelete(doc) {
        if (!activeAccountId) return;
        if (!window.confirm(`確定刪除「${doc.filename}」？此動作無法復原。`)) return;
        setDeletingId(doc.id);
        try {
            const storage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirebaseStorage"])(UPLOAD_BUCKET);
            for (const uri of [
                doc.sourceGcsUri,
                doc.jsonGcsUri
            ].filter(Boolean)){
                try {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["storageApi"].deleteObject(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["storageApi"].ref(storage, uri));
                } catch  {}
            }
            const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirebaseFirestore"])();
            await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firestoreApi"].deleteDoc(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firestoreApi"].doc(db, "accounts", activeAccountId, "documents", doc.id));
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("文件已刪除");
        } catch (error) {
            console.error(error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("刪除失敗");
        } finally{
            setDeletingId(null);
        }
    }
    async function handleRename(doc) {
        if (!activeAccountId) return;
        const nextName = window.prompt("請輸入新檔名", doc.filename)?.trim() ?? "";
        if (!nextName || nextName === doc.filename) return;
        setRenamingId(doc.id);
        try {
            const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirebaseFirestore"])();
            await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firestoreApi"].updateDoc(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firestoreApi"].doc(db, "accounts", activeAccountId, "documents", doc.id), {
                title: nextName,
                "source.filename": nextName,
                "metadata.filename": nextName,
                updatedAt: __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firestoreApi"].serverTimestamp()
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("文件名稱已更新");
        } catch (error) {
            console.error(error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("更名失敗");
        } finally{
            setRenamingId(null);
        }
    }
    async function handleViewOriginal(doc) {
        if (!doc.sourceGcsUri) return;
        try {
            const storage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirebaseStorage"])(UPLOAD_BUCKET);
            const url = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["storageApi"].getDownloadURL(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$storage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["storageApi"].ref(storage, doc.sourceGcsUri));
            window.open(url, "_blank", "noopener,noreferrer");
        } catch (error) {
            console.error(error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("無法開啟原始檔");
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                children: "Upload File"
                            }, void 0, false, {
                                fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                lineNumber: 242,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                children: effectiveWorkspaceId ? `拖曳或選擇檔案上傳到 workspace：${effectiveWorkspaceId}` : "拖曳或選擇檔案上傳到 account scope；workspace 視角為選填。"
                            }, void 0, false, {
                                fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                lineNumber: 243,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                        lineNumber: 241,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                onDragOver: (e)=>{
                                    e.preventDefault();
                                    setDragging(true);
                                },
                                onDragLeave: ()=>setDragging(false),
                                onDrop: (e)=>{
                                    e.preventDefault();
                                    setDragging(false);
                                    handleFileChange(e.dataTransfer.files?.[0] ?? null);
                                },
                                className: `flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-6 transition ${dragging ? "border-primary/60 bg-primary/10" : "border-border/70 bg-muted/10 hover:border-primary/40"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileUp$3e$__["FileUp"], {
                                        className: "size-7 text-muted-foreground"
                                    }, void 0, false, {
                                        fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                        lineNumber: 260,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium",
                                                children: selectedFile ? selectedFile.name : "點擊或拖曳上傳"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                lineNumber: 262,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground",
                                                children: [
                                                    "支援：",
                                                    ACCEPTED_EXTS
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                lineNumber: 265,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                        lineNumber: 261,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        ref: fileInputRef,
                                        type: "file",
                                        accept: Object.keys(ACCEPTED_MIME).join(","),
                                        className: "sr-only",
                                        onChange: (e)=>handleFileChange(e.target.files?.[0] ?? null)
                                    }, void 0, false, {
                                        fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                        lineNumber: 267,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                lineNumber: 250,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: ()=>void handleUpload(),
                                        disabled: uploading || !selectedFile || !activeAccountId,
                                        children: [
                                            uploading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                className: "mr-2 size-4 animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                lineNumber: 280,
                                                columnNumber: 29
                                            }, this),
                                            uploading ? "上傳中..." : "上傳並啟動解析"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                        lineNumber: 276,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        onClick: ()=>{
                                            setSelectedFile(null);
                                            if (fileInputRef.current) fileInputRef.current.value = "";
                                        },
                                        disabled: uploading,
                                        children: "清除"
                                    }, void 0, false, {
                                        fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                        lineNumber: 283,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                lineNumber: 275,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                        lineNumber: 249,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                lineNumber: 240,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                children: "文件列表"
                            }, void 0, false, {
                                fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                lineNumber: 297,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                children: [
                                    effectiveWorkspaceId ? `workspace: ${effectiveWorkspaceId} — ${allDocs.length} 筆` : `account 全覽 — ${allDocs.length} 筆`,
                                    "（即時更新）"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                lineNumber: 298,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                        lineNumber: 296,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "overflow-x-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "w-full min-w-[640px] text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "border-b border-border/60 bg-muted/40",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-3 py-2 text-left text-xs font-medium text-muted-foreground",
                                                    children: "檔名"
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                    lineNumber: 310,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-3 py-2 text-left text-xs font-medium text-muted-foreground",
                                                    children: "狀態"
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                    lineNumber: 311,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-3 py-2 text-left text-xs font-medium text-muted-foreground",
                                                    children: "RAG"
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                    lineNumber: 312,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-3 py-2 text-left text-xs font-medium text-muted-foreground",
                                                    children: "上傳時間"
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                    lineNumber: 313,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-3 py-2 text-right text-xs font-medium text-muted-foreground",
                                                    children: "操作"
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                    lineNumber: 314,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                            lineNumber: 309,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                        lineNumber: 308,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        children: loading && allDocs.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                colSpan: 5,
                                                className: "px-3 py-8 text-center text-sm text-muted-foreground",
                                                children: "讀取中..."
                                            }, void 0, false, {
                                                fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                lineNumber: 320,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                            lineNumber: 319,
                                            columnNumber: 19
                                        }, this) : allDocs.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                colSpan: 5,
                                                className: "px-3 py-8 text-center text-sm text-muted-foreground",
                                                children: "目前沒有文件，試著上傳第一份檔案 ↑"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                lineNumber: 326,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                            lineNumber: 325,
                                            columnNumber: 19
                                        }, this) : allDocs.map((doc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: "border-b border-border/40 last:border-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-3 py-2.5",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "truncate font-medium text-foreground",
                                                            title: doc.filename,
                                                            children: [
                                                                doc.filename,
                                                                doc.isClientPending && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "ml-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-700",
                                                                    children: "pending"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                                    lineNumber: 337,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                            lineNumber: 334,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                        lineNumber: 333,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-3 py-2.5",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusBadge, {
                                                            doc: doc
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                            lineNumber: 344,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                        lineNumber: 343,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-3 py-2.5",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RagBadge, {
                                                            doc: doc
                                                        }, void 0, false, {
                                                            fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                            lineNumber: 347,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                        lineNumber: 346,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-3 py-2.5 text-xs text-muted-foreground",
                                                        children: formatDate(doc.uploadedAt)
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                        lineNumber: 349,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-3 py-2.5",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-end gap-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>void handleViewOriginal(doc),
                                                                    disabled: !doc.sourceGcsUri,
                                                                    title: "查看原始檔案",
                                                                    className: "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-30",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                                        className: "size-3.5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                                        lineNumber: 361,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                                    lineNumber: 354,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>void handleRename(doc),
                                                                    disabled: renamingId === doc.id,
                                                                    title: "更名",
                                                                    className: "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-30",
                                                                    children: renamingId === doc.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                        className: "size-3.5 animate-spin"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                                        lineNumber: 371,
                                                                        columnNumber: 31
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                                                                        className: "size-3.5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                                        lineNumber: 373,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                                    lineNumber: 363,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>void handleDelete(doc),
                                                                    disabled: deletingId === doc.id,
                                                                    title: "刪除",
                                                                    className: "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-30",
                                                                    children: deletingId === doc.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                        className: "size-3.5 animate-spin"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                                        lineNumber: 384,
                                                                        columnNumber: 31
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                        className: "size-3.5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                                        lineNumber: 386,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                                    lineNumber: 376,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                            lineNumber: 353,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                        lineNumber: 352,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, doc.id, true, {
                                                fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                                lineNumber: 332,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                        lineNumber: 317,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                                lineNumber: 307,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                            lineNumber: 306,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                        lineNumber: 305,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
                lineNumber: 295,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx",
        lineNumber: 238,
        columnNumber: 5
    }, this);
}
_s(AssetDocumentsView, "SkfgEi2PGNfjnvUFCSblnQoeoSM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$app$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"],
        __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$interfaces$2f$hooks$2f$useDocumentsSnapshot$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDocumentsSnapshot"]
    ];
});
_c2 = AssetDocumentsView;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "StatusBadge");
__turbopack_context__.k.register(_c1, "RagBadge");
__turbopack_context__.k.register(_c2, "AssetDocumentsView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/asset/interfaces/components/LibrariesView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LibrariesView",
    ()=>LibrariesView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/wiki-beta/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$application$2f$use$2d$cases$2f$wiki$2d$beta$2d$libraries$2e$use$2d$case$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/wiki-beta/application/use-cases/wiki-beta-libraries.use-case.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const FIELD_TYPES = [
    "title",
    "text",
    "number",
    "select",
    "relation"
];
function isRecord(value) {
    return typeof value === "object" && value !== null;
}
function parseFieldType(value) {
    if (value === "title") return "title";
    if (value === "text") return "text";
    if (value === "number") return "number";
    if (value === "select") return "select";
    if (value === "relation") return "relation";
    return "text";
}
function LibrariesView({ accountId, workspaceId }) {
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [libraries, setLibraries] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedLibraryId, setSelectedLibraryId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [fieldsPreview, setFieldsPreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [rowsPreview, setRowsPreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [libraryName, setLibraryName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [fieldKey, setFieldKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [fieldLabel, setFieldLabel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [fieldType, setFieldType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("text");
    const [rowJson, setRowJson] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('{"title":"New record"}');
    const selectedLibrary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LibrariesView.useMemo[selectedLibrary]": ()=>libraries.find({
                "LibrariesView.useMemo[selectedLibrary]": (library)=>library.id === selectedLibraryId
            }["LibrariesView.useMemo[selectedLibrary]"]) ?? null
    }["LibrariesView.useMemo[selectedLibrary]"], [
        libraries,
        selectedLibraryId
    ]);
    const refreshLibraries = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LibrariesView.useCallback[refreshLibraries]": async ()=>{
            setLoading(true);
            setError(null);
            try {
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$application$2f$use$2d$cases$2f$wiki$2d$beta$2d$libraries$2e$use$2d$case$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["listWikiBetaLibraries"])(accountId, workspaceId);
                setLibraries(result);
                if (!selectedLibraryId && result.length > 0) {
                    setSelectedLibraryId(result[0].id);
                }
                if (result.length === 0) {
                    setSelectedLibraryId("");
                }
            } catch (e) {
                setError(e instanceof Error ? e.message : "failed to list libraries");
            } finally{
                setLoading(false);
            }
        }
    }["LibrariesView.useCallback[refreshLibraries]"], [
        accountId,
        selectedLibraryId,
        workspaceId
    ]);
    const refreshSelectedSnapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LibrariesView.useCallback[refreshSelectedSnapshot]": async ()=>{
            if (!selectedLibraryId) {
                setFieldsPreview([]);
                setRowsPreview([]);
                return;
            }
            try {
                const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$application$2f$use$2d$cases$2f$wiki$2d$beta$2d$libraries$2e$use$2d$case$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWikiBetaLibrarySnapshot"])(accountId, selectedLibraryId);
                setFieldsPreview(snapshot.fields.map({
                    "LibrariesView.useCallback[refreshSelectedSnapshot]": (field)=>({
                            key: field.key,
                            label: field.label,
                            type: field.type
                        })
                }["LibrariesView.useCallback[refreshSelectedSnapshot]"]));
                setRowsPreview(snapshot.rows);
            } catch (e) {
                setError(e instanceof Error ? e.message : "failed to load library snapshot");
            }
        }
    }["LibrariesView.useCallback[refreshSelectedSnapshot]"], [
        accountId,
        selectedLibraryId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LibrariesView.useEffect": ()=>{
            void refreshLibraries();
        }
    }["LibrariesView.useEffect"], [
        refreshLibraries
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LibrariesView.useEffect": ()=>{
            void refreshSelectedSnapshot();
        }
    }["LibrariesView.useEffect"], [
        refreshSelectedSnapshot
    ]);
    const handleCreateLibrary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LibrariesView.useCallback[handleCreateLibrary]": async ()=>{
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$application$2f$use$2d$cases$2f$wiki$2d$beta$2d$libraries$2e$use$2d$case$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createWikiBetaLibrary"])({
                    accountId,
                    workspaceId,
                    name: libraryName
                });
                setLibraryName("");
                await refreshLibraries();
            } catch (e) {
                setError(e instanceof Error ? e.message : "failed to create library");
            }
        }
    }["LibrariesView.useCallback[handleCreateLibrary]"], [
        accountId,
        libraryName,
        refreshLibraries,
        workspaceId
    ]);
    const handleAddField = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LibrariesView.useCallback[handleAddField]": async ()=>{
            if (!selectedLibraryId) return;
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$application$2f$use$2d$cases$2f$wiki$2d$beta$2d$libraries$2e$use$2d$case$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addWikiBetaLibraryField"])({
                    accountId,
                    libraryId: selectedLibraryId,
                    key: fieldKey,
                    label: fieldLabel,
                    type: fieldType
                });
                setFieldKey("");
                setFieldLabel("");
                await refreshSelectedSnapshot();
            } catch (e) {
                setError(e instanceof Error ? e.message : "failed to add field");
            }
        }
    }["LibrariesView.useCallback[handleAddField]"], [
        accountId,
        fieldKey,
        fieldLabel,
        fieldType,
        refreshSelectedSnapshot,
        selectedLibraryId
    ]);
    const handleCreateRow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "LibrariesView.useCallback[handleCreateRow]": async ()=>{
            if (!selectedLibraryId) return;
            try {
                const parsed = JSON.parse(rowJson);
                if (!isRecord(parsed)) {
                    throw new Error("row JSON must be an object");
                }
                const values = parsed;
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$application$2f$use$2d$cases$2f$wiki$2d$beta$2d$libraries$2e$use$2d$case$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createWikiBetaLibraryRow"])({
                    accountId,
                    libraryId: selectedLibraryId,
                    values
                });
                await refreshSelectedSnapshot();
            } catch (e) {
                setError(e instanceof Error ? e.message : "failed to create row");
            }
        }
    }["LibrariesView.useCallback[handleCreateRow]"], [
        accountId,
        refreshSelectedSnapshot,
        rowJson,
        selectedLibraryId
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-4 rounded-xl border border-border/60 bg-card p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs font-semibold uppercase tracking-widest text-primary",
                        children: "Libraries MVP"
                    }, void 0, false, {
                        fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                        lineNumber: 150,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mt-2 text-xl font-semibold text-foreground",
                        children: "Notion-like Structured Data"
                    }, void 0, false, {
                        fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 max-w-3xl text-sm text-muted-foreground",
                        children: "對齊命名：Database/Data Source 在產品層統一為 Libraries。MVP 支援建立 library、定義 fields、建立 rows。"
                    }, void 0, false, {
                        fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                lineNumber: 149,
                columnNumber: 7
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 text-sm text-muted-foreground",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                        className: "size-4 animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                        lineNumber: 159,
                        columnNumber: 11
                    }, this),
                    "載入 libraries 中..."
                ]
            }, void 0, true, {
                fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                lineNumber: 158,
                columnNumber: 9
            }, this) : null,
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive",
                children: error
            }, void 0, false, {
                fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                lineNumber: 165,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-2 rounded-lg border border-border/60 bg-muted/20 p-3 md:grid-cols-[1fr_auto]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: libraryName,
                        onChange: (event)=>setLibraryName(event.target.value),
                        placeholder: "Library name",
                        className: "h-9 rounded-md border border-border/60 bg-background px-3 text-sm outline-none focus:border-primary/40"
                    }, void 0, false, {
                        fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>void handleCreateLibrary(),
                        className: "h-9 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90",
                        children: "建立 Library"
                    }, void 0, false, {
                        fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                lineNumber: 168,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-4 lg:grid-cols-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3 rounded-lg border border-border/60 bg-muted/20 p-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-semibold text-foreground",
                                children: "Libraries"
                            }, void 0, false, {
                                fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                                lineNumber: 187,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: selectedLibraryId,
                                onChange: (event)=>setSelectedLibraryId(event.target.value),
                                className: "h-9 w-full rounded-md border border-border/60 bg-background px-2 text-sm",
                                "aria-label": "Select library",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "Select library"
                                    }, void 0, false, {
                                        fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                                        lineNumber: 195,
                                        columnNumber: 13
                                    }, this),
                                    libraries.map((library)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: library.id,
                                            children: [
                                                library.name,
                                                " (",
                                                library.slug,
                                                ")"
                                            ]
                                        }, library.id, true, {
                                            fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                                            lineNumber: 197,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                                lineNumber: 189,
                                columnNumber: 11
                            }, this),
                            selectedLibrary ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-muted-foreground",
                                children: [
                                    selectedLibrary.name,
                                    " / ",
                                    selectedLibrary.slug
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                                lineNumber: 204,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-muted-foreground",
                                children: "請先建立或選擇一個 library。"
                            }, void 0, false, {
                                fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                                lineNumber: 206,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
                                        children: "Fields"
                                    }, void 0, false, {
                                        fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                                        lineNumber: 210,
                                        columnNumber: 13
                                    }, this),
                                    fieldsPreview.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: "尚無欄位"
                                    }, void 0, false, {
                                        fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                                        lineNumber: 212,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "space-y-1 text-xs text-muted-foreground",
                                        children: fieldsPreview.map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "rounded border border-border/60 bg-background px-2 py-1",
                                                children: [
                                                    field.label,
                                                    " (",
                                                    field.key,
                                                    ") - ",
                                                    field.type
                                                ]
                                            }, field.key, true, {
                                                fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                                                lineNumber: 216,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                                        lineNumber: 214,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                                lineNumber: 209,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                        lineNumber: 186,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3 rounded-lg border border-border/60 bg-muted/20 p-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-sm font-semibold text-foreground",
                                children: "Add Field / Add Row"
                            }, void 0, false, {
                                fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                                lineNumber: 226,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid gap-2 md:grid-cols-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: fieldKey,
                                        onChange: (event)=>setFieldKey(event.target.value),
                                        placeholder: "field key",
                                        className: "h-9 rounded-md border border-border/60 bg-background px-3 text-sm"
                                    }, void 0, false, {
                                        fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                                        lineNumber: 229,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: fieldLabel,
                                        onChange: (event)=>setFieldLabel(event.target.value),
                                        placeholder: "field label",
                                        className: "h-9 rounded-md border border-border/60 bg-background px-3 text-sm"
                                    }, void 0, false, {
                                        fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                                        lineNumber: 236,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                                lineNumber: 228,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: fieldType,
                                        onChange: (event)=>setFieldType(parseFieldType(event.target.value)),
                                        className: "h-9 rounded-md border border-border/60 bg-background px-2 text-sm",
                                        children: FIELD_TYPES.map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: type,
                                                children: type
                                            }, type, false, {
                                                fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                                                lineNumber: 252,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                                        lineNumber: 246,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>void handleAddField(),
                                        className: "h-9 rounded-md border border-border/60 bg-background px-3 text-sm text-muted-foreground hover:text-foreground",
                                        children: "新增欄位"
                                    }, void 0, false, {
                                        fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                                        lineNumber: 257,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                                lineNumber: 245,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                value: rowJson,
                                onChange: (event)=>setRowJson(event.target.value),
                                className: "min-h-24 w-full rounded-md border border-border/60 bg-background px-3 py-2 text-xs",
                                placeholder: '{"title":"My record"}'
                            }, void 0, false, {
                                fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                                lineNumber: 266,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>void handleCreateRow(),
                                className: "h-9 rounded-md border border-border/60 bg-background px-3 text-sm text-muted-foreground hover:text-foreground",
                                children: "建立 Row"
                            }, void 0, false, {
                                fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                                lineNumber: 273,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground",
                                        children: "Rows Preview"
                                    }, void 0, false, {
                                        fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                                        lineNumber: 282,
                                        columnNumber: 13
                                    }, this),
                                    rowsPreview.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: "尚無資料列"
                                    }, void 0, false, {
                                        fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                                        lineNumber: 284,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                        className: "space-y-1 text-xs text-muted-foreground",
                                        children: rowsPreview.slice(0, 5).map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                className: "rounded border border-border/60 bg-background px-2 py-1",
                                                children: JSON.stringify(row.values)
                                            }, row.id, false, {
                                                fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                                                lineNumber: 288,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                                        lineNumber: 286,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                                lineNumber: 281,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                        lineNumber: 225,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
                lineNumber: 185,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/modules/asset/interfaces/components/LibrariesView.tsx",
        lineNumber: 148,
        columnNumber: 5
    }, this);
}
_s(LibrariesView, "CH9Qk3xa/YHj5XvELCqtjL1uD5U=");
_c = LibrariesView;
var _c;
__turbopack_context__.k.register(_c, "LibrariesView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/asset/interfaces/components/LibraryTableView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LibraryTableView",
    ()=>LibraryTableView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/grip-vertical.js [app-client] (ecmascript) <export default as GripVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$lib$2d$tanstack$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/lib-tanstack/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$table$2d$core$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/table-core/build/lib/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$table$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-table/build/lib/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$lib$2d$dragdrop$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/lib-dragdrop/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$adapter$2f$element$2d$adapter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@atlaskit/pragmatic-drag-and-drop/dist/esm/adapter/element-adapter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/wiki-beta/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$application$2f$use$2d$cases$2f$wiki$2d$beta$2d$libraries$2e$use$2d$case$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/wiki-beta/application/use-cases/wiki-beta-libraries.use-case.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const columnHelper = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$table$2d$core$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createColumnHelper"])();
function LibraryTableView({ accountId, workspaceId }) {
    _s();
    const [libraries, setLibraries] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedId, setSelectedId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [fieldKeys, setFieldKeys] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [rows, setRows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Load library list
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LibraryTableView.useEffect": ()=>{
            void ({
                "LibraryTableView.useEffect": async ()=>{
                    try {
                        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$application$2f$use$2d$cases$2f$wiki$2d$beta$2d$libraries$2e$use$2d$case$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["listWikiBetaLibraries"])(accountId, workspaceId);
                        setLibraries(result.map({
                            "LibraryTableView.useEffect": (l)=>({
                                    id: l.id,
                                    name: l.name
                                })
                        }["LibraryTableView.useEffect"]));
                        if (result.length > 0 && result[0]) {
                            setSelectedId(result[0].id);
                        }
                    } catch (e) {
                        setError(e instanceof Error ? e.message : "載入 Libraries 失敗");
                    } finally{
                        setLoading(false);
                    }
                }
            })["LibraryTableView.useEffect"]();
        }
    }["LibraryTableView.useEffect"], [
        accountId,
        workspaceId
    ]);
    // Load rows when selection changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LibraryTableView.useEffect": ()=>{
            if (!selectedId) return;
            void ({
                "LibraryTableView.useEffect": async ()=>{
                    setLoading(true);
                    try {
                        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$application$2f$use$2d$cases$2f$wiki$2d$beta$2d$libraries$2e$use$2d$case$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWikiBetaLibrarySnapshot"])(accountId, selectedId);
                        const keys = snap.fields.map({
                            "LibraryTableView.useEffect.keys": (f)=>f.key
                        }["LibraryTableView.useEffect.keys"]);
                        setFieldKeys(keys);
                        setRows(snap.rows.map({
                            "LibraryTableView.useEffect": (r)=>({
                                    ...r,
                                    _values: r.values
                                })
                        }["LibraryTableView.useEffect"]));
                    } catch (e) {
                        setError(e instanceof Error ? e.message : "載入資料列失敗");
                    } finally{
                        setLoading(false);
                    }
                }
            })["LibraryTableView.useEffect"]();
        }
    }["LibraryTableView.useEffect"], [
        accountId,
        selectedId
    ]);
    // DnD row reorder
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LibraryTableView.useEffect": ()=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$adapter$2f$element$2d$adapter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["monitorForElements"])({
                onDrop ({ source, location }) {
                    const target = location.current.dropTargets[0];
                    if (!target) return;
                    const fromId = source.data["rowId"];
                    const toId = target.data["rowId"];
                    if (!fromId || !toId || fromId === toId) return;
                    setRows({
                        "LibraryTableView.useEffect": (prev)=>{
                            const fromIdx = prev.findIndex({
                                "LibraryTableView.useEffect.fromIdx": (r)=>r.id === fromId
                            }["LibraryTableView.useEffect.fromIdx"]);
                            const toIdx = prev.findIndex({
                                "LibraryTableView.useEffect.toIdx": (r)=>r.id === toId
                            }["LibraryTableView.useEffect.toIdx"]);
                            if (fromIdx === -1 || toIdx === -1) return prev;
                            const next = [
                                ...prev
                            ];
                            const [moved] = next.splice(fromIdx, 1);
                            if (!moved) return prev;
                            next.splice(toIdx, 0, moved);
                            return next;
                        }
                    }["LibraryTableView.useEffect"]);
                }
            });
        }
    }["LibraryTableView.useEffect"], []);
    const columns = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LibraryTableView.useMemo[columns]": ()=>fieldKeys.map({
                "LibraryTableView.useMemo[columns]": (key)=>columnHelper.accessor({
                        "LibraryTableView.useMemo[columns]": (row)=>String(row._values[key] ?? "")
                    }["LibraryTableView.useMemo[columns]"], {
                        id: key,
                        header: key,
                        cell: {
                            "LibraryTableView.useMemo[columns]": (info)=>info.getValue()
                        }["LibraryTableView.useMemo[columns]"]
                    })
            }["LibraryTableView.useMemo[columns]"])
    }["LibraryTableView.useMemo[columns]"], [
        fieldKeys
    ]);
    const table = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$table$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useReactTable"])({
        data: rows,
        columns,
        state: {
            globalFilter: filter
        },
        onGlobalFilterChange: setFilter,
        getCoreRowModel: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$table$2d$core$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCoreRowModel"])(),
        getFilteredRowModel: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$table$2d$core$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFilteredRowModel"])()
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-4 rounded-xl border border-border/60 bg-card p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs font-semibold uppercase tracking-widest text-primary",
                        children: "Library Table"
                    }, void 0, false, {
                        fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
                        lineNumber: 137,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mt-2 text-xl font-semibold text-foreground",
                        children: "資料庫表格"
                    }, void 0, false, {
                        fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
                        lineNumber: 138,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 max-w-3xl text-sm text-muted-foreground",
                        children: "TanStack Table · 全域篩選 · 拖曳重排列"
                    }, void 0, false, {
                        fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: selectedId,
                        onChange: (e)=>setSelectedId(e.target.value),
                        className: "h-9 rounded-md border border-border/60 bg-background px-2 text-sm",
                        "aria-label": "選擇 Library",
                        children: libraries.map((lib)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: lib.id,
                                children: lib.name
                            }, lib.id, false, {
                                fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
                                lineNumber: 152,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "search",
                        value: filter,
                        onChange: (e)=>setFilter(e.target.value),
                        placeholder: "篩選…",
                        className: "h-9 rounded-md border border-border/60 bg-background px-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40"
                    }, void 0, false, {
                        fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
                        lineNumber: 158,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-muted-foreground",
                children: "載入中…"
            }, void 0, false, {
                fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
                lineNumber: 167,
                columnNumber: 19
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-destructive",
                children: error
            }, void 0, false, {
                fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
                lineNumber: 168,
                columnNumber: 17
            }, this),
            !loading && fieldKeys.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-muted-foreground",
                children: "此 Library 尚未定義欄位，請先在 Libraries 頁面新增欄位與資料列。"
            }, void 0, false, {
                fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
                lineNumber: 171,
                columnNumber: 9
            }, this),
            fieldKeys.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto rounded-lg border border-border/60",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "min-w-full text-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            className: "bg-muted/40",
                            children: table.getHeaderGroups().map((hg)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "w-8 px-2 py-2"
                                        }, void 0, false, {
                                            fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
                                            lineNumber: 180,
                                            columnNumber: 19
                                        }, this),
                                        hg.headers.map((header)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-3 py-2 text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$table$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["flexRender"])(header.column.columnDef.header, header.getContext())
                                            }, header.id, false, {
                                                fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
                                                lineNumber: 182,
                                                columnNumber: 21
                                            }, this))
                                    ]
                                }, hg.id, true, {
                                    fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
                                    lineNumber: 179,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
                            lineNumber: 177,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            className: "divide-y divide-border/40",
                            children: table.getRowModel().rows.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    colSpan: fieldKeys.length + 1,
                                    className: "px-3 py-4 text-center text-sm text-muted-foreground",
                                    children: "無資料"
                                }, void 0, false, {
                                    fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
                                    lineNumber: 195,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
                                lineNumber: 194,
                                columnNumber: 17
                            }, this) : table.getRowModel().rows.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DraggableRow, {
                                    rowId: row.original.id,
                                    children: row.getVisibleCells().map((cell)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-3 py-2",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$table$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["flexRender"])(cell.column.columnDef.cell, cell.getContext())
                                        }, cell.id, false, {
                                            fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
                                            lineNumber: 203,
                                            columnNumber: 23
                                        }, this))
                                }, row.id, false, {
                                    fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
                                    lineNumber: 201,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
                            lineNumber: 192,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
                    lineNumber: 176,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
                lineNumber: 175,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
        lineNumber: 135,
        columnNumber: 5
    }, this);
}
_s(LibraryTableView, "rmB+IXRfQNGL2Yd2GiOdKt3VUmQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$table$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useReactTable"]
    ];
});
_c = LibraryTableView;
function DraggableRow({ rowId, children }) {
    _s1();
    const dragHandleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const rowRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DraggableRow.useEffect": ()=>{
            const handleEl = dragHandleRef.current;
            const rowEl = rowRef.current;
            if (!handleEl || !rowEl) return;
            const cleanupDraggable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$adapter$2f$element$2d$adapter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["draggable"])({
                element: handleEl,
                getInitialData: {
                    "DraggableRow.useEffect.cleanupDraggable": ()=>({
                            rowId
                        })
                }["DraggableRow.useEffect.cleanupDraggable"]
            });
            const cleanupDrop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$adapter$2f$element$2d$adapter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dropTargetForElements"])({
                element: rowEl,
                getData: {
                    "DraggableRow.useEffect.cleanupDrop": ()=>({
                            rowId
                        })
                }["DraggableRow.useEffect.cleanupDrop"]
            });
            return ({
                "DraggableRow.useEffect": ()=>{
                    cleanupDraggable();
                    cleanupDrop();
                }
            })["DraggableRow.useEffect"];
        }
    }["DraggableRow.useEffect"], [
        rowId
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
        ref: rowRef,
        className: "transition hover:bg-muted/20",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                className: "px-2 py-2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    ref: dragHandleRef,
                    type: "button",
                    "aria-label": "拖曳重排",
                    className: "cursor-grab touch-none opacity-30 hover:opacity-80 active:cursor-grabbing",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVertical$3e$__["GripVertical"], {
                        className: "size-4 text-muted-foreground"
                    }, void 0, false, {
                        fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
                        lineNumber: 254,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
                    lineNumber: 248,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
                lineNumber: 247,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/modules/asset/interfaces/components/LibraryTableView.tsx",
        lineNumber: 246,
        columnNumber: 5
    }, this);
}
_s1(DraggableRow, "j3YUXnTGS9AYHJlsQ6WW0ku8vmI=");
_c1 = DraggableRow;
var _c, _c1;
__turbopack_context__.k.register(_c, "LibraryTableView");
__turbopack_context__.k.register(_c1, "DraggableRow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/asset/api/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Module: asset
 * Layer: api/barrel
 * Purpose: Public cross-module API boundary for the Asset domain.
 *
 * Other modules MUST import from here — never from domain/, application/,
 * infrastructure/, or interfaces/ directly.
 */ // --- Core entity types -------------------------------------------------------
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$interfaces$2f$hooks$2f$useDocumentsSnapshot$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/asset/interfaces/hooks/useDocumentsSnapshot.ts [app-client] (ecmascript)");
// --- Query functions ---------------------------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$interfaces$2f$queries$2f$file$2e$queries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/asset/interfaces/queries/file.queries.ts [app-client] (ecmascript)");
// --- UI components (cross-module public) -------------------------------------
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$interfaces$2f$components$2f$WorkspaceFilesTab$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/asset/interfaces/components/WorkspaceFilesTab.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$interfaces$2f$components$2f$AssetDocumentsView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/asset/interfaces/components/AssetDocumentsView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$interfaces$2f$components$2f$LibrariesView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/asset/interfaces/components/LibrariesView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$interfaces$2f$components$2f$LibraryTableView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/asset/interfaces/components/LibraryTableView.tsx [app-client] (ecmascript)");
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=modules_asset_1a8b0c15._.js.map