module.exports = [
"[project]/modules/content/domain/value-objects/block-content.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Module: content
 * Layer: domain/value-object
 * Purpose: BlockContent — immutable typed content snapshot for a Block.
 *
 * BlockContent is a VALUE OBJECT: equality is determined by value, not identity.
 * Changing any property produces a conceptually new BlockContent.
 *
 * Supported block types follow the Notion-like content model:
 *   text, heading-1/2/3, image, code, bullet-list, numbered-list, divider, quote.
 *
 * The domain layer keeps this type-only (no Zod) to remain framework-free.
 * Zod schemas live in the application/dto layer.
 */ // ── Block types ───────────────────────────────────────────────────────────────
__turbopack_context__.s([
    "BLOCK_TYPES",
    ()=>BLOCK_TYPES,
    "blockContentEquals",
    ()=>blockContentEquals,
    "emptyTextBlockContent",
    ()=>emptyTextBlockContent
]);
const BLOCK_TYPES = [
    "text",
    "heading-1",
    "heading-2",
    "heading-3",
    "image",
    "code",
    "bullet-list",
    "numbered-list",
    "divider",
    "quote"
];
function blockContentEquals(a, b) {
    if (a.type !== b.type || a.text !== b.text) return false;
    if (a.properties === undefined && b.properties === undefined) return true;
    if (a.properties === undefined || b.properties === undefined) return false;
    const sortedKeys = (obj)=>JSON.stringify(obj, Object.keys(obj).sort());
    return sortedKeys(a.properties) === sortedKeys(b.properties);
}
function emptyTextBlockContent() {
    return {
        type: "text",
        text: ""
    };
}
}),
"[project]/modules/content/domain/entities/content-page.entity.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Module: content
 * Layer: domain/entity
 * Purpose: Page aggregate root — the central document unit in the Content domain.
 */ __turbopack_context__.s([
    "CONTENT_PAGE_STATUSES",
    ()=>CONTENT_PAGE_STATUSES
]);
const CONTENT_PAGE_STATUSES = [
    "active",
    "archived"
];
}),
"[project]/modules/content/application/dto/content.dto.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AddContentBlockSchema",
    ()=>AddContentBlockSchema,
    "ArchiveContentPageSchema",
    ()=>ArchiveContentPageSchema,
    "BlockContentSchema",
    ()=>BlockContentSchema,
    "BlockTypeSchema",
    ()=>BlockTypeSchema,
    "ContentPageStatusSchema",
    ()=>ContentPageStatusSchema,
    "CreateContentPageSchema",
    ()=>CreateContentPageSchema,
    "CreateContentVersionSchema",
    ()=>CreateContentVersionSchema,
    "DeleteContentBlockSchema",
    ()=>DeleteContentBlockSchema,
    "MoveContentPageSchema",
    ()=>MoveContentPageSchema,
    "RenameContentPageSchema",
    ()=>RenameContentPageSchema,
    "ReorderContentPageBlocksSchema",
    ()=>ReorderContentPageBlocksSchema,
    "UpdateContentBlockSchema",
    ()=>UpdateContentBlockSchema
]);
/**
 * Module: content
 * Layer: application/dto
 * Purpose: Zod-validated input schemas for Content use cases.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$lib$2d$zod$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/lib-zod/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-ssr] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$domain$2f$value$2d$objects$2f$block$2d$content$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/content/domain/value-objects/block-content.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$domain$2f$entities$2f$content$2d$page$2e$entity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/content/domain/entities/content-page.entity.ts [app-ssr] (ecmascript)");
;
;
;
const AccountScopeSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    accountId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1)
});
const BlockTypeSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum(__TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$domain$2f$value$2d$objects$2f$block$2d$content$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BLOCK_TYPES"]);
const BlockContentSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    type: BlockTypeSchema,
    text: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    properties: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].unknown()).optional()
});
const CreateContentPageSchema = AccountScopeSchema.extend({
    workspaceId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).optional(),
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).max(300),
    parentPageId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).nullable().optional(),
    createdByUserId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1)
});
const RenameContentPageSchema = AccountScopeSchema.extend({
    pageId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    title: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).max(300)
});
const MoveContentPageSchema = AccountScopeSchema.extend({
    pageId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    targetParentPageId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1).nullable()
});
const ArchiveContentPageSchema = AccountScopeSchema.extend({
    pageId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1)
});
const ReorderContentPageBlocksSchema = AccountScopeSchema.extend({
    pageId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    blockIds: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1))
});
const AddContentBlockSchema = AccountScopeSchema.extend({
    pageId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    content: BlockContentSchema,
    index: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().nonnegative().optional()
});
const UpdateContentBlockSchema = AccountScopeSchema.extend({
    blockId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    content: BlockContentSchema
});
const DeleteContentBlockSchema = AccountScopeSchema.extend({
    blockId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1)
});
const CreateContentVersionSchema = AccountScopeSchema.extend({
    pageId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    label: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().max(100).optional(),
    createdByUserId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1)
});
const ContentPageStatusSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum(__TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$domain$2f$entities$2f$content$2d$page$2e$entity$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CONTENT_PAGE_STATUSES"]);
}),
"[project]/modules/content/application/use-cases/content-page.use-cases.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ArchiveContentPageUseCase",
    ()=>ArchiveContentPageUseCase,
    "CreateContentPageUseCase",
    ()=>CreateContentPageUseCase,
    "GetContentPageTreeUseCase",
    ()=>GetContentPageTreeUseCase,
    "GetContentPageUseCase",
    ()=>GetContentPageUseCase,
    "ListContentPagesUseCase",
    ()=>ListContentPagesUseCase,
    "MoveContentPageUseCase",
    ()=>MoveContentPageUseCase,
    "RenameContentPageUseCase",
    ()=>RenameContentPageUseCase,
    "ReorderContentPageBlocksUseCase",
    ()=>ReorderContentPageBlocksUseCase,
    "buildContentPageTree",
    ()=>buildContentPageTree
]);
/**
 * Module: content
 * Layer: application/use-cases
 * Purpose: Page use cases — create, rename, move, reorder blocks, archive, list.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$application$2f$dto$2f$content$2e$dto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/content/application/dto/content.dto.ts [app-ssr] (ecmascript)");
;
;
function buildContentPageTree(pages) {
    const map = new Map();
    for (const page of pages){
        map.set(page.id, {
            ...page,
            children: []
        });
    }
    const roots = [];
    for (const node of map.values()){
        if (node.parentPageId === null || !map.has(node.parentPageId)) {
            roots.push(node);
        } else {
            const parent = map.get(node.parentPageId);
            parent.children.push(node);
        }
    }
    const sortByOrder = (nodes)=>{
        nodes.sort((a, b)=>a.order - b.order);
        for (const n of nodes)sortByOrder(n.children);
    };
    sortByOrder(roots);
    return roots;
}
class CreateContentPageUseCase {
    repo;
    constructor(repo){
        this.repo = repo;
    }
    async execute(input) {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$application$2f$dto$2f$content$2e$dto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CreateContentPageSchema"].safeParse(input);
        if (!parsed.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);
        }
        const { accountId, workspaceId, title, parentPageId, createdByUserId } = parsed.data;
        const page = await this.repo.create({
            accountId,
            workspaceId,
            title: title.trim(),
            parentPageId: parentPageId ?? null,
            createdByUserId
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(page.id, Date.now());
    }
}
class RenameContentPageUseCase {
    repo;
    constructor(repo){
        this.repo = repo;
    }
    async execute(input) {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$application$2f$dto$2f$content$2e$dto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RenameContentPageSchema"].safeParse(input);
        if (!parsed.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);
        }
        const { accountId, pageId, title } = parsed.data;
        const updated = await this.repo.rename({
            accountId,
            pageId,
            title: title.trim()
        });
        if (!updated) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CONTENT_PAGE_NOT_FOUND", "Page not found.");
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(updated.id, Date.now());
    }
}
class MoveContentPageUseCase {
    repo;
    constructor(repo){
        this.repo = repo;
    }
    async execute(input) {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$application$2f$dto$2f$content$2e$dto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MoveContentPageSchema"].safeParse(input);
        if (!parsed.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);
        }
        const { accountId, pageId, targetParentPageId } = parsed.data;
        if (pageId === targetParentPageId) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CONTENT_PAGE_CIRCULAR_MOVE", "A page cannot be its own parent.");
        }
        const updated = await this.repo.move({
            accountId,
            pageId,
            targetParentPageId
        });
        if (!updated) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CONTENT_PAGE_NOT_FOUND", "Page not found.");
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(updated.id, Date.now());
    }
}
class ArchiveContentPageUseCase {
    repo;
    constructor(repo){
        this.repo = repo;
    }
    async execute(input) {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$application$2f$dto$2f$content$2e$dto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ArchiveContentPageSchema"].safeParse(input);
        if (!parsed.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);
        }
        const { accountId, pageId } = parsed.data;
        const updated = await this.repo.archive(accountId, pageId);
        if (!updated) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CONTENT_PAGE_NOT_FOUND", "Page not found.");
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(updated.id, Date.now());
    }
}
class ReorderContentPageBlocksUseCase {
    repo;
    constructor(repo){
        this.repo = repo;
    }
    async execute(input) {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$application$2f$dto$2f$content$2e$dto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ReorderContentPageBlocksSchema"].safeParse(input);
        if (!parsed.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);
        }
        const { accountId, pageId, blockIds } = parsed.data;
        const updated = await this.repo.reorderBlocks({
            accountId,
            pageId,
            blockIds
        });
        if (!updated) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CONTENT_PAGE_NOT_FOUND", "Page not found.");
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(updated.id, Date.now());
    }
}
class GetContentPageUseCase {
    repo;
    constructor(repo){
        this.repo = repo;
    }
    async execute(accountId, pageId) {
        if (!accountId.trim() || !pageId.trim()) return null;
        return this.repo.findById(accountId, pageId);
    }
}
class ListContentPagesUseCase {
    repo;
    constructor(repo){
        this.repo = repo;
    }
    async execute(accountId) {
        if (!accountId.trim()) return [];
        return this.repo.listByAccountId(accountId);
    }
}
class GetContentPageTreeUseCase {
    repo;
    constructor(repo){
        this.repo = repo;
    }
    async execute(accountId) {
        if (!accountId.trim()) return [];
        const pages = await this.repo.listByAccountId(accountId);
        return buildContentPageTree(pages);
    }
}
}),
"[project]/modules/content/application/use-cases/content-block.use-cases.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AddContentBlockUseCase",
    ()=>AddContentBlockUseCase,
    "DeleteContentBlockUseCase",
    ()=>DeleteContentBlockUseCase,
    "ListContentBlocksUseCase",
    ()=>ListContentBlocksUseCase,
    "UpdateContentBlockUseCase",
    ()=>UpdateContentBlockUseCase
]);
/**
 * Module: content
 * Layer: application/use-cases
 * Purpose: Block use cases — add, update, delete, list.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$application$2f$dto$2f$content$2e$dto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/content/application/dto/content.dto.ts [app-ssr] (ecmascript)");
;
;
class AddContentBlockUseCase {
    repo;
    constructor(repo){
        this.repo = repo;
    }
    async execute(input) {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$application$2f$dto$2f$content$2e$dto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AddContentBlockSchema"].safeParse(input);
        if (!parsed.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CONTENT_BLOCK_INVALID_INPUT", parsed.error.message);
        }
        const { accountId, pageId, content, index } = parsed.data;
        const block = await this.repo.add({
            accountId,
            pageId,
            content,
            index
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(block.id, Date.now());
    }
}
class UpdateContentBlockUseCase {
    repo;
    constructor(repo){
        this.repo = repo;
    }
    async execute(input) {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$application$2f$dto$2f$content$2e$dto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UpdateContentBlockSchema"].safeParse(input);
        if (!parsed.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CONTENT_BLOCK_INVALID_INPUT", parsed.error.message);
        }
        const { accountId, blockId, content } = parsed.data;
        const updated = await this.repo.update({
            accountId,
            blockId,
            content
        });
        if (!updated) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CONTENT_BLOCK_NOT_FOUND", "Block not found.");
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(updated.id, Date.now());
    }
}
class DeleteContentBlockUseCase {
    repo;
    constructor(repo){
        this.repo = repo;
    }
    async execute(input) {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$application$2f$dto$2f$content$2e$dto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DeleteContentBlockSchema"].safeParse(input);
        if (!parsed.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandFailureFrom"])("CONTENT_BLOCK_INVALID_INPUT", parsed.error.message);
        }
        const { accountId, blockId } = parsed.data;
        await this.repo.delete(accountId, blockId);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["commandSuccess"])(blockId, Date.now());
    }
}
class ListContentBlocksUseCase {
    repo;
    constructor(repo){
        this.repo = repo;
    }
    async execute(accountId, pageId) {
        if (!accountId.trim() || !pageId.trim()) return [];
        return this.repo.listByPageId(accountId, pageId);
    }
}
}),
"[project]/modules/content/infrastructure/firebase/FirebaseContentPageRepository.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseContentPageRepository",
    ()=>FirebaseContentPageRepository
]);
/**
 * Module: content
 * Layer: infrastructure/firebase
 * Purpose: Firebase Firestore implementation of ContentPageRepository.
 *
 * Firestore collection: accounts/{accountId}/contentPages/{pageId}
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$lib$2d$uuid$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/lib-uuid/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v7$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist-node/v7.js [app-ssr] (ecmascript) <export default as v7>");
;
;
;
function pagesCol(db, accountId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collection"])(db, "accounts", accountId, "contentPages");
}
function pageDoc(db, accountId, pageId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doc"])(db, "accounts", accountId, "contentPages", pageId);
}
function toContentPage(id, data) {
    return {
        id,
        accountId: typeof data.accountId === "string" ? data.accountId : "",
        workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : undefined,
        title: typeof data.title === "string" ? data.title : "",
        slug: typeof data.slug === "string" ? data.slug : "",
        parentPageId: typeof data.parentPageId === "string" ? data.parentPageId : null,
        order: typeof data.order === "number" ? data.order : 0,
        blockIds: Array.isArray(data.blockIds) ? data.blockIds.filter((v)=>typeof v === "string") : [],
        status: data.status === "archived" ? "archived" : "active",
        createdByUserId: typeof data.createdByUserId === "string" ? data.createdByUserId : "",
        createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
        updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : ""
    };
}
function slugify(title) {
    return title.trim().toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100) || "page";
}
class FirebaseContentPageRepository {
    get db() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFirestore"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firebaseClientApp"]);
    }
    async create(input) {
        const nowISO = new Date().toISOString();
        const slug = slugify(input.title);
        const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v7$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__["v7"])();
        const existing = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])(pagesCol(this.db, input.accountId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["where"])("parentPageId", "==", input.parentPageId ?? null)));
        const order = existing.size;
        const docRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doc"])(pagesCol(this.db, input.accountId), id);
        const data = {
            accountId: input.accountId,
            title: input.title,
            slug,
            parentPageId: input.parentPageId ?? null,
            order,
            blockIds: [],
            status: "active",
            createdByUserId: input.createdByUserId,
            createdAtISO: nowISO,
            updatedAtISO: nowISO,
            createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        };
        if (input.workspaceId) data.workspaceId = input.workspaceId;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setDoc"])(docRef, data);
        return toContentPage(id, {
            ...data,
            id
        });
    }
    async rename(input) {
        const ref = pageDoc(this.db, input.accountId, input.pageId);
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDoc"])(ref);
        if (!snap.exists()) return null;
        const nowISO = new Date().toISOString();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateDoc"])(ref, {
            title: input.title,
            slug: slugify(input.title),
            updatedAtISO: nowISO,
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
        const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDoc"])(ref);
        if (!updated.exists()) return null;
        return toContentPage(updated.id, updated.data());
    }
    async move(input) {
        const ref = pageDoc(this.db, input.accountId, input.pageId);
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDoc"])(ref);
        if (!snap.exists()) return null;
        const nowISO = new Date().toISOString();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateDoc"])(ref, {
            parentPageId: input.targetParentPageId,
            updatedAtISO: nowISO,
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
        const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDoc"])(ref);
        if (!updated.exists()) return null;
        return toContentPage(updated.id, updated.data());
    }
    async reorderBlocks(input) {
        const ref = pageDoc(this.db, input.accountId, input.pageId);
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDoc"])(ref);
        if (!snap.exists()) return null;
        const nowISO = new Date().toISOString();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateDoc"])(ref, {
            blockIds: [
                ...input.blockIds
            ],
            updatedAtISO: nowISO,
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
        const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDoc"])(ref);
        if (!updated.exists()) return null;
        return toContentPage(updated.id, updated.data());
    }
    async archive(accountId, pageId) {
        const ref = pageDoc(this.db, accountId, pageId);
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDoc"])(ref);
        if (!snap.exists()) return null;
        const nowISO = new Date().toISOString();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateDoc"])(ref, {
            status: "archived",
            updatedAtISO: nowISO,
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
        const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDoc"])(ref);
        if (!updated.exists()) return null;
        return toContentPage(updated.id, updated.data());
    }
    async findById(accountId, pageId) {
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDoc"])(pageDoc(this.db, accountId, pageId));
        if (!snap.exists()) return null;
        return toContentPage(snap.id, snap.data());
    }
    async listByAccountId(accountId) {
        const snaps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])(pagesCol(this.db, accountId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["where"])("status", "==", "active"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["orderBy"])("order", "asc")));
        return snaps.docs.map((d)=>toContentPage(d.id, d.data()));
    }
    async listByWorkspaceId(accountId, workspaceId) {
        const snaps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])(pagesCol(this.db, accountId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["where"])("workspaceId", "==", workspaceId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["where"])("status", "==", "active"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["orderBy"])("order", "asc")));
        return snaps.docs.map((d)=>toContentPage(d.id, d.data()));
    }
}
}),
"[project]/modules/content/infrastructure/firebase/FirebaseContentBlockRepository.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseContentBlockRepository",
    ()=>FirebaseContentBlockRepository
]);
/**
 * Module: content
 * Layer: infrastructure/firebase
 * Purpose: Firebase Firestore implementation of ContentBlockRepository.
 *
 * Firestore collection: accounts/{accountId}/contentBlocks/{blockId}
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$lib$2d$uuid$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/lib-uuid/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v7$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist-node/v7.js [app-ssr] (ecmascript) <export default as v7>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$domain$2f$value$2d$objects$2f$block$2d$content$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/content/domain/value-objects/block-content.ts [app-ssr] (ecmascript)");
;
;
;
;
function blocksCol(db, accountId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collection"])(db, "accounts", accountId, "contentBlocks");
}
function blockDoc(db, accountId, blockId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doc"])(db, "accounts", accountId, "contentBlocks", blockId);
}
const VALID_BLOCK_TYPES = new Set(__TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$domain$2f$value$2d$objects$2f$block$2d$content$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BLOCK_TYPES"]);
function toBlockContent(raw) {
    if (typeof raw !== "object" || raw === null) return {
        type: "text",
        text: ""
    };
    const obj = raw;
    const type = typeof obj.type === "string" && VALID_BLOCK_TYPES.has(obj.type) ? obj.type : "text";
    return {
        type,
        text: typeof obj.text === "string" ? obj.text : "",
        properties: typeof obj.properties === "object" && obj.properties !== null ? obj.properties : undefined
    };
}
function toContentBlock(id, data) {
    return {
        id,
        pageId: typeof data.pageId === "string" ? data.pageId : "",
        accountId: typeof data.accountId === "string" ? data.accountId : "",
        content: toBlockContent(data.content),
        order: typeof data.order === "number" ? data.order : 0,
        createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
        updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : ""
    };
}
class FirebaseContentBlockRepository {
    get db() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFirestore"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["firebaseClientApp"]);
    }
    async add(input) {
        const nowISO = new Date().toISOString();
        const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v7$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__["v7"])();
        const existing = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])(blocksCol(this.db, input.accountId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["where"])("pageId", "==", input.pageId)));
        const order = input.index !== undefined ? input.index : existing.size;
        const data = {
            pageId: input.pageId,
            accountId: input.accountId,
            content: input.content,
            order,
            createdAtISO: nowISO,
            updatedAtISO: nowISO,
            createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        };
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setDoc"])(blockDoc(this.db, input.accountId, id), data);
        return toContentBlock(id, {
            ...data
        });
    }
    async update(input) {
        const ref = blockDoc(this.db, input.accountId, input.blockId);
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDoc"])(ref);
        if (!snap.exists()) return null;
        const nowISO = new Date().toISOString();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateDoc"])(ref, {
            content: input.content,
            updatedAtISO: nowISO,
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
        const updated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDoc"])(ref);
        if (!updated.exists()) return null;
        return toContentBlock(updated.id, updated.data());
    }
    async delete(accountId, blockId) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteDoc"])(blockDoc(this.db, accountId, blockId));
    }
    async findById(accountId, blockId) {
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDoc"])(blockDoc(this.db, accountId, blockId));
        if (!snap.exists()) return null;
        return toContentBlock(snap.id, snap.data());
    }
    async listByPageId(accountId, pageId) {
        const snaps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])(blocksCol(this.db, accountId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["where"])("pageId", "==", pageId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["orderBy"])("order", "asc")));
        return snaps.docs.map((d)=>toContentBlock(d.id, d.data()));
    }
}
}),
"[project]/modules/content/api/content-facade.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Module: content
 * Layer: api
 * Purpose: ContentFacade — the ONLY authorised entry point for cross-domain
 * access to the Content domain.
 *
 * BOUNDARY RULE:
 *   Other modules MUST import from here:
 *     import { contentFacade } from "@/modules/content";
 *   They must NEVER reach into domain/, application/, infrastructure/ or
 *   interfaces/ directly.
 */ __turbopack_context__.s([
    "ContentFacade",
    ()=>ContentFacade,
    "contentFacade",
    ()=>contentFacade
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$application$2f$use$2d$cases$2f$content$2d$page$2e$use$2d$cases$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/content/application/use-cases/content-page.use-cases.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$application$2f$use$2d$cases$2f$content$2d$block$2e$use$2d$cases$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/content/application/use-cases/content-block.use-cases.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$infrastructure$2f$firebase$2f$FirebaseContentPageRepository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/content/infrastructure/firebase/FirebaseContentPageRepository.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$infrastructure$2f$firebase$2f$FirebaseContentBlockRepository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/content/infrastructure/firebase/FirebaseContentBlockRepository.ts [app-ssr] (ecmascript)");
;
;
;
;
class ContentFacade {
    pageRepo;
    blockRepo;
    constructor(pageRepo = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$infrastructure$2f$firebase$2f$FirebaseContentPageRepository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FirebaseContentPageRepository"](), blockRepo = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$infrastructure$2f$firebase$2f$FirebaseContentBlockRepository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FirebaseContentBlockRepository"]()){
        this.pageRepo = pageRepo;
        this.blockRepo = blockRepo;
    }
    async createPage(params) {
        const result = await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$application$2f$use$2d$cases$2f$content$2d$page$2e$use$2d$cases$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CreateContentPageUseCase"](this.pageRepo).execute({
            accountId: params.accountId,
            workspaceId: params.workspaceId,
            title: params.title,
            parentPageId: params.parentPageId ?? null,
            createdByUserId: params.createdByUserId
        });
        return result.success ? result.aggregateId : null;
    }
    async renamePage(params) {
        const result = await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$application$2f$use$2d$cases$2f$content$2d$page$2e$use$2d$cases$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RenameContentPageUseCase"](this.pageRepo).execute(params);
        return result.success;
    }
    async movePage(params) {
        const result = await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$application$2f$use$2d$cases$2f$content$2d$page$2e$use$2d$cases$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MoveContentPageUseCase"](this.pageRepo).execute(params);
        return result.success;
    }
    async archivePage(accountId, pageId) {
        const result = await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$application$2f$use$2d$cases$2f$content$2d$page$2e$use$2d$cases$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ArchiveContentPageUseCase"](this.pageRepo).execute({
            accountId,
            pageId
        });
        return result.success;
    }
    async getPage(accountId, pageId) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$application$2f$use$2d$cases$2f$content$2d$page$2e$use$2d$cases$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GetContentPageUseCase"](this.pageRepo).execute(accountId, pageId);
    }
    async listPages(accountId) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$application$2f$use$2d$cases$2f$content$2d$page$2e$use$2d$cases$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ListContentPagesUseCase"](this.pageRepo).execute(accountId);
    }
    async getPageTree(accountId) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$application$2f$use$2d$cases$2f$content$2d$page$2e$use$2d$cases$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GetContentPageTreeUseCase"](this.pageRepo).execute(accountId);
    }
    async addBlock(params) {
        const result = await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$application$2f$use$2d$cases$2f$content$2d$block$2e$use$2d$cases$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AddContentBlockUseCase"](this.blockRepo).execute({
            accountId: params.accountId,
            pageId: params.pageId,
            content: params.content,
            index: params.index
        });
        return result.success ? result.aggregateId : null;
    }
    async updateBlock(params) {
        const result = await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$application$2f$use$2d$cases$2f$content$2d$block$2e$use$2d$cases$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UpdateContentBlockUseCase"](this.blockRepo).execute(params);
        return result.success;
    }
    async deleteBlock(accountId, blockId) {
        const result = await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$application$2f$use$2d$cases$2f$content$2d$block$2e$use$2d$cases$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DeleteContentBlockUseCase"](this.blockRepo).execute({
            accountId,
            blockId
        });
        return result.success;
    }
    async listBlocks(accountId, pageId) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$application$2f$use$2d$cases$2f$content$2d$block$2e$use$2d$cases$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ListContentBlocksUseCase"](this.blockRepo).execute(accountId, pageId);
    }
    async listVersions(_accountId, _pageId) {
        return [];
    }
}
const contentFacade = new ContentFacade();
}),
"[project]/modules/content/application/block-service.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BlockService",
    ()=>BlockService
]);
/**
 * Module: content
 * Layer: application
 * Purpose: BlockService — orchestrates block updates and fires ContentUpdatedEvent.
 *
 * Follows Occam's Razor: minimal logic to prove the event-driven loop.
 * The service wraps the existing UpdateContentBlockUseCase and adds event
 * publishing so downstream modules (knowledge, AI) can react.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$shared$2f$domain$2f$events$2f$content$2d$updated$2e$event$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/shared/domain/events/content-updated.event.ts [app-ssr] (ecmascript)");
;
class BlockService {
    blockRepo;
    eventBus;
    constructor(blockRepo, eventBus){
        this.blockRepo = blockRepo;
        this.eventBus = eventBus;
    }
    /**
   * Update a block's text content and publish a `ContentUpdatedEvent`.
   * Returns the updated block, or `null` when the block is not found.
   */ async updateBlock(input) {
        const updated = await this.blockRepo.update({
            accountId: input.accountId,
            blockId: input.blockId,
            content: {
                type: "text",
                text: input.text
            }
        });
        if (!updated) return null;
        const event = (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$shared$2f$domain$2f$events$2f$content$2d$updated$2e$event$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContentUpdatedEvent"])(updated.pageId, updated.id, input.text);
        await this.eventBus.publish(event);
        return updated;
    }
}
;
}),
"[project]/modules/content/infrastructure/InMemoryContentRepository.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InMemoryContentBlockRepository",
    ()=>InMemoryContentBlockRepository,
    "InMemoryContentPageRepository",
    ()=>InMemoryContentPageRepository
]);
/**
 * Module: content
 * Layer: infrastructure/in-memory
 * Purpose: In-memory adapter for ContentPageRepository and ContentBlockRepository.
 *          Uses plain Map<string, …> — no external database required.
 *          Designed for local demos and unit tests (Occam's Razor).
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$lib$2d$uuid$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/lib-uuid/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v7$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist-node/v7.js [app-ssr] (ecmascript) <export default as v7>");
;
// ─── Helpers ──────────────────────────────────────────────────────────────────
function generateSlug(title) {
    return title.trim().toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}
class InMemoryContentPageRepository {
    pages = new Map();
    async create(input) {
        const now = new Date().toISOString();
        const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v7$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__["v7"])();
        const page = {
            id,
            accountId: input.accountId,
            workspaceId: input.workspaceId,
            title: input.title,
            slug: generateSlug(input.title),
            parentPageId: input.parentPageId ?? null,
            order: this.pages.size,
            blockIds: [],
            status: "active",
            createdByUserId: input.createdByUserId,
            createdAtISO: now,
            updatedAtISO: now
        };
        this.pages.set(id, page);
        return page;
    }
    async rename(input) {
        const page = this.pages.get(input.pageId);
        if (!page) return null;
        const updated = {
            ...page,
            title: input.title,
            slug: generateSlug(input.title),
            updatedAtISO: new Date().toISOString()
        };
        this.pages.set(input.pageId, updated);
        return updated;
    }
    async move(input) {
        const page = this.pages.get(input.pageId);
        if (!page) return null;
        const updated = {
            ...page,
            parentPageId: input.targetParentPageId,
            updatedAtISO: new Date().toISOString()
        };
        this.pages.set(input.pageId, updated);
        return updated;
    }
    async reorderBlocks(input) {
        const page = this.pages.get(input.pageId);
        if (!page) return null;
        const updated = {
            ...page,
            blockIds: [
                ...input.blockIds
            ],
            updatedAtISO: new Date().toISOString()
        };
        this.pages.set(input.pageId, updated);
        return updated;
    }
    async archive(_accountId, pageId) {
        const page = this.pages.get(pageId);
        if (!page) return null;
        const updated = {
            ...page,
            status: "archived",
            updatedAtISO: new Date().toISOString()
        };
        this.pages.set(pageId, updated);
        return updated;
    }
    async findById(_accountId, pageId) {
        return this.pages.get(pageId) ?? null;
    }
    async listByAccountId(accountId) {
        return [
            ...this.pages.values()
        ].filter((p)=>p.accountId === accountId);
    }
    async listByWorkspaceId(accountId, workspaceId) {
        return [
            ...this.pages.values()
        ].filter((p)=>p.accountId === accountId && p.workspaceId === workspaceId);
    }
    /** Append a blockId to a page's blockIds list (called by block operations). */ async appendBlockId(pageId, blockId) {
        const page = this.pages.get(pageId);
        if (!page) return;
        this.pages.set(pageId, {
            ...page,
            blockIds: [
                ...page.blockIds,
                blockId
            ],
            updatedAtISO: new Date().toISOString()
        });
    }
}
class InMemoryContentBlockRepository {
    blocks = new Map();
    async add(input) {
        const now = new Date().toISOString();
        const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v7$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__["v7"])();
        const siblingsCount = [
            ...this.blocks.values()
        ].filter((b)=>b.pageId === input.pageId && b.accountId === input.accountId).length;
        const block = {
            id,
            pageId: input.pageId,
            accountId: input.accountId,
            content: input.content,
            order: input.index ?? siblingsCount,
            createdAtISO: now,
            updatedAtISO: now
        };
        this.blocks.set(id, block);
        return block;
    }
    async update(input) {
        const block = this.blocks.get(input.blockId);
        if (!block) return null;
        const updated = {
            ...block,
            content: input.content,
            updatedAtISO: new Date().toISOString()
        };
        this.blocks.set(input.blockId, updated);
        return updated;
    }
    async delete(_accountId, blockId) {
        this.blocks.delete(blockId);
    }
    async findById(_accountId, blockId) {
        return this.blocks.get(blockId) ?? null;
    }
    async listByPageId(accountId, pageId) {
        return [
            ...this.blocks.values()
        ].filter((b)=>b.accountId === accountId && b.pageId === pageId).sort((a, b)=>a.order - b.order);
    }
}
}),
"[project]/modules/content/api/content-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Module: content
 * Layer: api (cross-module facade)
 * Purpose: ContentApi — lightweight facade that wires in-memory adapters and
 *          exposes the minimal surface needed by the demo-flow script and by
 *          other modules that communicate through the event bus.
 *
 * This is intentionally separate from ContentFacade (which uses Firebase).
 * ContentApi uses InMemory repos so it can run without any external service.
 */ __turbopack_context__.s([
    "ContentApi",
    ()=>ContentApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$application$2f$block$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/content/application/block-service.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$infrastructure$2f$InMemoryContentRepository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/content/infrastructure/InMemoryContentRepository.ts [app-ssr] (ecmascript)");
;
;
class ContentApi {
    pageRepo;
    blockRepo;
    blockService;
    constructor(eventBus){
        this.pageRepo = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$infrastructure$2f$InMemoryContentRepository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InMemoryContentPageRepository"]();
        this.blockRepo = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$infrastructure$2f$InMemoryContentRepository$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InMemoryContentBlockRepository"]();
        this.blockService = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$application$2f$block$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["BlockService"](this.blockRepo, eventBus);
    }
    /** Create a new page in the in-memory store. */ async createPage(accountId, title, createdByUserId = "system") {
        return this.pageRepo.create({
            accountId,
            title,
            createdByUserId
        });
    }
    /** Add a block to an existing page and return the new block. */ async addBlock(accountId, pageId, text) {
        return this.blockRepo.add({
            accountId,
            pageId,
            content: {
                type: "text",
                text
            }
        });
    }
    /**
   * Update a block's text content.
   * Publishes `ContentUpdatedEvent` via the event bus so downstream modules
   * (e.g. knowledge) can react.
   */ async updateBlock(accountId, blockId, text) {
        return this.blockService.updateBlock({
            accountId,
            blockId,
            text
        });
    }
    /** Return all pages for an account. */ async listPages(accountId) {
        return this.pageRepo.listByAccountId(accountId);
    }
    /** Return the page with all its blocks (flat list, ordered). */ async getPageStructure(accountId, pageId) {
        const page = await this.pageRepo.findById(accountId, pageId);
        if (!page) return null;
        const blocks = await this.blockRepo.listByPageId(accountId, pageId);
        return {
            page,
            blocks
        };
    }
}
}),
"[project]/modules/content/interfaces/store/block-editor.store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBlockEditorStore",
    ()=>useBlockEditorStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$lib$2d$zustand$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/lib-zustand/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$lib$2d$uuid$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/lib-uuid/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v7$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist-node/v7.js [app-ssr] (ecmascript) <export default as v7>");
"use client";
;
;
const useBlockEditorStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])((set)=>({
        // Start empty — component calls init() on mount to avoid SSR UUID mismatch.
        blocks: [],
        init () {
            set((state)=>{
                if (state.blocks.length > 0) return state;
                return {
                    blocks: [
                        {
                            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v7$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__["v7"])(),
                            content: ""
                        }
                    ]
                };
            });
        },
        addBlock (afterId) {
            set((state)=>{
                const newBlock = {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v7$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__["v7"])(),
                    content: ""
                };
                if (!afterId) {
                    return {
                        blocks: [
                            ...state.blocks,
                            newBlock
                        ]
                    };
                }
                const idx = state.blocks.findIndex((b)=>b.id === afterId);
                const next = [
                    ...state.blocks
                ];
                next.splice(idx + 1, 0, newBlock);
                return {
                    blocks: next
                };
            });
        },
        updateBlock (id, content) {
            set((state)=>({
                    blocks: state.blocks.map((b)=>b.id === id ? {
                            ...b,
                            content
                        } : b)
                }));
        },
        deleteBlock (id) {
            set((state)=>{
                if (state.blocks.length <= 1) {
                    return {
                        blocks: [
                            {
                                id: state.blocks[0]?.id ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2d$node$2f$v7$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__["v7"])(),
                                content: ""
                            }
                        ]
                    };
                }
                return {
                    blocks: state.blocks.filter((b)=>b.id !== id)
                };
            });
        },
        moveBlock (fromIdx, toIdx) {
            set((state)=>{
                const next = [
                    ...state.blocks
                ];
                const [moved] = next.splice(fromIdx, 1);
                if (!moved) return state;
                next.splice(toIdx, 0, moved);
                return {
                    blocks: next
                };
            });
        }
    }));
}),
"[project]/modules/content/interfaces/components/BlockEditorView.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BlockEditorView",
    ()=>BlockEditorView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/grip-vertical.js [app-ssr] (ecmascript) <export default as GripVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$lib$2d$dragdrop$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/lib-dragdrop/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$adapter$2f$element$2d$adapter$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@atlaskit/pragmatic-drag-and-drop/dist/esm/adapter/element-adapter.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$interfaces$2f$store$2f$block$2d$editor$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/content/interfaces/store/block-editor.store.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function BlockEditorView() {
    const { blocks, addBlock, updateBlock, deleteBlock, moveBlock, init } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$interfaces$2f$store$2f$block$2d$editor$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useBlockEditorStore"])();
    // focusNextRef encodes the intent:
    //   "__after:{id}" → focus the block immediately after the one with the given id
    //   "<id>"         → focus the block with the given id directly
    const focusNextRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const blockRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({});
    const setBlockRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id, el)=>{
        blockRefs.current[id] = el;
    }, []);
    // Seed first block on mount (avoids SSR UUID mismatch)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // Focus resolution after every render
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const intent = focusNextRef.current;
        if (!intent) return;
        let targetId;
        if (intent.startsWith("__after:")) {
            const afterId = intent.slice("__after:".length);
            const idx = blocks.findIndex((b)=>b.id === afterId);
            targetId = blocks[idx + 1]?.id;
        } else {
            targetId = intent;
        }
        if (targetId) {
            const el = blockRefs.current[targetId];
            if (el) {
                el.focus();
                const range = document.createRange();
                const sel = window.getSelection();
                range.selectNodeContents(el);
                range.collapse(false);
                sel?.removeAllRanges();
                sel?.addRange(range);
                focusNextRef.current = null;
            }
        }
    });
    // Set up DnD monitor once
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$adapter$2f$element$2d$adapter$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["monitorForElements"])({
            onDrop ({ source, location }) {
                const target = location.current.dropTargets[0];
                if (!target) return;
                const fromId = source.data["blockId"];
                const toId = target.data["blockId"];
                if (!fromId || !toId || fromId === toId) return;
                const fromIdx = blocks.findIndex((b)=>b.id === fromId);
                const toIdx = blocks.findIndex((b)=>b.id === toId);
                if (fromIdx !== -1 && toIdx !== -1) {
                    moveBlock(fromIdx, toIdx);
                }
            }
        });
    }, [
        blocks,
        moveBlock
    ]);
    const handleKeyDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event, blockId)=>{
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            addBlock(blockId);
            focusNextRef.current = `__after:${blockId}`;
        } else if (event.key === "Backspace") {
            const el = blockRefs.current[blockId];
            if (!el?.textContent) {
                event.preventDefault();
                const idx = blocks.findIndex((b)=>b.id === blockId);
                if (idx > 0) {
                    const prevId = blocks[idx - 1].id;
                    deleteBlock(blockId);
                    focusNextRef.current = prevId;
                }
            }
        }
    }, [
        addBlock,
        blocks,
        deleteBlock
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-4 rounded-xl border border-border/60 bg-card p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs font-semibold uppercase tracking-widest text-primary",
                        children: "Block Editor"
                    }, void 0, false, {
                        fileName: "[project]/modules/content/interfaces/components/BlockEditorView.tsx",
                        lineNumber: 115,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mt-2 text-xl font-semibold text-foreground",
                        children: "區塊編輯器"
                    }, void 0, false, {
                        fileName: "[project]/modules/content/interfaces/components/BlockEditorView.tsx",
                        lineNumber: 116,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 max-w-3xl text-sm text-muted-foreground",
                        children: "極簡 Zustand 狀態管理，支援 Enter 換行、Backspace 刪除合併，以及拖曳重排。"
                    }, void 0, false, {
                        fileName: "[project]/modules/content/interfaces/components/BlockEditorView.tsx",
                        lineNumber: 117,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/content/interfaces/components/BlockEditorView.tsx",
                lineNumber: 114,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-0.5",
                children: blocks.map((block, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BlockRow, {
                        block: block,
                        index: idx,
                        setBlockRef: setBlockRef,
                        onKeyDown: handleKeyDown,
                        onChange: (content)=>updateBlock(block.id, content)
                    }, block.id, false, {
                        fileName: "[project]/modules/content/interfaces/components/BlockEditorView.tsx",
                        lineNumber: 124,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/modules/content/interfaces/components/BlockEditorView.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[11px] text-muted-foreground/60",
                children: [
                    blocks.length,
                    " 個區塊 · Enter 新增 · Backspace 刪除空白區塊 · 拖曳重排"
                ]
            }, void 0, true, {
                fileName: "[project]/modules/content/interfaces/components/BlockEditorView.tsx",
                lineNumber: 135,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/modules/content/interfaces/components/BlockEditorView.tsx",
        lineNumber: 113,
        columnNumber: 5
    }, this);
}
function BlockRow({ block, setBlockRef, onKeyDown, onChange }) {
    const dragHandleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const dropRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleEl = dragHandleRef.current;
        const dropEl = dropRef.current;
        if (!handleEl || !dropEl) return;
        const cleanupDraggable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$adapter$2f$element$2d$adapter$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["draggable"])({
            element: handleEl,
            getInitialData: ()=>({
                    blockId: block.id
                })
        });
        const cleanupDrop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$adapter$2f$element$2d$adapter$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dropTargetForElements"])({
            element: dropEl,
            getData: ()=>({
                    blockId: block.id
                })
        });
        return ()=>{
            cleanupDraggable();
            cleanupDrop();
        };
    }, [
        block.id
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: dropRef,
        className: "group flex items-start gap-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                ref: dragHandleRef,
                type: "button",
                "aria-label": "拖曳重排",
                className: "mt-1 cursor-grab touch-none opacity-0 transition group-hover:opacity-40 hover:!opacity-100 active:cursor-grabbing",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVertical$3e$__["GripVertical"], {
                    className: "size-4 text-muted-foreground"
                }, void 0, false, {
                    fileName: "[project]/modules/content/interfaces/components/BlockEditorView.tsx",
                    lineNumber: 181,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/modules/content/interfaces/components/BlockEditorView.tsx",
                lineNumber: 175,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: (el)=>setBlockRef(block.id, el),
                contentEditable: true,
                suppressContentEditableWarning: true,
                onKeyDown: (e)=>onKeyDown(e, block.id),
                onInput: (e)=>onChange(e.currentTarget.textContent ?? ""),
                "data-placeholder": "輸入文字…",
                className: "min-h-[1.75rem] flex-1 rounded px-2 py-1 text-sm text-foreground outline-none focus:bg-muted/30 empty:before:text-muted-foreground/40 empty:before:content-[attr(data-placeholder)]",
                children: block.content
            }, void 0, false, {
                fileName: "[project]/modules/content/interfaces/components/BlockEditorView.tsx",
                lineNumber: 184,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/modules/content/interfaces/components/BlockEditorView.tsx",
        lineNumber: 174,
        columnNumber: 5
    }, this);
}
}),
"[project]/modules/content/interfaces/components/PagesView.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PagesView",
    ()=>PagesView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/wiki-beta/api/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$application$2f$use$2d$cases$2f$wiki$2d$beta$2d$pages$2e$use$2d$case$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/wiki-beta/application/use-cases/wiki-beta-pages.use-case.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function flattenPages(nodes, depth = 0) {
    const out = [];
    for (const node of nodes){
        out.push({
            id: node.id,
            label: `${"  ".repeat(depth)}${node.title}`
        });
        out.push(...flattenPages(node.children, depth + 1));
    }
    return out;
}
function PageTreeNode({ node, onCreateChild, onRename, onMove }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        className: "space-y-2 rounded-md border border-border/60 bg-background p-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-medium text-foreground",
                        children: node.title
                    }, void 0, false, {
                        fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "rounded-full border border-border/60 px-2 py-0.5 text-[10px] uppercase text-muted-foreground",
                        children: node.slug
                    }, void 0, false, {
                        fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-2 text-xs",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>onCreateChild(node.id),
                        className: "rounded-md border border-border/60 px-2 py-1 text-muted-foreground hover:text-foreground",
                        children: "建立子頁"
                    }, void 0, false, {
                        fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>onRename(node.id, node.title),
                        className: "rounded-md border border-border/60 px-2 py-1 text-muted-foreground hover:text-foreground",
                        children: "重新命名"
                    }, void 0, false, {
                        fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>onMove(node.id, node.parentPageId),
                        className: "rounded-md border border-border/60 px-2 py-1 text-muted-foreground hover:text-foreground",
                        children: "移動"
                    }, void 0, false, {
                        fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            node.children.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "space-y-2 border-l border-border/60 pl-3",
                children: node.children.map((child)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PageTreeNode, {
                        node: child,
                        onCreateChild: onCreateChild,
                        onRename: onRename,
                        onMove: onMove
                    }, child.id, false, {
                        fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
                        lineNumber: 80,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
                lineNumber: 78,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
        lineNumber: 45,
        columnNumber: 5
    }, this);
}
function PagesView({ accountId, workspaceId }) {
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [parentPageId, setParentPageId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [tree, setTree] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const pageOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>flattenPages(tree), [
        tree
    ]);
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        setLoading(true);
        setError(null);
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$application$2f$use$2d$cases$2f$wiki$2d$beta$2d$pages$2e$use$2d$case$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["listWikiBetaPagesTree"])(accountId, workspaceId);
            setTree(result);
        } catch (e) {
            const message = e instanceof Error ? e.message : "Unknown error";
            setError(message);
        } finally{
            setLoading(false);
        }
    }, [
        accountId,
        workspaceId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        void refresh();
    }, [
        refresh
    ]);
    const handleCreate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (targetParentPageId)=>{
        const rawTitle = targetParentPageId ? window.prompt("子頁標題") : title;
        if (!rawTitle) {
            return;
        }
        const finalTitle = rawTitle.trim();
        if (!finalTitle) {
            return;
        }
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$application$2f$use$2d$cases$2f$wiki$2d$beta$2d$pages$2e$use$2d$case$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createWikiBetaPage"])({
                accountId,
                workspaceId,
                title: finalTitle,
                parentPageId: targetParentPageId ?? (parentPageId || null)
            });
            setTitle("");
            setParentPageId("");
            await refresh();
        } catch (e) {
            const message = e instanceof Error ? e.message : "create page failed";
            setError(message);
        }
    }, [
        accountId,
        parentPageId,
        refresh,
        title,
        workspaceId
    ]);
    const handleRename = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (pageId, currentTitle)=>{
        const nextTitle = window.prompt("新的頁面標題", currentTitle);
        if (!nextTitle || !nextTitle.trim()) {
            return;
        }
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$application$2f$use$2d$cases$2f$wiki$2d$beta$2d$pages$2e$use$2d$case$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["renameWikiBetaPage"])({
                accountId,
                pageId,
                title: nextTitle
            });
            await refresh();
        } catch (e) {
            const message = e instanceof Error ? e.message : "rename page failed";
            setError(message);
        }
    }, [
        accountId,
        refresh
    ]);
    const handleMove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (pageId, currentParentId)=>{
        const raw = window.prompt("輸入新的 parent page id，留空代表 root", currentParentId ?? "");
        if (raw === null) {
            return;
        }
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$application$2f$use$2d$cases$2f$wiki$2d$beta$2d$pages$2e$use$2d$case$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["moveWikiBetaPage"])({
                accountId,
                pageId,
                targetParentPageId: raw.trim() ? raw.trim() : null
            });
            await refresh();
        } catch (e) {
            const message = e instanceof Error ? e.message : "move page failed";
            setError(message);
        }
    }, [
        accountId,
        refresh
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-4 rounded-xl border border-border/60 bg-card p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs font-semibold uppercase tracking-widest text-primary",
                        children: "Pages MVP"
                    }, void 0, false, {
                        fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
                        lineNumber: 195,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mt-2 text-xl font-semibold text-foreground",
                        children: "Notion-like Page Tree"
                    }, void 0, false, {
                        fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
                        lineNumber: 196,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 max-w-3xl text-sm text-muted-foreground",
                        children: "目前為最小可行版本：建立、重新命名、移動頁面。slug 由 namespace policy 推導，操作會發佈 domain event。"
                    }, void 0, false, {
                        fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
                        lineNumber: 197,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
                lineNumber: 194,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid gap-2 rounded-lg border border-border/60 bg-muted/20 p-3 md:grid-cols-[1fr_auto_auto]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: title,
                        onChange: (event)=>setTitle(event.target.value),
                        placeholder: "輸入頁面標題",
                        className: "h-9 rounded-md border border-border/60 bg-background px-3 text-sm outline-none focus:border-primary/40"
                    }, void 0, false, {
                        fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
                        lineNumber: 203,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: parentPageId,
                        onChange: (event)=>setParentPageId(event.target.value),
                        className: "h-9 rounded-md border border-border/60 bg-background px-2 text-sm",
                        "aria-label": "Select parent page",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "Root"
                            }, void 0, false, {
                                fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
                                lineNumber: 216,
                                columnNumber: 11
                            }, this),
                            pageOptions.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: option.id,
                                    children: option.label
                                }, option.id, false, {
                                    fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
                                    lineNumber: 218,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
                        lineNumber: 210,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>void handleCreate(null),
                        className: "h-9 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90",
                        children: "建立頁面"
                    }, void 0, false, {
                        fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
                        lineNumber: 223,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
                lineNumber: 202,
                columnNumber: 7
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 text-sm text-muted-foreground",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                        className: "size-4 animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
                        lineNumber: 234,
                        columnNumber: 11
                    }, this),
                    "載入頁面樹中..."
                ]
            }, void 0, true, {
                fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
                lineNumber: 233,
                columnNumber: 9
            }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive",
                children: error
            }, void 0, false, {
                fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
                lineNumber: 238,
                columnNumber: 9
            }, this) : tree.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground",
                children: "尚未建立頁面，先新增第一個 root page。"
            }, void 0, false, {
                fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
                lineNumber: 240,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "space-y-2",
                children: tree.map((node)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PageTreeNode, {
                        node: node,
                        onCreateChild: (pageId)=>void handleCreate(pageId),
                        onRename: (pageId, currentTitle)=>void handleRename(pageId, currentTitle),
                        onMove: (pageId, currentParentId)=>void handleMove(pageId, currentParentId)
                    }, node.id, false, {
                        fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
                        lineNumber: 246,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
                lineNumber: 244,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/modules/content/interfaces/components/PagesView.tsx",
        lineNumber: 193,
        columnNumber: 5
    }, this);
}
}),
"[project]/modules/content/interfaces/components/PagesDnDView.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PagesDnDView",
    ()=>PagesDnDView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/grip-vertical.js [app-ssr] (ecmascript) <export default as GripVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$lib$2d$dragdrop$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/lib-dragdrop/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$adapter$2f$element$2d$adapter$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@atlaskit/pragmatic-drag-and-drop/dist/esm/adapter/element-adapter.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$api$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/wiki-beta/api/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$application$2f$use$2d$cases$2f$wiki$2d$beta$2d$pages$2e$use$2d$case$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/wiki-beta/application/use-cases/wiki-beta-pages.use-case.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function PagesDnDView({ accountId, workspaceId }) {
    const [pages, setPages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        setLoading(true);
        setError(null);
        try {
            const tree = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$application$2f$use$2d$cases$2f$wiki$2d$beta$2d$pages$2e$use$2d$case$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["listWikiBetaPagesTree"])(accountId, workspaceId);
            setPages(tree);
        } catch (e) {
            setError(e instanceof Error ? e.message : "failed to load pages");
        } finally{
            setLoading(false);
        }
    }, [
        accountId,
        workspaceId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        void refresh();
    }, [
        refresh
    ]);
    // DnD monitor: drop page onto another → reparent
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$adapter$2f$element$2d$adapter$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["monitorForElements"])({
            onDrop ({ source, location }) {
                const target = location.current.dropTargets[0];
                if (!target) return;
                const draggedId = source.data["pageId"];
                const targetId = target.data["pageId"];
                if (!draggedId || !targetId || draggedId === targetId) return;
                // Optimistically reorder locally (flat reorder only)
                setPages((prev)=>{
                    const fromIdx = prev.findIndex((p)=>p.id === draggedId);
                    const toIdx = prev.findIndex((p)=>p.id === targetId);
                    if (fromIdx === -1 || toIdx === -1) return prev;
                    const next = [
                        ...prev
                    ];
                    const [moved] = next.splice(fromIdx, 1);
                    if (!moved) return prev;
                    next.splice(toIdx, 0, moved);
                    return next;
                });
                // Persist: move dragged page under target as parent
                void (0, __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$wiki$2d$beta$2f$application$2f$use$2d$cases$2f$wiki$2d$beta$2d$pages$2e$use$2d$case$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["moveWikiBetaPage"])({
                    accountId,
                    pageId: draggedId,
                    targetParentPageId: targetId
                }).catch((e)=>{
                    setError(e instanceof Error ? e.message : "移動失敗");
                    void refresh();
                });
            }
        });
    }, [
        accountId,
        refresh
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "space-y-4 rounded-xl border border-border/60 bg-card p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs font-semibold uppercase tracking-widest text-primary",
                        children: "Pages DnD"
                    }, void 0, false, {
                        fileName: "[project]/modules/content/interfaces/components/PagesDnDView.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mt-2 text-xl font-semibold text-foreground",
                        children: "頁面樹拖曳重組"
                    }, void 0, false, {
                        fileName: "[project]/modules/content/interfaces/components/PagesDnDView.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 max-w-3xl text-sm text-muted-foreground",
                        children: "使用 @atlaskit/pragmatic-drag-and-drop 拖曳頁面至另一個頁面下（重新設定父層）。"
                    }, void 0, false, {
                        fileName: "[project]/modules/content/interfaces/components/PagesDnDView.tsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/content/interfaces/components/PagesDnDView.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 text-sm text-muted-foreground",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                        className: "size-4 animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/modules/content/interfaces/components/PagesDnDView.tsx",
                        lineNumber: 95,
                        columnNumber: 11
                    }, this),
                    "載入頁面中…"
                ]
            }, void 0, true, {
                fileName: "[project]/modules/content/interfaces/components/PagesDnDView.tsx",
                lineNumber: 94,
                columnNumber: 9
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive",
                children: error
            }, void 0, false, {
                fileName: "[project]/modules/content/interfaces/components/PagesDnDView.tsx",
                lineNumber: 101,
                columnNumber: 9
            }, this),
            !loading && pages.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-muted-foreground",
                children: "尚無頁面，請先在「頁面」頁面建立頁面。"
            }, void 0, false, {
                fileName: "[project]/modules/content/interfaces/components/PagesDnDView.tsx",
                lineNumber: 107,
                columnNumber: 9
            }, this),
            pages.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "space-y-1.5",
                children: pages.map((page)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DraggablePage, {
                        page: page
                    }, page.id, false, {
                        fileName: "[project]/modules/content/interfaces/components/PagesDnDView.tsx",
                        lineNumber: 113,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/modules/content/interfaces/components/PagesDnDView.tsx",
                lineNumber: 111,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/modules/content/interfaces/components/PagesDnDView.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
function DraggablePage({ page }) {
    const dragHandleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const itemRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isDragOver, setIsDragOver] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleEl = dragHandleRef.current;
        const itemEl = itemRef.current;
        if (!handleEl || !itemEl) return;
        const cleanupDraggable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$adapter$2f$element$2d$adapter$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["draggable"])({
            element: handleEl,
            getInitialData: ()=>({
                    pageId: page.id
                })
        });
        const cleanupDrop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atlaskit$2f$pragmatic$2d$drag$2d$and$2d$drop$2f$dist$2f$esm$2f$adapter$2f$element$2d$adapter$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dropTargetForElements"])({
            element: itemEl,
            getData: ()=>({
                    pageId: page.id
                }),
            onDragEnter: ()=>setIsDragOver(true),
            onDragLeave: ()=>setIsDragOver(false),
            onDrop: ()=>setIsDragOver(false)
        });
        return ()=>{
            cleanupDraggable();
            cleanupDrop();
        };
    }, [
        page.id
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        ref: itemRef,
        className: `flex items-center gap-2 rounded-md border px-3 py-2 transition ${isDragOver ? "border-primary/60 bg-primary/5" : "border-border/60 bg-background"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                ref: dragHandleRef,
                type: "button",
                "aria-label": "拖曳重排",
                className: "cursor-grab touch-none opacity-30 hover:opacity-80 active:cursor-grabbing",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVertical$3e$__["GripVertical"], {
                    className: "size-4 text-muted-foreground"
                }, void 0, false, {
                    fileName: "[project]/modules/content/interfaces/components/PagesDnDView.tsx",
                    lineNumber: 167,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/modules/content/interfaces/components/PagesDnDView.tsx",
                lineNumber: 161,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex min-w-0 flex-1 items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "truncate text-sm font-medium text-foreground",
                        children: page.title
                    }, void 0, false, {
                        fileName: "[project]/modules/content/interfaces/components/PagesDnDView.tsx",
                        lineNumber: 171,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "shrink-0 rounded-full border border-border/60 px-2 py-0.5 text-[10px] uppercase text-muted-foreground",
                        children: page.slug
                    }, void 0, false, {
                        fileName: "[project]/modules/content/interfaces/components/PagesDnDView.tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this),
                    page.children.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "shrink-0 text-[10px] text-muted-foreground/60",
                        children: [
                            page.children.length,
                            " 子頁面"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/content/interfaces/components/PagesDnDView.tsx",
                        lineNumber: 176,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/content/interfaces/components/PagesDnDView.tsx",
                lineNumber: 170,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/modules/content/interfaces/components/PagesDnDView.tsx",
        lineNumber: 153,
        columnNumber: 5
    }, this);
}
}),
"[project]/modules/content/api/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
/**
 * Module: content
 * Layer: api/barrel
 * Purpose: Public anti-corruption layer — the sole cross-domain entry point
 * for the Content domain.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$api$2f$content$2d$facade$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/content/api/content-facade.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$api$2f$content$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/content/api/content-api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$interfaces$2f$components$2f$BlockEditorView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/content/interfaces/components/BlockEditorView.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$interfaces$2f$store$2f$block$2d$editor$2e$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/content/interfaces/store/block-editor.store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$interfaces$2f$components$2f$PagesView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/content/interfaces/components/PagesView.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$content$2f$interfaces$2f$components$2f$PagesDnDView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/content/interfaces/components/PagesDnDView.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
}),
];

//# sourceMappingURL=modules_content_a59aa723._.js.map