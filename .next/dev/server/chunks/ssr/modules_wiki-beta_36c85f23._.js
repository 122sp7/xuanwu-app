module.exports = [
"[project]/modules/wiki-beta/infrastructure/repositories/firebase-wiki-beta.repository.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseWikiBetaContentRepository",
    ()=>FirebaseWikiBetaContentRepository,
    "FirebaseWikiBetaWorkspaceRepository",
    ()=>FirebaseWikiBetaWorkspaceRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/firestore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$functions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/functions.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/workspace/api/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$queries$2f$workspace$2e$queries$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace/interfaces/queries/workspace.queries.ts [app-ssr] (ecmascript)");
;
;
;
function isRecord(value) {
    return typeof value === "object" && value !== null;
}
function objectOrEmpty(value) {
    if (isRecord(value)) {
        return value;
    }
    return {};
}
function toDateOrNull(value) {
    if (!isRecord(value)) return null;
    const maybeToDate = value.toDate;
    if (typeof maybeToDate === "function") {
        const converted = maybeToDate();
        if (converted instanceof Date) {
            return converted;
        }
    }
    return null;
}
function toCitations(value) {
    if (!Array.isArray(value)) {
        return [];
    }
    return value.map((item)=>{
        if (!isRecord(item)) {
            return {};
        }
        return {
            provider: item.provider === "vector" || item.provider === "search" ? item.provider : undefined,
            chunk_id: typeof item.chunk_id === "string" ? item.chunk_id : undefined,
            doc_id: typeof item.doc_id === "string" ? item.doc_id : undefined,
            filename: typeof item.filename === "string" ? item.filename : undefined,
            json_gcs_uri: typeof item.json_gcs_uri === "string" ? item.json_gcs_uri : undefined,
            search_id: typeof item.search_id === "string" ? item.search_id : undefined,
            score: typeof item.score === "number" ? item.score : undefined,
            text: typeof item.text === "string" ? item.text : undefined
        };
    });
}
function toNumberOrDefault(value, fallback = 0) {
    return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
function resolveDocumentFilename(data) {
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
    for (const candidate of candidates){
        if (typeof candidate === "string" && candidate.trim()) {
            return candidate;
        }
    }
    return "";
}
function mapToParsedDocument(id, data) {
    const source = objectOrEmpty(data.source);
    const parsed = objectOrEmpty(data.parsed);
    const rag = objectOrEmpty(data.rag);
    const metadata = objectOrEmpty(data.metadata);
    const sourceGcsFromSource = typeof source.gcs_uri === "string" ? source.gcs_uri : "";
    const sourceGcsFromMeta = typeof metadata.source_gcs_uri === "string" ? metadata.source_gcs_uri : "";
    const jsonGcsFromParsed = typeof parsed.json_gcs_uri === "string" ? parsed.json_gcs_uri : "";
    const jsonGcsFromMeta = typeof metadata.json_gcs_uri === "string" ? metadata.json_gcs_uri : "";
    const workspaceIdFromDoc = typeof data.spaceId === "string" ? data.spaceId : "";
    const workspaceIdFromMeta = typeof metadata.space_id === "string" ? metadata.space_id : "";
    return {
        id,
        filename: resolveDocumentFilename(data) || id,
        workspaceId: workspaceIdFromDoc || workspaceIdFromMeta,
        sourceGcsUri: sourceGcsFromSource || sourceGcsFromMeta,
        jsonGcsUri: jsonGcsFromParsed || jsonGcsFromMeta,
        pageCount: toNumberOrDefault(parsed.page_count) || toNumberOrDefault(metadata.page_count) || toNumberOrDefault(data.pageCount),
        status: typeof data.status === "string" ? data.status : "unknown",
        ragStatus: typeof rag.status === "string" ? rag.status : "",
        uploadedAt: toDateOrNull(source.uploaded_at) ?? toDateOrNull(data.createdAt)
    };
}
function sortByUploadedAtDesc(documents) {
    const copied = [
        ...documents
    ];
    copied.sort((a, b)=>{
        const at = a.uploadedAt ? a.uploadedAt.getTime() : 0;
        const bt = b.uploadedAt ? b.uploadedAt.getTime() : 0;
        return bt - at;
    });
    return copied;
}
class FirebaseWikiBetaContentRepository {
    async runRagQuery(query, accountId, workspaceId, topK, options = {}) {
        const functions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$functions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFirebaseFunctions"])("asia-southeast1");
        const callable = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$functions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["functionsApi"].httpsCallable(functions, "rag_query");
        const result = await callable({
            query,
            top_k: topK,
            account_id: accountId,
            workspace_id: workspaceId,
            taxonomy_filters: options.taxonomyFilters ?? [],
            max_age_days: options.maxAgeDays,
            require_ready: options.requireReady
        });
        const data = objectOrEmpty(result.data);
        return {
            answer: typeof data.answer === "string" ? data.answer : "",
            citations: toCitations(data.citations),
            cache: data.cache === "hit" ? "hit" : "miss",
            vectorHits: typeof data.vector_hits === "number" ? data.vector_hits : 0,
            searchHits: typeof data.search_hits === "number" ? data.search_hits : 0,
            accountScope: typeof data.account_scope === "string" ? data.account_scope : accountId,
            workspaceScope: typeof data.workspace_scope === "string" ? data.workspace_scope : workspaceId,
            taxonomyFilters: Array.isArray(data.taxonomy_filters) ? data.taxonomy_filters.filter((value)=>typeof value === "string") : undefined,
            maxAgeDays: typeof data.max_age_days === "number" ? data.max_age_days : undefined,
            requireReady: typeof data.require_ready === "boolean" ? data.require_ready : undefined
        };
    }
    async reindexDocument(input) {
        const functions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$functions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFirebaseFunctions"])("asia-southeast1");
        const callable = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$functions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["functionsApi"].httpsCallable(functions, "rag_reindex_document");
        await callable({
            account_id: input.accountId,
            doc_id: input.docId,
            json_gcs_uri: input.jsonGcsUri,
            source_gcs_uri: input.sourceGcsUri,
            filename: input.filename,
            page_count: input.pageCount
        });
    }
    async listParsedDocuments(accountId, limitCount) {
        if (!accountId) {
            throw new Error("accountId is required");
        }
        const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFirebaseFirestore"])();
        const accountRef = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firestoreApi"].collection(db, "accounts", accountId, "documents");
        const accountQuery = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firestoreApi"].query(accountRef, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firestoreApi"].limit(limitCount));
        const accountSnap = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firestoreApi"].getDocs(accountQuery);
        const docs = accountSnap.docs.map((item)=>{
            const data = objectOrEmpty(item.data());
            return mapToParsedDocument(item.id, data);
        });
        return sortByUploadedAtDesc(docs);
    }
}
class FirebaseWikiBetaWorkspaceRepository {
    async listByAccountId(accountId) {
        const workspaces = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2f$interfaces$2f$queries$2f$workspace$2e$queries$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getWorkspacesForAccount"])(accountId);
        return workspaces.map((workspace)=>({
                id: workspace.id,
                name: workspace.name
            }));
    }
}
}),
"[project]/modules/wiki-beta/infrastructure/repositories/firebase-wiki-beta-page.repository.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseWikiBetaPageRepository",
    ()=>FirebaseWikiBetaPageRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/firestore.ts [app-ssr] (ecmascript)");
;
function isRecord(value) {
    return typeof value === "object" && value !== null;
}
function toDateOrNow(value) {
    if (isRecord(value)) {
        const maybeToDate = value.toDate;
        if (typeof maybeToDate === "function") {
            const converted = maybeToDate();
            if (converted instanceof Date) {
                return converted;
            }
        }
    }
    if (value instanceof Date) {
        return value;
    }
    return new Date();
}
function mapToPage(id, accountId, data) {
    return {
        id,
        accountId,
        workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : undefined,
        title: typeof data.title === "string" ? data.title : "Untitled",
        slug: typeof data.slug === "string" ? data.slug : id,
        parentPageId: typeof data.parentPageId === "string" ? data.parentPageId : null,
        order: typeof data.order === "number" ? data.order : 0,
        status: data.status === "archived" ? "archived" : "active",
        createdAt: toDateOrNow(data.createdAt),
        updatedAt: toDateOrNow(data.updatedAt)
    };
}
function mapForWrite(page) {
    return {
        workspaceId: page.workspaceId ?? null,
        title: page.title,
        slug: page.slug,
        parentPageId: page.parentPageId,
        order: page.order,
        status: page.status,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt
    };
}
class FirebaseWikiBetaPageRepository {
    async listByAccountId(accountId) {
        const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFirebaseFirestore"])();
        const ref = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firestoreApi"].collection(db, "accounts", accountId, "pages");
        const snap = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firestoreApi"].getDocs(ref);
        const pages = snap.docs.map((docSnap)=>{
            const raw = docSnap.data();
            const data = isRecord(raw) ? raw : {};
            return mapToPage(docSnap.id, accountId, data);
        });
        pages.sort((a, b)=>{
            if (a.order !== b.order) {
                return a.order - b.order;
            }
            return a.title.localeCompare(b.title, "zh-Hant");
        });
        return pages;
    }
    async findById(accountId, pageId) {
        const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFirebaseFirestore"])();
        const ref = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firestoreApi"].doc(db, "accounts", accountId, "pages", pageId);
        const snap = await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firestoreApi"].getDoc(ref);
        if (!snap.exists()) {
            return null;
        }
        const raw = snap.data();
        const data = isRecord(raw) ? raw : {};
        return mapToPage(snap.id, accountId, data);
    }
    async create(page) {
        const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFirebaseFirestore"])();
        const ref = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firestoreApi"].doc(db, "accounts", page.accountId, "pages", page.id);
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firestoreApi"].setDoc(ref, mapForWrite(page));
    }
    async update(page) {
        const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFirebaseFirestore"])();
        const ref = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firestoreApi"].doc(db, "accounts", page.accountId, "pages", page.id);
        await __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$firestore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firestoreApi"].updateDoc(ref, {
            workspaceId: page.workspaceId ?? null,
            title: page.title,
            slug: page.slug,
            parentPageId: page.parentPageId,
            order: page.order,
            status: page.status,
            updatedAt: page.updatedAt
        });
    }
}
}),
"[project]/modules/wiki-beta/infrastructure/repositories/in-memory-wiki-beta-page.repository.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InMemoryWikiBetaPageRepository",
    ()=>InMemoryWikiBetaPageRepository
]);
function sortPages(pages) {
    return [
        ...pages
    ].sort((a, b)=>{
        if (a.order !== b.order) {
            return a.order - b.order;
        }
        return a.title.localeCompare(b.title, "zh-Hant");
    });
}
class InMemoryWikiBetaPageRepository {
    accountPages = new Map();
    async listByAccountId(accountId) {
        const pages = this.accountPages.get(accountId);
        if (!pages) {
            return [];
        }
        return sortPages(Array.from(pages.values()));
    }
    async findById(accountId, pageId) {
        const pages = this.accountPages.get(accountId);
        if (!pages) {
            return null;
        }
        return pages.get(pageId) ?? null;
    }
    async create(page) {
        const pages = this.getOrCreateAccountMap(page.accountId);
        if (pages.has(page.id)) {
            throw new Error(`WikiBetaPage with id ${page.id} already exists`);
        }
        pages.set(page.id, page);
    }
    async update(page) {
        const pages = this.getOrCreateAccountMap(page.accountId);
        if (!pages.has(page.id)) {
            throw new Error(`WikiBetaPage with id ${page.id} not found`);
        }
        pages.set(page.id, page);
    }
    getOrCreateAccountMap(accountId) {
        const existing = this.accountPages.get(accountId);
        if (existing) {
            return existing;
        }
        const created = new Map();
        this.accountPages.set(accountId, created);
        return created;
    }
}
}),
"[project]/modules/wiki-beta/infrastructure/repositories/in-memory-wiki-beta-library.repository.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InMemoryWikiBetaLibraryRepository",
    ()=>InMemoryWikiBetaLibraryRepository
]);
function sortByDateDesc(items) {
    return [
        ...items
    ].sort((a, b)=>{
        const aTime = (a.updatedAt ?? a.createdAt ?? new Date(0)).getTime();
        const bTime = (b.updatedAt ?? b.createdAt ?? new Date(0)).getTime();
        return bTime - aTime;
    });
}
class InMemoryWikiBetaLibraryRepository {
    libraries = new Map();
    fields = new Map();
    rows = new Map();
    async listByAccountId(accountId) {
        const map = this.libraries.get(accountId);
        if (!map) return [];
        return sortByDateDesc(Array.from(map.values()));
    }
    async findById(accountId, libraryId) {
        const map = this.libraries.get(accountId);
        if (!map) return null;
        return map.get(libraryId) ?? null;
    }
    async create(library) {
        const map = this.getOrCreateLibraries(library.accountId);
        if (map.has(library.id)) {
            throw new Error(`Library ${library.id} already exists`);
        }
        map.set(library.id, library);
    }
    async createField(accountId, field) {
        const key = this.fieldsKey(accountId, field.libraryId);
        const map = this.getOrCreate(this.fields, key);
        if (map.has(field.id)) {
            throw new Error(`Field ${field.id} already exists`);
        }
        map.set(field.id, field);
    }
    async listFields(accountId, libraryId) {
        const key = this.fieldsKey(accountId, libraryId);
        const map = this.fields.get(key);
        if (!map) return [];
        return [
            ...map.values()
        ].sort((a, b)=>a.label.localeCompare(b.label, "zh-Hant"));
    }
    async createRow(accountId, row) {
        const key = this.rowsKey(accountId, row.libraryId);
        const map = this.getOrCreate(this.rows, key);
        if (map.has(row.id)) {
            throw new Error(`Row ${row.id} already exists`);
        }
        map.set(row.id, row);
    }
    async listRows(accountId, libraryId) {
        const key = this.rowsKey(accountId, libraryId);
        const map = this.rows.get(key);
        if (!map) return [];
        return sortByDateDesc(Array.from(map.values()));
    }
    getOrCreateLibraries(accountId) {
        return this.getOrCreate(this.libraries, accountId);
    }
    getOrCreate(bucket, key) {
        const existing = bucket.get(key);
        if (existing) return existing;
        const created = new Map();
        bucket.set(key, created);
        return created;
    }
    fieldsKey(accountId, libraryId) {
        return `${accountId}:${libraryId}`;
    }
    rowsKey(accountId, libraryId) {
        return `${accountId}:${libraryId}`;
    }
}
}),
"[project]/modules/wiki-beta/infrastructure/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$infrastructure$2f$repositories$2f$firebase$2d$wiki$2d$beta$2e$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/wiki-beta/infrastructure/repositories/firebase-wiki-beta.repository.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$infrastructure$2f$repositories$2f$firebase$2d$wiki$2d$beta$2d$page$2e$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/wiki-beta/infrastructure/repositories/firebase-wiki-beta-page.repository.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$infrastructure$2f$repositories$2f$in$2d$memory$2d$wiki$2d$beta$2d$page$2e$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/wiki-beta/infrastructure/repositories/in-memory-wiki-beta-page.repository.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$infrastructure$2f$repositories$2f$in$2d$memory$2d$wiki$2d$beta$2d$library$2e$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/wiki-beta/infrastructure/repositories/in-memory-wiki-beta-library.repository.ts [app-ssr] (ecmascript)");
;
;
;
;
}),
"[project]/modules/wiki-beta/application/use-cases/wiki-beta-rag.use-case.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "listWikiBetaParsedDocuments",
    ()=>listWikiBetaParsedDocuments,
    "reindexWikiBetaDocument",
    ()=>reindexWikiBetaDocument,
    "runWikiBetaRagQuery",
    ()=>runWikiBetaRagQuery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$infrastructure$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/wiki-beta/infrastructure/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$infrastructure$2f$repositories$2f$firebase$2d$wiki$2d$beta$2e$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/wiki-beta/infrastructure/repositories/firebase-wiki-beta.repository.ts [app-ssr] (ecmascript)");
;
const defaultContentRepository = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$infrastructure$2f$repositories$2f$firebase$2d$wiki$2d$beta$2e$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FirebaseWikiBetaContentRepository"]();
async function runWikiBetaRagQuery(query, accountId, workspaceId, topK = 4, options = {}, repository = defaultContentRepository) {
    return repository.runRagQuery(query, accountId, workspaceId, topK, options);
}
async function reindexWikiBetaDocument(input, repository = defaultContentRepository) {
    await repository.reindexDocument(input);
}
async function listWikiBetaParsedDocuments(accountId, limitCount = 20, repository = defaultContentRepository) {
    return repository.listParsedDocuments(accountId, limitCount);
}
}),
"[project]/modules/wiki-beta/application/use-cases/wiki-beta-pages.use-case.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createWikiBetaPage",
    ()=>createWikiBetaPage,
    "listWikiBetaPagesTree",
    ()=>listWikiBetaPagesTree,
    "moveWikiBetaPage",
    ()=>moveWikiBetaPage,
    "renameWikiBetaPage",
    ()=>renameWikiBetaPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$event$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/event/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$event$2f$infrastructure$2f$repositories$2f$in$2d$memory$2d$event$2d$store$2e$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/event/infrastructure/repositories/in-memory-event-store.repository.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$event$2f$infrastructure$2f$repositories$2f$noop$2d$event$2d$bus$2e$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/event/infrastructure/repositories/noop-event-bus.repository.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$event$2f$application$2f$use$2d$cases$2f$publish$2d$domain$2d$event$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/event/application/use-cases/publish-domain-event.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/namespace/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$domain$2f$services$2f$slug$2d$policy$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/namespace/domain/services/slug-policy.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$infrastructure$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/wiki-beta/infrastructure/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$infrastructure$2f$repositories$2f$firebase$2d$wiki$2d$beta$2d$page$2e$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/wiki-beta/infrastructure/repositories/firebase-wiki-beta-page.repository.ts [app-ssr] (ecmascript)");
;
;
;
const defaultPageRepository = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$infrastructure$2f$repositories$2f$firebase$2d$wiki$2d$beta$2d$page$2e$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FirebaseWikiBetaPageRepository"]();
const defaultEventPublisher = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$event$2f$application$2f$use$2d$cases$2f$publish$2d$domain$2d$event$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublishDomainEventUseCase"](new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$event$2f$infrastructure$2f$repositories$2f$in$2d$memory$2d$event$2d$store$2e$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InMemoryEventStoreRepository"](), new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$event$2f$infrastructure$2f$repositories$2f$noop$2d$event$2d$bus$2e$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NoopEventBusRepository"]());
function generateId() {
    const randomUUID = globalThis.crypto?.randomUUID;
    if (typeof randomUUID === "function") {
        return randomUUID.call(globalThis.crypto);
    }
    return `wbp_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}
function normalizeTitle(title) {
    const trimmed = title.trim();
    if (!trimmed) {
        throw new Error("title is required");
    }
    return trimmed.slice(0, 120);
}
function sameParent(a, parentPageId) {
    return (a.parentPageId ?? null) === parentPageId;
}
function ensureUniqueSlug(baseSlug, siblingPages) {
    const normalizedBase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$domain$2f$services$2f$slug$2d$policy$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidSlug"])(baseSlug) ? baseSlug : "page-node";
    const existing = new Set(siblingPages.map((page)=>page.slug));
    if (!existing.has(normalizedBase)) {
        return normalizedBase;
    }
    let index = 2;
    while(index < 5000){
        const candidate = `${normalizedBase}-${index}`;
        if (!existing.has(candidate) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$domain$2f$services$2f$slug$2d$policy$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidSlug"])(candidate)) {
            return candidate;
        }
        index += 1;
    }
    throw new Error("cannot allocate a unique slug for this page title");
}
function toTree(pages) {
    const nodeById = new Map();
    for (const page of pages){
        nodeById.set(page.id, {
            ...page,
            children: []
        });
    }
    const roots = [];
    for (const page of pages){
        const node = nodeById.get(page.id);
        if (!node) continue;
        if (!page.parentPageId) {
            roots.push(node);
            continue;
        }
        const parent = nodeById.get(page.parentPageId);
        if (!parent) {
            roots.push(node);
            continue;
        }
        parent.children.push(node);
    }
    const sortRecursively = (nodes)=>{
        nodes.sort((a, b)=>{
            if (a.order !== b.order) {
                return a.order - b.order;
            }
            return a.title.localeCompare(b.title, "zh-Hant");
        });
        for (const node of nodes){
            sortRecursively(node.children);
        }
    };
    sortRecursively(roots);
    return roots;
}
function assertNoCycle(pages, pageId, targetParentPageId) {
    if (!targetParentPageId) {
        return;
    }
    if (pageId === targetParentPageId) {
        throw new Error("page cannot be moved under itself");
    }
    const byId = new Map(pages.map((page)=>[
            page.id,
            page
        ]));
    let current = targetParentPageId;
    while(current){
        if (current === pageId) {
            throw new Error("invalid move: target parent is a descendant of page");
        }
        current = byId.get(current)?.parentPageId ?? null;
    }
}
async function listWikiBetaPagesTree(accountId, workspaceId, pageRepository = defaultPageRepository) {
    if (!accountId) {
        throw new Error("accountId is required");
    }
    const allPages = await pageRepository.listByAccountId(accountId);
    const pages = workspaceId ? allPages.filter((page)=>page.workspaceId === workspaceId) : allPages;
    return toTree(pages.filter((page)=>page.status === "active"));
}
async function createWikiBetaPage(input, pageRepository = defaultPageRepository) {
    if (!input.accountId) {
        throw new Error("accountId is required");
    }
    const title = normalizeTitle(input.title);
    const pages = await pageRepository.listByAccountId(input.accountId);
    const parentPageId = input.parentPageId ?? null;
    if (parentPageId) {
        const parent = pages.find((page)=>page.id === parentPageId);
        if (!parent) {
            throw new Error("parent page not found");
        }
    }
    const siblingPages = pages.filter((page)=>sameParent(page, parentPageId));
    const rawSlug = (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$domain$2f$services$2f$slug$2d$policy$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deriveSlugCandidate"])(title);
    const slug = ensureUniqueSlug(rawSlug, siblingPages);
    const order = siblingPages.reduce((max, page)=>Math.max(max, page.order), -1) + 1;
    const now = new Date();
    const created = {
        id: generateId(),
        accountId: input.accountId,
        workspaceId: input.workspaceId,
        title,
        slug,
        parentPageId,
        order,
        status: "active",
        createdAt: now,
        updatedAt: now
    };
    await pageRepository.create(created);
    await defaultEventPublisher.execute({
        id: generateId(),
        eventName: "wiki_beta.page.created",
        aggregateType: "wiki-page",
        aggregateId: created.id,
        payload: {
            accountId: created.accountId,
            workspaceId: created.workspaceId,
            parentPageId: created.parentPageId,
            slug: created.slug
        }
    });
    return created;
}
async function renameWikiBetaPage(input, pageRepository = defaultPageRepository) {
    const title = normalizeTitle(input.title);
    const existing = await pageRepository.findById(input.accountId, input.pageId);
    if (!existing) {
        throw new Error("page not found");
    }
    const pages = await pageRepository.listByAccountId(input.accountId);
    const siblingPages = pages.filter((page)=>page.id !== existing.id && sameParent(page, existing.parentPageId));
    const slug = ensureUniqueSlug((0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$domain$2f$services$2f$slug$2d$policy$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deriveSlugCandidate"])(title), siblingPages);
    const updated = {
        ...existing,
        title,
        slug,
        updatedAt: new Date()
    };
    await pageRepository.update(updated);
    await defaultEventPublisher.execute({
        id: generateId(),
        eventName: "wiki_beta.page.renamed",
        aggregateType: "wiki-page",
        aggregateId: updated.id,
        payload: {
            accountId: updated.accountId,
            title: updated.title,
            slug: updated.slug
        }
    });
    return updated;
}
async function moveWikiBetaPage(input, pageRepository = defaultPageRepository) {
    const existing = await pageRepository.findById(input.accountId, input.pageId);
    if (!existing) {
        throw new Error("page not found");
    }
    const pages = await pageRepository.listByAccountId(input.accountId);
    const targetParentPageId = input.targetParentPageId ?? null;
    assertNoCycle(pages, existing.id, targetParentPageId);
    if (targetParentPageId) {
        const targetParent = pages.find((page)=>page.id === targetParentPageId);
        if (!targetParent) {
            throw new Error("target parent page not found");
        }
    }
    const siblingPages = pages.filter((page)=>page.id !== existing.id && sameParent(page, targetParentPageId));
    const order = siblingPages.reduce((max, page)=>Math.max(max, page.order), -1) + 1;
    const moved = {
        ...existing,
        parentPageId: targetParentPageId,
        order,
        updatedAt: new Date()
    };
    await pageRepository.update(moved);
    await defaultEventPublisher.execute({
        id: generateId(),
        eventName: "wiki_beta.page.moved",
        aggregateType: "wiki-page",
        aggregateId: moved.id,
        payload: {
            accountId: moved.accountId,
            fromParentPageId: existing.parentPageId,
            toParentPageId: moved.parentPageId
        }
    });
    return moved;
}
}),
"[project]/modules/wiki-beta/application/use-cases/wiki-beta-libraries.use-case.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addWikiBetaLibraryField",
    ()=>addWikiBetaLibraryField,
    "createWikiBetaLibrary",
    ()=>createWikiBetaLibrary,
    "createWikiBetaLibraryRow",
    ()=>createWikiBetaLibraryRow,
    "getWikiBetaLibrarySnapshot",
    ()=>getWikiBetaLibrarySnapshot,
    "listWikiBetaLibraries",
    ()=>listWikiBetaLibraries
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$event$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/event/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$event$2f$infrastructure$2f$repositories$2f$in$2d$memory$2d$event$2d$store$2e$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/event/infrastructure/repositories/in-memory-event-store.repository.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$event$2f$infrastructure$2f$repositories$2f$noop$2d$event$2d$bus$2e$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/event/infrastructure/repositories/noop-event-bus.repository.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$event$2f$application$2f$use$2d$cases$2f$publish$2d$domain$2d$event$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/event/application/use-cases/publish-domain-event.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/namespace/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$domain$2f$services$2f$slug$2d$policy$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/namespace/domain/services/slug-policy.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$infrastructure$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/wiki-beta/infrastructure/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$infrastructure$2f$repositories$2f$in$2d$memory$2d$wiki$2d$beta$2d$library$2e$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/wiki-beta/infrastructure/repositories/in-memory-wiki-beta-library.repository.ts [app-ssr] (ecmascript)");
;
;
;
const defaultLibraryRepository = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$infrastructure$2f$repositories$2f$in$2d$memory$2d$wiki$2d$beta$2d$library$2e$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InMemoryWikiBetaLibraryRepository"]();
const defaultEventPublisher = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$event$2f$application$2f$use$2d$cases$2f$publish$2d$domain$2d$event$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PublishDomainEventUseCase"](new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$event$2f$infrastructure$2f$repositories$2f$in$2d$memory$2d$event$2d$store$2e$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InMemoryEventStoreRepository"](), new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$event$2f$infrastructure$2f$repositories$2f$noop$2d$event$2d$bus$2e$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NoopEventBusRepository"]());
function generateId() {
    const randomUUID = globalThis.crypto?.randomUUID;
    if (typeof randomUUID === "function") {
        return randomUUID.call(globalThis.crypto);
    }
    return `wbl_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
}
function normalizeName(name) {
    const value = name.trim();
    if (!value) {
        throw new Error("library name is required");
    }
    return value.slice(0, 80);
}
function normalizeFieldKey(key) {
    const normalized = key.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    if (!normalized) {
        throw new Error("field key is required");
    }
    return normalized.slice(0, 48);
}
function ensureUniqueLibrarySlug(baseSlug, libraries) {
    const normalizedBase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$domain$2f$services$2f$slug$2d$policy$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidSlug"])(baseSlug) ? baseSlug : "library-node";
    const existing = new Set(libraries.map((library)=>library.slug));
    if (!existing.has(normalizedBase)) {
        return normalizedBase;
    }
    let index = 2;
    while(index < 5000){
        const candidate = `${normalizedBase}-${index}`;
        if (!existing.has(candidate) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$domain$2f$services$2f$slug$2d$policy$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidSlug"])(candidate)) {
            return candidate;
        }
        index += 1;
    }
    throw new Error("cannot allocate a unique slug for this library name");
}
async function listWikiBetaLibraries(accountId, workspaceId, libraryRepository = defaultLibraryRepository) {
    if (!accountId) {
        throw new Error("accountId is required");
    }
    const libraries = await libraryRepository.listByAccountId(accountId);
    const activeLibraries = libraries.filter((library)=>library.status === "active");
    if (!workspaceId) {
        return activeLibraries;
    }
    return activeLibraries.filter((library)=>library.workspaceId === workspaceId);
}
async function createWikiBetaLibrary(input, libraryRepository = defaultLibraryRepository) {
    if (!input.accountId) {
        throw new Error("accountId is required");
    }
    const name = normalizeName(input.name);
    const libraries = await libraryRepository.listByAccountId(input.accountId);
    const workspaceLibraries = libraries.filter((library)=>(library.workspaceId ?? "") === (input.workspaceId ?? ""));
    const slug = ensureUniqueLibrarySlug((0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$namespace$2f$domain$2f$services$2f$slug$2d$policy$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deriveSlugCandidate"])(name), workspaceLibraries);
    const now = new Date();
    const library = {
        id: generateId(),
        accountId: input.accountId,
        workspaceId: input.workspaceId,
        name,
        slug,
        status: "active",
        createdAt: now,
        updatedAt: now
    };
    await libraryRepository.create(library);
    await defaultEventPublisher.execute({
        id: generateId(),
        eventName: "wiki_beta.library.created",
        aggregateType: "wiki-library",
        aggregateId: library.id,
        payload: {
            accountId: library.accountId,
            workspaceId: library.workspaceId,
            slug: library.slug
        }
    });
    return library;
}
async function addWikiBetaLibraryField(input, libraryRepository = defaultLibraryRepository) {
    const library = await libraryRepository.findById(input.accountId, input.libraryId);
    if (!library) {
        throw new Error("library not found");
    }
    const key = normalizeFieldKey(input.key);
    const label = normalizeName(input.label);
    const fields = await libraryRepository.listFields(input.accountId, input.libraryId);
    if (fields.some((field)=>field.key === key)) {
        throw new Error(`field key \"${key}\" already exists`);
    }
    const field = {
        id: generateId(),
        libraryId: input.libraryId,
        key,
        label,
        type: input.type,
        required: input.required ?? false,
        options: input.options,
        createdAt: new Date()
    };
    await libraryRepository.createField(input.accountId, field);
    await defaultEventPublisher.execute({
        id: generateId(),
        eventName: "wiki_beta.library.field_added",
        aggregateType: "wiki-library",
        aggregateId: input.libraryId,
        payload: {
            accountId: input.accountId,
            fieldKey: field.key,
            fieldType: field.type
        }
    });
    return field;
}
async function createWikiBetaLibraryRow(input, libraryRepository = defaultLibraryRepository) {
    const library = await libraryRepository.findById(input.accountId, input.libraryId);
    if (!library) {
        throw new Error("library not found");
    }
    const fields = await libraryRepository.listFields(input.accountId, input.libraryId);
    const requiredFields = fields.filter((field)=>field.required);
    for (const field of requiredFields){
        if (!(field.key in input.values)) {
            throw new Error(`missing required field: ${field.key}`);
        }
    }
    const now = new Date();
    const row = {
        id: generateId(),
        libraryId: input.libraryId,
        values: input.values,
        createdAt: now,
        updatedAt: now
    };
    await libraryRepository.createRow(input.accountId, row);
    await defaultEventPublisher.execute({
        id: generateId(),
        eventName: "wiki_beta.library.row_created",
        aggregateType: "wiki-library",
        aggregateId: input.libraryId,
        payload: {
            accountId: input.accountId,
            rowId: row.id,
            fields: Object.keys(row.values)
        }
    });
    return row;
}
async function getWikiBetaLibrarySnapshot(accountId, libraryId, libraryRepository = defaultLibraryRepository) {
    const library = await libraryRepository.findById(accountId, libraryId);
    if (!library) {
        throw new Error("library not found");
    }
    const [fields, rows] = await Promise.all([
        libraryRepository.listFields(accountId, libraryId),
        libraryRepository.listRows(accountId, libraryId)
    ]);
    return {
        library,
        fields,
        rows
    };
}
}),
"[project]/modules/wiki-beta/application/use-cases/wiki-beta-content-tree.use-case.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildWikiBetaContentTree",
    ()=>buildWikiBetaContentTree
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$infrastructure$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/wiki-beta/infrastructure/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$infrastructure$2f$repositories$2f$firebase$2d$wiki$2d$beta$2e$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/wiki-beta/infrastructure/repositories/firebase-wiki-beta.repository.ts [app-ssr] (ecmascript)");
;
const defaultWorkspaceRepository = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$infrastructure$2f$repositories$2f$firebase$2d$wiki$2d$beta$2e$repository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FirebaseWikiBetaWorkspaceRepository"]();
function buildContentBaseItems(workspaceId) {
    return [
        {
            key: "spaces",
            label: "WorkSpace Wiki-Beta",
            href: `/workspace/${workspaceId}?tab=Wiki`,
            enabled: true
        },
        {
            key: "pages",
            label: "Pages",
            href: "/wiki-beta/pages",
            enabled: true
        },
        {
            key: "libraries",
            label: "Libraries",
            href: "/wiki-beta/libraries",
            enabled: true
        },
        {
            key: "documents",
            label: "Documents",
            href: `/workspace/${workspaceId}?tab=Files`,
            enabled: true
        },
        {
            key: "vector-index",
            label: "Vector Index",
            href: "/wiki-beta",
            enabled: false
        },
        {
            key: "rag",
            label: "RAG",
            href: "/wiki-beta",
            enabled: true
        },
        {
            key: "ai-tools",
            label: "AI Tools",
            href: "/ai-chat",
            enabled: true
        }
    ];
}
function buildWorkspaceNode(workspaceId, workspaceName) {
    return {
        workspaceId,
        workspaceName,
        href: `/workspace/${workspaceId}?tab=Wiki`,
        contentBaseItems: buildContentBaseItems(workspaceId)
    };
}
async function buildWikiBetaContentTree(seeds, workspaceRepository = defaultWorkspaceRepository) {
    const accountNodes = await Promise.all(seeds.map(async (seed)=>{
        const workspaces = await workspaceRepository.listByAccountId(seed.accountId);
        return {
            accountId: seed.accountId,
            accountName: seed.accountName,
            accountType: seed.accountType,
            isActive: seed.isActive,
            membersHref: seed.accountType === "organization" ? "/organization/members" : undefined,
            teamsHref: seed.accountType === "organization" ? "/organization/teams" : undefined,
            workspaces: workspaces.map((workspace)=>buildWorkspaceNode(workspace.id, workspace.name))
        };
    }));
    return accountNodes.sort((a, b)=>{
        if (a.accountType !== b.accountType) {
            return a.accountType === "personal" ? -1 : 1;
        }
        return a.accountName.localeCompare(b.accountName, "zh-Hant");
    });
}
}),
"[project]/modules/wiki-beta/interfaces/components/WikiBetaRagView.tsx [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// Moved to modules/retrieval as RagView. Transitional re-export during wiki-beta decomposition.
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$retrieval$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/retrieval/api/index.ts [app-ssr] (ecmascript) <locals>");
;
}),
"[project]/modules/wiki-beta/interfaces/components/WikiBetaWorkspaceView.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WikiBetaWorkspaceView",
    ()=>WikiBetaWorkspaceView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpenIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-ssr] (ecmascript) <export default as BookOpenIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2Icon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-ssr] (ecmascript) <export default as Building2Icon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$kanban$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderKanbanIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-kanban.js [app-ssr] (ecmascript) <export default as FolderKanbanIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$interfaces$2f$components$2f$WikiBetaRagView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/wiki-beta/interfaces/components/WikiBetaRagView.tsx [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$retrieval$2f$interfaces$2f$components$2f$RagView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__RagView__as__WikiBetaRagView$3e$__ = __turbopack_context__.i("[project]/modules/retrieval/interfaces/components/RagView.tsx [app-ssr] (ecmascript) <export RagView as WikiBetaRagView>");
"use client";
;
;
;
;
;
;
function WikiBetaWorkspaceView({ workspace }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                className: "border-border/60 bg-card/80",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                        className: "gap-4 lg:flex-row lg:items-start lg:justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                        className: "flex items-center gap-2 text-xl",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpenIcon$3e$__["BookOpenIcon"], {
                                                className: "size-5 text-primary"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaWorkspaceView.tsx",
                                                lineNumber: 28,
                                                columnNumber: 8
                                            }, this),
                                            workspace.name,
                                            " WorkSpace Wiki-Beta"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaWorkspaceView.tsx",
                                        lineNumber: 27,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardDescription"], {
                                        children: "這是 workspace-scoped 的 Wiki-Beta。功能面與 Account Wiki-Beta、dev-tools 對齊，包含上傳、解析、RAG 查詢、文件操作與 runtime console；但所有資料與操作都約束在目前 Account 與 Workspace。"
                                    }, void 0, false, {
                                        fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaWorkspaceView.tsx",
                                        lineNumber: 31,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaWorkspaceView.tsx",
                                lineNumber: 26,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid gap-2 sm:grid-cols-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-xl border border-border/60 px-3 py-2 text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground",
                                                children: "Account Scope"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaWorkspaceView.tsx",
                                                lineNumber: 38,
                                                columnNumber: 8
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 flex items-center gap-2 font-medium text-foreground",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2Icon$3e$__["Building2Icon"], {
                                                        className: "size-4 text-primary"
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaWorkspaceView.tsx",
                                                        lineNumber: 40,
                                                        columnNumber: 9
                                                    }, this),
                                                    workspace.accountId
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaWorkspaceView.tsx",
                                                lineNumber: 39,
                                                columnNumber: 8
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaWorkspaceView.tsx",
                                        lineNumber: 37,
                                        columnNumber: 7
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-xl border border-border/60 px-3 py-2 text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground",
                                                children: "Workspace Scope"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaWorkspaceView.tsx",
                                                lineNumber: 45,
                                                columnNumber: 8
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-1 flex items-center gap-2 font-medium text-foreground",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$kanban$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderKanbanIcon$3e$__["FolderKanbanIcon"], {
                                                        className: "size-4 text-primary"
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaWorkspaceView.tsx",
                                                        lineNumber: 47,
                                                        columnNumber: 9
                                                    }, this),
                                                    workspace.id
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaWorkspaceView.tsx",
                                                lineNumber: 46,
                                                columnNumber: 8
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaWorkspaceView.tsx",
                                        lineNumber: 44,
                                        columnNumber: 7
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaWorkspaceView.tsx",
                                lineNumber: 36,
                                columnNumber: 6
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaWorkspaceView.tsx",
                        lineNumber: 25,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "flex flex-wrap gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                asChild: true,
                                variant: "outline",
                                size: "sm",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/wiki-beta",
                                    children: "前往 Account Wiki-Beta"
                                }, void 0, false, {
                                    fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaWorkspaceView.tsx",
                                    lineNumber: 56,
                                    columnNumber: 7
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaWorkspaceView.tsx",
                                lineNumber: 55,
                                columnNumber: 6
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                asChild: true,
                                variant: "outline",
                                size: "sm",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/wiki-beta/pages",
                                    children: "查看 Account 頁面總覽"
                                }, void 0, false, {
                                    fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaWorkspaceView.tsx",
                                    lineNumber: 59,
                                    columnNumber: 7
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaWorkspaceView.tsx",
                                lineNumber: 58,
                                columnNumber: 6
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaWorkspaceView.tsx",
                        lineNumber: 54,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaWorkspaceView.tsx",
                lineNumber: 24,
                columnNumber: 4
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$retrieval$2f$interfaces$2f$components$2f$RagView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__RagView__as__WikiBetaRagView$3e$__["WikiBetaRagView"], {
                onBack: ()=>undefined,
                workspaceId: workspace.id,
                showBackButton: false
            }, void 0, false, {
                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaWorkspaceView.tsx",
                lineNumber: 64,
                columnNumber: 4
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaWorkspaceView.tsx",
        lineNumber: 23,
        columnNumber: 3
    }, this);
}
}),
"[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WikiBetaOverviewView",
    ()=>WikiBetaOverviewView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-ssr] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-ssr] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/database.js [app-ssr] (ecmascript) <export default as Database>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$kanban$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderKanban$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-kanban.js [app-ssr] (ecmascript) <export default as FolderKanban>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.js [app-ssr] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$app$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/providers/app-provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/providers/auth-provider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/skeleton.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/wiki-beta/api/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$application$2f$use$2d$cases$2f$wiki$2d$beta$2d$content$2d$tree$2e$use$2d$case$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/wiki-beta/application/use-cases/wiki-beta-content-tree.use-case.ts [app-ssr] (ecmascript)");
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
const QUICK_ACCESS = [
    {
        href: "/wiki-beta/pages",
        title: "Pages",
        description: "層級頁面結構、命名與移動管理。",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"]
    },
    {
        href: "/wiki-beta/libraries",
        title: "Libraries",
        description: "欄位模型與資料列維護。",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"]
    },
    {
        href: "/wiki-beta/documents",
        title: "Documents",
        description: "文件上傳、處理與索引狀態。",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"]
    },
    {
        href: "/wiki-beta/rag-query",
        title: "RAG Query",
        description: "知識問答與引用檢視。",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"]
    }
];
function WikiBetaOverviewView() {
    const { state: appState } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$app$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useApp"])();
    const { state: authState } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$auth$2d$provider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [contentTree, setContentTree] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const accountSeeds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const personalUser = authState.user;
        const activeAccountId = appState.activeAccount?.id;
        const seeds = [];
        if (personalUser) {
            seeds.push({
                accountId: personalUser.id,
                accountName: personalUser.name,
                accountType: "personal",
                isActive: activeAccountId === personalUser.id
            });
        }
        const organizations = Object.values(appState.accounts);
        for (const organization of organizations){
            seeds.push({
                accountId: organization.id,
                accountName: organization.name,
                accountType: "organization",
                isActive: activeAccountId === organization.id
            });
        }
        return seeds;
    }, [
        appState.accounts,
        appState.activeAccount?.id,
        authState.user
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let disposed = false;
        async function load() {
            setLoading(true);
            try {
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$application$2f$use$2d$cases$2f$wiki$2d$beta$2d$content$2d$tree$2e$use$2d$case$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildWikiBetaContentTree"])(accountSeeds);
                if (!disposed) {
                    setContentTree(result);
                }
            } catch  {
                if (!disposed) {
                    setContentTree([]);
                }
            } finally{
                if (!disposed) {
                    setLoading(false);
                }
            }
        }
        void load();
        return ()=>{
            disposed = true;
        };
    }, [
        accountSeeds
    ]);
    const activeAccount = contentTree.find((node)=>node.isActive);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                className: "text-xl",
                                children: "Account Wiki-Beta Dashboard"
                            }, void 0, false, {
                                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                lineNumber: 110,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardDescription"], {
                                children: "顯示目前 active account 底下的 Wiki-Beta 範圍，並提供 account-level 與 workspace-level 的進入點。"
                            }, void 0, false, {
                                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                lineNumber: 111,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "space-y-3",
                        children: [
                            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                className: "h-6 w-48"
                            }, void 0, false, {
                                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                lineNumber: 115,
                                columnNumber: 13
                            }, this) : activeAccount ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid gap-3 md:grid-cols-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-xl border border-border/60 px-4 py-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground",
                                                children: "Active Account"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                                lineNumber: 119,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-2 flex items-center gap-2 text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                                        className: "size-4 text-primary"
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                                        lineNumber: 121,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                        variant: "outline",
                                                        children: activeAccount.accountType === "personal" ? "個人" : "組織"
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                                        lineNumber: 122,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium text-foreground",
                                                        children: activeAccount.accountName
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                                        lineNumber: 123,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                                lineNumber: 120,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                        lineNumber: 118,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-xl border border-border/60 px-4 py-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground",
                                                children: "Workspace Coverage"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                                lineNumber: 127,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-2 flex items-center gap-2 text-sm text-foreground",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$kanban$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderKanban$3e$__["FolderKanban"], {
                                                        className: "size-4 text-primary"
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                                        lineNumber: 129,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            activeAccount.workspaces.length,
                                                            " 個工作區可進入各自的 WorkSpace Wiki-Beta"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                                        lineNumber: 130,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                                lineNumber: 128,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                        lineNumber: 126,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                lineNumber: 117,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-muted-foreground",
                                children: "尚未取得 account context。"
                            }, void 0, false, {
                                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                lineNumber: 135,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
                                children: QUICK_ACCESS.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: item.href,
                                        className: "group",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                            className: "h-full transition-colors hover:border-primary/40 hover:shadow-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                    className: "pb-2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                                                    className: "size-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                                                    lineNumber: 145,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                                                lineNumber: 144,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                                className: "text-sm",
                                                                children: item.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                                                lineNumber: 147,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                                        lineNumber: 143,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                                    lineNumber: 142,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardDescription"], {
                                                        className: "text-xs leading-relaxed",
                                                        children: item.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                                        lineNumber: 151,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                                    lineNumber: 150,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                            lineNumber: 141,
                                            columnNumber: 17
                                        }, this)
                                    }, item.href, false, {
                                        fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                        lineNumber: 140,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                lineNumber: 138,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                lineNumber: 108,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                        className: "pb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                className: "text-base",
                                children: "Workspace Snapshot"
                            }, void 0, false, {
                                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                lineNumber: 162,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardDescription"], {
                                children: "以下工作區皆屬於目前 active account，點擊後直接進入該 workspace 的 Wiki-Beta 範圍。"
                            }, void 0, false, {
                                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                lineNumber: 163,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                    className: "h-20"
                                }, void 0, false, {
                                    fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                    lineNumber: 168,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                    className: "h-20"
                                }, void 0, false, {
                                    fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                    lineNumber: 169,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                    className: "h-20"
                                }, void 0, false, {
                                    fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                    lineNumber: 170,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                            lineNumber: 167,
                            columnNumber: 13
                        }, this) : !activeAccount || activeAccount.workspaces.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-muted-foreground",
                            children: "目前帳號下沒有工作區。"
                        }, void 0, false, {
                            fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                            lineNumber: 173,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
                            children: activeAccount.workspaces.map((workspace)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: workspace.href,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                                        className: "transition-colors hover:border-primary/40 hover:shadow-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                                                className: "pb-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                                    className: "text-sm",
                                                    children: workspace.workspaceName
                                                }, void 0, false, {
                                                    fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                                    lineNumber: 180,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                                lineNumber: 179,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                                                className: "flex flex-wrap gap-1",
                                                children: workspace.contentBaseItems.filter((item)=>item.enabled).map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                        variant: "secondary",
                                                        className: "text-[10px]",
                                                        children: item.label
                                                    }, item.key, false, {
                                                        fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                                        lineNumber: 186,
                                                        columnNumber: 27
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                                lineNumber: 182,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                        lineNumber: 178,
                                        columnNumber: 19
                                    }, this)
                                }, workspace.workspaceId, false, {
                                    fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                                    lineNumber: 177,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                            lineNumber: 175,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                        lineNumber: 165,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
                lineNumber: 160,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx",
        lineNumber: 107,
        columnNumber: 5
    }, this);
}
}),
"[project]/modules/wiki-beta/interfaces/components/WikiBetaBlockEditorView.tsx [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// Moved to modules/content as BlockEditorView. Transitional re-export during wiki-beta decomposition.
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/content/api/index.ts [app-ssr] (ecmascript) <locals>");
;
}),
"[project]/modules/wiki-beta/interfaces/components/WikiBetaDocumentsView.tsx [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// Moved to modules/asset as AssetDocumentsView. Transitional re-export during wiki-beta decomposition.
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/asset/api/index.ts [app-ssr] (ecmascript) <locals>");
;
}),
"[project]/modules/wiki-beta/interfaces/components/WikiBetaLibrariesView.tsx [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// Moved to modules/asset as LibrariesView. Transitional re-export during wiki-beta decomposition.
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/asset/api/index.ts [app-ssr] (ecmascript) <locals>");
;
}),
"[project]/modules/wiki-beta/interfaces/components/WikiBetaLibraryTableView.tsx [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// Moved to modules/asset as LibraryTableView. Transitional re-export during wiki-beta decomposition.
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$asset$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/asset/api/index.ts [app-ssr] (ecmascript) <locals>");
;
}),
"[project]/modules/wiki-beta/interfaces/components/WikiBetaPagesDnDView.tsx [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// Moved to modules/content as PagesDnDView. Transitional re-export during wiki-beta decomposition.
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/content/api/index.ts [app-ssr] (ecmascript) <locals>");
;
}),
"[project]/modules/wiki-beta/interfaces/components/WikiBetaPagesView.tsx [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// Moved to modules/content as PagesView. Transitional re-export during wiki-beta decomposition.
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/content/api/index.ts [app-ssr] (ecmascript) <locals>");
;
}),
"[project]/modules/wiki-beta/interfaces/components/WikiBetaRagQueryView.tsx [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// Moved to modules/retrieval as RagQueryView. Transitional re-export during wiki-beta decomposition.
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$retrieval$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/retrieval/api/index.ts [app-ssr] (ecmascript) <locals>");
;
}),
"[project]/modules/wiki-beta/api/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Module: wiki-beta
 * Layer: api/barrel
 * Purpose: Public cross-module API boundary for the WikiBeta domain.
 *
 * Other modules MUST import from here — never from domain/, application/,
 * infrastructure/, or interfaces/ directly.
 */ // ─── Core entity types ────────────────────────────────────────────────────────
__turbopack_context__.s([]);
// ─── Application functions — exposed for cross-module orchestration ───────────
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$application$2f$use$2d$cases$2f$wiki$2d$beta$2d$rag$2e$use$2d$case$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/wiki-beta/application/use-cases/wiki-beta-rag.use-case.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$application$2f$use$2d$cases$2f$wiki$2d$beta$2d$pages$2e$use$2d$case$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/wiki-beta/application/use-cases/wiki-beta-pages.use-case.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$application$2f$use$2d$cases$2f$wiki$2d$beta$2d$libraries$2e$use$2d$case$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/wiki-beta/application/use-cases/wiki-beta-libraries.use-case.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$application$2f$use$2d$cases$2f$wiki$2d$beta$2d$content$2d$tree$2e$use$2d$case$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/wiki-beta/application/use-cases/wiki-beta-content-tree.use-case.ts [app-ssr] (ecmascript)");
// ─── UI components ────────────────────────────────────────────────────────────
// wiki-beta-native component
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$interfaces$2f$components$2f$WikiBetaWorkspaceView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/wiki-beta/interfaces/components/WikiBetaWorkspaceView.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$interfaces$2f$components$2f$WikiBetaOverviewView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/wiki-beta/interfaces/components/WikiBetaOverviewView.tsx [app-ssr] (ecmascript)");
// Transitional re-exports — delegate to canonical bounded-context modules
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$interfaces$2f$components$2f$WikiBetaBlockEditorView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/wiki-beta/interfaces/components/WikiBetaBlockEditorView.tsx [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$interfaces$2f$components$2f$WikiBetaDocumentsView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/wiki-beta/interfaces/components/WikiBetaDocumentsView.tsx [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$interfaces$2f$components$2f$WikiBetaLibrariesView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/wiki-beta/interfaces/components/WikiBetaLibrariesView.tsx [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$interfaces$2f$components$2f$WikiBetaLibraryTableView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/wiki-beta/interfaces/components/WikiBetaLibraryTableView.tsx [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$interfaces$2f$components$2f$WikiBetaPagesDnDView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/wiki-beta/interfaces/components/WikiBetaPagesDnDView.tsx [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$interfaces$2f$components$2f$WikiBetaPagesView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/wiki-beta/interfaces/components/WikiBetaPagesView.tsx [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$interfaces$2f$components$2f$WikiBetaRagQueryView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/wiki-beta/interfaces/components/WikiBetaRagQueryView.tsx [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$interfaces$2f$components$2f$WikiBetaRagView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/wiki-beta/interfaces/components/WikiBetaRagView.tsx [app-ssr] (ecmascript) <locals>");
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
;
;
;
}),
];

//# sourceMappingURL=modules_wiki-beta_36c85f23._.js.map