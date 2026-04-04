(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/modules/workspace-feed/application/dto/workspace-feed.dto.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CreateWorkspaceFeedPostSchema",
    ()=>CreateWorkspaceFeedPostSchema,
    "FeedInteractionSchema",
    ()=>FeedInteractionSchema,
    "FeedLimitSchema",
    ()=>FeedLimitSchema,
    "ListAccountFeedSchema",
    ()=>ListAccountFeedSchema,
    "ListWorkspaceFeedSchema",
    ()=>ListWorkspaceFeedSchema,
    "ReplyWorkspaceFeedPostSchema",
    ()=>ReplyWorkspaceFeedPostSchema,
    "RepostWorkspaceFeedPostSchema",
    ()=>RepostWorkspaceFeedPostSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$lib$2d$zod$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/lib-zod/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z>");
;
const AccountScopeSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    accountId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1)
});
const WorkspaceScopeSchema = AccountScopeSchema.extend({
    workspaceId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1)
});
const FeedLimitSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().min(1).max(200).default(50);
const CreateWorkspaceFeedPostSchema = WorkspaceScopeSchema.extend({
    authorAccountId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    content: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1).max(5000)
});
const ReplyWorkspaceFeedPostSchema = WorkspaceScopeSchema.extend({
    parentPostId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    authorAccountId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    content: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1).max(5000)
});
const RepostWorkspaceFeedPostSchema = WorkspaceScopeSchema.extend({
    sourcePostId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    actorAccountId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    comment: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().max(1000).optional()
});
const FeedInteractionSchema = AccountScopeSchema.extend({
    postId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1),
    actorAccountId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1)
});
const ListWorkspaceFeedSchema = WorkspaceScopeSchema.extend({
    limit: FeedLimitSchema.optional()
});
const ListAccountFeedSchema = AccountScopeSchema.extend({
    limit: FeedLimitSchema.optional()
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/workspace-feed/application/use-cases/workspace-feed.use-cases.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BookmarkWorkspaceFeedPostUseCase",
    ()=>BookmarkWorkspaceFeedPostUseCase,
    "CreateWorkspaceFeedPostUseCase",
    ()=>CreateWorkspaceFeedPostUseCase,
    "GetWorkspaceFeedPostUseCase",
    ()=>GetWorkspaceFeedPostUseCase,
    "LikeWorkspaceFeedPostUseCase",
    ()=>LikeWorkspaceFeedPostUseCase,
    "ListAccountWorkspaceFeedUseCase",
    ()=>ListAccountWorkspaceFeedUseCase,
    "ListWorkspaceFeedUseCase",
    ()=>ListWorkspaceFeedUseCase,
    "ReplyWorkspaceFeedPostUseCase",
    ()=>ReplyWorkspaceFeedPostUseCase,
    "RepostWorkspaceFeedPostUseCase",
    ()=>RepostWorkspaceFeedPostUseCase,
    "ShareWorkspaceFeedPostUseCase",
    ()=>ShareWorkspaceFeedPostUseCase,
    "ViewWorkspaceFeedPostUseCase",
    ()=>ViewWorkspaceFeedPostUseCase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/shared-types/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$application$2f$dto$2f$workspace$2d$feed$2e$dto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-feed/application/dto/workspace-feed.dto.ts [app-client] (ecmascript)");
;
;
class CreateWorkspaceFeedPostUseCase {
    repo;
    constructor(repo){
        this.repo = repo;
    }
    async execute(input) {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$application$2f$dto$2f$workspace$2d$feed$2e$dto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CreateWorkspaceFeedPostSchema"].safeParse(input);
        if (!parsed.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_FEED_INVALID_INPUT", parsed.error.message);
        }
        const post = await this.repo.createPost(parsed.data);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(post.id, Date.now());
    }
}
class ReplyWorkspaceFeedPostUseCase {
    repo;
    constructor(repo){
        this.repo = repo;
    }
    async execute(input) {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$application$2f$dto$2f$workspace$2d$feed$2e$dto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReplyWorkspaceFeedPostSchema"].safeParse(input);
        if (!parsed.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_FEED_INVALID_INPUT", parsed.error.message);
        }
        const parent = await this.repo.findById(parsed.data.accountId, parsed.data.parentPostId);
        if (!parent) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_FEED_PARENT_NOT_FOUND", "Parent post not found.");
        }
        if (parent.workspaceId !== parsed.data.workspaceId) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_FEED_WORKSPACE_MISMATCH", "Parent post is in another workspace.");
        }
        const reply = await this.repo.createReply(parsed.data);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(reply.id, Date.now());
    }
}
class RepostWorkspaceFeedPostUseCase {
    repo;
    constructor(repo){
        this.repo = repo;
    }
    async execute(input) {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$application$2f$dto$2f$workspace$2d$feed$2e$dto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RepostWorkspaceFeedPostSchema"].safeParse(input);
        if (!parsed.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_FEED_INVALID_INPUT", parsed.error.message);
        }
        const source = await this.repo.findById(parsed.data.accountId, parsed.data.sourcePostId);
        if (!source) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_FEED_SOURCE_NOT_FOUND", "Source post not found.");
        }
        if (source.workspaceId !== parsed.data.workspaceId) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_FEED_WORKSPACE_MISMATCH", "Source post is in another workspace.");
        }
        const repost = await this.repo.createRepost(parsed.data);
        if (!repost) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_FEED_REPOST_FAILED", "Failed to create repost.");
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(repost.id, Date.now());
    }
}
class LikeWorkspaceFeedPostUseCase {
    postRepo;
    interactionRepo;
    constructor(postRepo, interactionRepo){
        this.postRepo = postRepo;
        this.interactionRepo = interactionRepo;
    }
    async execute(input) {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$application$2f$dto$2f$workspace$2d$feed$2e$dto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FeedInteractionSchema"].safeParse(input);
        if (!parsed.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_FEED_INVALID_INPUT", parsed.error.message);
        }
        const post = await this.postRepo.findById(parsed.data.accountId, parsed.data.postId);
        if (!post) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_FEED_POST_NOT_FOUND", "Post not found.");
        }
        const liked = await this.interactionRepo.like(parsed.data.accountId, parsed.data.postId, parsed.data.actorAccountId);
        if (liked) {
            await this.postRepo.patchCounters(parsed.data.accountId, parsed.data.postId, {
                likeDelta: 1
            });
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(parsed.data.postId, Date.now());
    }
}
class BookmarkWorkspaceFeedPostUseCase {
    postRepo;
    interactionRepo;
    constructor(postRepo, interactionRepo){
        this.postRepo = postRepo;
        this.interactionRepo = interactionRepo;
    }
    async execute(input) {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$application$2f$dto$2f$workspace$2d$feed$2e$dto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FeedInteractionSchema"].safeParse(input);
        if (!parsed.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_FEED_INVALID_INPUT", parsed.error.message);
        }
        const post = await this.postRepo.findById(parsed.data.accountId, parsed.data.postId);
        if (!post) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_FEED_POST_NOT_FOUND", "Post not found.");
        }
        const bookmarked = await this.interactionRepo.bookmark(parsed.data.accountId, parsed.data.postId, parsed.data.actorAccountId);
        if (bookmarked) {
            await this.postRepo.patchCounters(parsed.data.accountId, parsed.data.postId, {
                bookmarkDelta: 1
            });
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(parsed.data.postId, Date.now());
    }
}
class ViewWorkspaceFeedPostUseCase {
    postRepo;
    interactionRepo;
    constructor(postRepo, interactionRepo){
        this.postRepo = postRepo;
        this.interactionRepo = interactionRepo;
    }
    async execute(input) {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$application$2f$dto$2f$workspace$2d$feed$2e$dto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FeedInteractionSchema"].safeParse(input);
        if (!parsed.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_FEED_INVALID_INPUT", parsed.error.message);
        }
        const post = await this.postRepo.findById(parsed.data.accountId, parsed.data.postId);
        if (!post) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_FEED_POST_NOT_FOUND", "Post not found.");
        }
        await this.interactionRepo.view(parsed.data.accountId, parsed.data.postId, parsed.data.actorAccountId);
        await this.postRepo.patchCounters(parsed.data.accountId, parsed.data.postId, {
            viewDelta: 1
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(parsed.data.postId, Date.now());
    }
}
class ShareWorkspaceFeedPostUseCase {
    postRepo;
    interactionRepo;
    constructor(postRepo, interactionRepo){
        this.postRepo = postRepo;
        this.interactionRepo = interactionRepo;
    }
    async execute(input) {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$application$2f$dto$2f$workspace$2d$feed$2e$dto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FeedInteractionSchema"].safeParse(input);
        if (!parsed.success) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_FEED_INVALID_INPUT", parsed.error.message);
        }
        const post = await this.postRepo.findById(parsed.data.accountId, parsed.data.postId);
        if (!post) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandFailureFrom"])("WORKSPACE_FEED_POST_NOT_FOUND", "Post not found.");
        }
        await this.interactionRepo.share(parsed.data.accountId, parsed.data.postId, parsed.data.actorAccountId);
        await this.postRepo.patchCounters(parsed.data.accountId, parsed.data.postId, {
            shareDelta: 1
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$shared$2d$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandSuccess"])(parsed.data.postId, Date.now());
    }
}
class GetWorkspaceFeedPostUseCase {
    repo;
    constructor(repo){
        this.repo = repo;
    }
    async execute(accountId, postId) {
        if (!accountId.trim() || !postId.trim()) return null;
        return this.repo.findById(accountId, postId);
    }
}
class ListWorkspaceFeedUseCase {
    repo;
    constructor(repo){
        this.repo = repo;
    }
    async execute(input) {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$application$2f$dto$2f$workspace$2d$feed$2e$dto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ListWorkspaceFeedSchema"].safeParse(input);
        if (!parsed.success) return [];
        return this.repo.listByWorkspaceId(parsed.data.accountId, parsed.data.workspaceId, parsed.data.limit ?? 50);
    }
}
class ListAccountWorkspaceFeedUseCase {
    repo;
    constructor(repo){
        this.repo = repo;
    }
    async execute(input) {
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$application$2f$dto$2f$workspace$2d$feed$2e$dto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ListAccountFeedSchema"].safeParse(input);
        if (!parsed.success) return [];
        return this.repo.listByAccountId(parsed.data.accountId, parsed.data.limit ?? 50);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/workspace-feed/infrastructure/firebase/FirebaseWorkspaceFeedPostRepository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseWorkspaceFeedPostRepository",
    ()=>FirebaseWorkspaceFeedPostRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$lib$2d$uuid$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/lib-uuid/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v7$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/v7.js [app-client] (ecmascript) <export default as v7>");
;
;
;
function postsCol(db, accountId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(db, "accounts", accountId, "workspaceFeedPosts");
}
function postDoc(db, accountId, postId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(db, "accounts", accountId, "workspaceFeedPosts", postId);
}
function repostMapDoc(db, accountId, actorAccountId, sourcePostId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(db, "accounts", accountId, "workspaceFeedReposts", `${actorAccountId}__${sourcePostId}`);
}
function asString(value, fallback = "") {
    return typeof value === "string" ? value : fallback;
}
function asNumber(value) {
    return typeof value === "number" ? value : 0;
}
function toWorkspaceFeedPost(id, data) {
    const type = asString(data.type, "post");
    return {
        id,
        accountId: asString(data.accountId),
        workspaceId: asString(data.workspaceId),
        authorAccountId: asString(data.authorAccountId),
        type: type === "reply" || type === "repost" ? type : "post",
        content: asString(data.content),
        replyToPostId: typeof data.replyToPostId === "string" ? data.replyToPostId : null,
        repostOfPostId: typeof data.repostOfPostId === "string" ? data.repostOfPostId : null,
        likeCount: asNumber(data.likeCount),
        replyCount: asNumber(data.replyCount),
        repostCount: asNumber(data.repostCount),
        viewCount: asNumber(data.viewCount),
        bookmarkCount: asNumber(data.bookmarkCount),
        shareCount: asNumber(data.shareCount),
        createdAtISO: asString(data.createdAtISO),
        updatedAtISO: asString(data.updatedAtISO)
    };
}
function createBasePostData(accountId, workspaceId, authorAccountId, content, type) {
    const nowISO = new Date().toISOString();
    return {
        accountId,
        workspaceId,
        authorAccountId,
        type,
        content,
        likeCount: 0,
        replyCount: 0,
        repostCount: 0,
        viewCount: 0,
        bookmarkCount: 0,
        shareCount: 0,
        createdAtISO: nowISO,
        updatedAtISO: nowISO,
        createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
        updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
    };
}
class FirebaseWorkspaceFeedPostRepository {
    get db() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirestore"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firebaseClientApp"]);
    }
    async createPost(input) {
        const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v7$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__["v7"])();
        const data = createBasePostData(input.accountId, input.workspaceId, input.authorAccountId, input.content, "post");
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])(postDoc(this.db, input.accountId, id), data);
        return toWorkspaceFeedPost(id, data);
    }
    async createReply(input) {
        const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v7$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__["v7"])();
        const data = {
            ...createBasePostData(input.accountId, input.workspaceId, input.authorAccountId, input.content, "reply"),
            replyToPostId: input.parentPostId,
            repostOfPostId: null
        };
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])(postDoc(this.db, input.accountId, id), data);
        await this.patchCounters(input.accountId, input.parentPostId, {
            replyDelta: 1
        });
        return toWorkspaceFeedPost(id, data);
    }
    async createRepost(input) {
        const mapRef = repostMapDoc(this.db, input.accountId, input.actorAccountId, input.sourcePostId);
        const existingMap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])(mapRef);
        if (existingMap.exists()) {
            const repostPostId = asString(existingMap.data().repostPostId);
            if (!repostPostId) return null;
            return this.findById(input.accountId, repostPostId);
        }
        const source = await this.findById(input.accountId, input.sourcePostId);
        if (!source) return null;
        const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v7$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__["v7"])();
        const content = input.comment?.trim() || source.content;
        const data = {
            ...createBasePostData(input.accountId, input.workspaceId, input.actorAccountId, content, "repost"),
            replyToPostId: null,
            repostOfPostId: input.sourcePostId
        };
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])(postDoc(this.db, input.accountId, id), data);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])(mapRef, {
            accountId: input.accountId,
            workspaceId: input.workspaceId,
            sourcePostId: input.sourcePostId,
            actorAccountId: input.actorAccountId,
            repostPostId: id,
            createdAtISO: new Date().toISOString(),
            createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
        await this.patchCounters(input.accountId, input.sourcePostId, {
            repostDelta: 1
        });
        return toWorkspaceFeedPost(id, data);
    }
    async patchCounters(accountId, postId, patch) {
        const updates = {
            updatedAtISO: new Date().toISOString(),
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        };
        if (patch.likeDelta) updates.likeCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["increment"])(patch.likeDelta);
        if (patch.replyDelta) updates.replyCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["increment"])(patch.replyDelta);
        if (patch.repostDelta) updates.repostCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["increment"])(patch.repostDelta);
        if (patch.viewDelta) updates.viewCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["increment"])(patch.viewDelta);
        if (patch.bookmarkDelta) updates.bookmarkCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["increment"])(patch.bookmarkDelta);
        if (patch.shareDelta) updates.shareCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["increment"])(patch.shareDelta);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(postDoc(this.db, accountId, postId), updates);
    }
    async findById(accountId, postId) {
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])(postDoc(this.db, accountId, postId));
        if (!snap.exists()) return null;
        return toWorkspaceFeedPost(snap.id, snap.data());
    }
    async listByWorkspaceId(accountId, workspaceId, maxRows) {
        const snaps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])(postsCol(this.db, accountId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])("workspaceId", "==", workspaceId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["orderBy"])("createdAtISO", "desc"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["limit"])(maxRows)));
        return snaps.docs.map((row)=>toWorkspaceFeedPost(row.id, row.data()));
    }
    async listByAccountId(accountId, maxRows) {
        const snaps = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])(postsCol(this.db, accountId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["orderBy"])("createdAtISO", "desc"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["limit"])(maxRows)));
        return snaps.docs.map((row)=>toWorkspaceFeedPost(row.id, row.data()));
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/workspace-feed/infrastructure/firebase/FirebaseWorkspaceFeedInteractionRepository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FirebaseWorkspaceFeedInteractionRepository",
    ()=>FirebaseWorkspaceFeedInteractionRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/integration-firebase/client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$lib$2d$uuid$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/lib-uuid/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v7$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/v7.js [app-client] (ecmascript) <export default as v7>");
;
;
;
function postDoc(db, accountId, postId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(db, "accounts", accountId, "workspaceFeedPosts", postId);
}
function likesDoc(db, accountId, postId, actorAccountId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(postDoc(db, accountId, postId), "likes", actorAccountId);
}
function bookmarksDoc(db, accountId, postId, actorAccountId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(postDoc(db, accountId, postId), "bookmarks", actorAccountId);
}
function viewsCol(db, accountId, postId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(postDoc(db, accountId, postId), "views");
}
function sharesCol(db, accountId, postId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(postDoc(db, accountId, postId), "shares");
}
class FirebaseWorkspaceFeedInteractionRepository {
    get db() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirestore"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$integration$2d$firebase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firebaseClientApp"]);
    }
    async like(accountId, postId, actorAccountId) {
        const ref = likesDoc(this.db, accountId, postId, actorAccountId);
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])(ref);
        if (snap.exists()) return false;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])(ref, {
            accountId,
            postId,
            actorAccountId,
            createdAtISO: new Date().toISOString(),
            createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
        return true;
    }
    async bookmark(accountId, postId, actorAccountId) {
        const ref = bookmarksDoc(this.db, accountId, postId, actorAccountId);
        const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])(ref);
        if (snap.exists()) return false;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])(ref, {
            accountId,
            postId,
            actorAccountId,
            createdAtISO: new Date().toISOString(),
            createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
        return true;
    }
    async view(accountId, postId, actorAccountId) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(viewsCol(this.db, accountId, postId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v7$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__["v7"])()), {
            accountId,
            postId,
            actorAccountId,
            createdAtISO: new Date().toISOString(),
            createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
    }
    async share(accountId, postId, actorAccountId) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(sharesCol(this.db, accountId, postId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v7$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v7$3e$__["v7"])()), {
            accountId,
            postId,
            actorAccountId,
            createdAtISO: new Date().toISOString(),
            createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/workspace-feed/infrastructure/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$infrastructure$2f$firebase$2f$FirebaseWorkspaceFeedPostRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-feed/infrastructure/firebase/FirebaseWorkspaceFeedPostRepository.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$infrastructure$2f$firebase$2f$FirebaseWorkspaceFeedInteractionRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-feed/infrastructure/firebase/FirebaseWorkspaceFeedInteractionRepository.ts [app-client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/workspace-feed/api/workspace-feed.facade.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorkspaceFeedFacade",
    ()=>WorkspaceFeedFacade,
    "workspaceFeedFacade",
    ()=>workspaceFeedFacade
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$application$2f$use$2d$cases$2f$workspace$2d$feed$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-feed/application/use-cases/workspace-feed.use-cases.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$infrastructure$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/workspace-feed/infrastructure/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$infrastructure$2f$firebase$2f$FirebaseWorkspaceFeedInteractionRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-feed/infrastructure/firebase/FirebaseWorkspaceFeedInteractionRepository.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$infrastructure$2f$firebase$2f$FirebaseWorkspaceFeedPostRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-feed/infrastructure/firebase/FirebaseWorkspaceFeedPostRepository.ts [app-client] (ecmascript)");
;
;
class WorkspaceFeedFacade {
    postRepo;
    interactionRepo;
    constructor(postRepo = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$infrastructure$2f$firebase$2f$FirebaseWorkspaceFeedPostRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FirebaseWorkspaceFeedPostRepository"](), interactionRepo = new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$infrastructure$2f$firebase$2f$FirebaseWorkspaceFeedInteractionRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FirebaseWorkspaceFeedInteractionRepository"]()){
        this.postRepo = postRepo;
        this.interactionRepo = interactionRepo;
    }
    async createPost(params) {
        const result = await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$application$2f$use$2d$cases$2f$workspace$2d$feed$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CreateWorkspaceFeedPostUseCase"](this.postRepo).execute(params);
        return result.success ? result.aggregateId : null;
    }
    async reply(params) {
        const result = await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$application$2f$use$2d$cases$2f$workspace$2d$feed$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ReplyWorkspaceFeedPostUseCase"](this.postRepo).execute(params);
        return result.success ? result.aggregateId : null;
    }
    async repost(params) {
        const result = await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$application$2f$use$2d$cases$2f$workspace$2d$feed$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RepostWorkspaceFeedPostUseCase"](this.postRepo).execute(params);
        return result.success ? result.aggregateId : null;
    }
    async like(params) {
        const result = await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$application$2f$use$2d$cases$2f$workspace$2d$feed$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LikeWorkspaceFeedPostUseCase"](this.postRepo, this.interactionRepo).execute(params);
        return result.success;
    }
    async view(params) {
        const result = await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$application$2f$use$2d$cases$2f$workspace$2d$feed$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ViewWorkspaceFeedPostUseCase"](this.postRepo, this.interactionRepo).execute(params);
        return result.success;
    }
    async bookmark(params) {
        const result = await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$application$2f$use$2d$cases$2f$workspace$2d$feed$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BookmarkWorkspaceFeedPostUseCase"](this.postRepo, this.interactionRepo).execute(params);
        return result.success;
    }
    async share(params) {
        const result = await new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$application$2f$use$2d$cases$2f$workspace$2d$feed$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShareWorkspaceFeedPostUseCase"](this.postRepo, this.interactionRepo).execute(params);
        return result.success;
    }
    async getPost(accountId, postId) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$application$2f$use$2d$cases$2f$workspace$2d$feed$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GetWorkspaceFeedPostUseCase"](this.postRepo).execute(accountId, postId);
    }
    async getWorkspaceFeed(accountId, workspaceId, maxRows = 50) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$application$2f$use$2d$cases$2f$workspace$2d$feed$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ListWorkspaceFeedUseCase"](this.postRepo).execute({
            accountId,
            workspaceId,
            limit: maxRows
        });
    }
    async getAccountFeed(accountId, maxRows = 50) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$application$2f$use$2d$cases$2f$workspace$2d$feed$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ListAccountWorkspaceFeedUseCase"](this.postRepo).execute({
            accountId,
            limit: maxRows
        });
    }
}
const workspaceFeedFacade = new WorkspaceFeedFacade();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/workspace-feed/api/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$api$2f$workspace$2d$feed$2e$facade$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-feed/api/workspace-feed.facade.ts [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/workspace-feed/interfaces/queries/workspace-feed.queries.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAccountWorkspaceFeed",
    ()=>getAccountWorkspaceFeed,
    "getWorkspaceFeed",
    ()=>getWorkspaceFeed,
    "getWorkspaceFeedPost",
    ()=>getWorkspaceFeedPost
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$application$2f$use$2d$cases$2f$workspace$2d$feed$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-feed/application/use-cases/workspace-feed.use-cases.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$infrastructure$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/workspace-feed/infrastructure/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$infrastructure$2f$firebase$2f$FirebaseWorkspaceFeedPostRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-feed/infrastructure/firebase/FirebaseWorkspaceFeedPostRepository.ts [app-client] (ecmascript)");
;
;
async function getWorkspaceFeedPost(accountId, postId) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$application$2f$use$2d$cases$2f$workspace$2d$feed$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GetWorkspaceFeedPostUseCase"](new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$infrastructure$2f$firebase$2f$FirebaseWorkspaceFeedPostRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FirebaseWorkspaceFeedPostRepository"]()).execute(accountId, postId);
}
async function getWorkspaceFeed(accountId, workspaceId, limit = 50) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$application$2f$use$2d$cases$2f$workspace$2d$feed$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ListWorkspaceFeedUseCase"](new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$infrastructure$2f$firebase$2f$FirebaseWorkspaceFeedPostRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FirebaseWorkspaceFeedPostRepository"]()).execute({
        accountId,
        workspaceId,
        limit
    });
}
async function getAccountWorkspaceFeed(accountId, limit = 50) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$application$2f$use$2d$cases$2f$workspace$2d$feed$2e$use$2d$cases$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ListAccountWorkspaceFeedUseCase"](new __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$infrastructure$2f$firebase$2f$FirebaseWorkspaceFeedPostRepository$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FirebaseWorkspaceFeedPostRepository"]()).execute({
        accountId,
        limit
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorkspaceFeedWorkspaceView",
    ()=>WorkspaceFeedWorkspaceView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-client] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/repeat-2.js [app-client] (ecmascript) <export default as Repeat2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/share-2.js [app-client] (ecmascript) <export default as Share2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$app$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/providers/app-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/textarea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$api$2f$workspace$2d$feed$2e$facade$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-feed/api/workspace-feed.facade.ts [app-client] (ecmascript)");
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
function WorkspaceFeedWorkspaceView({ accountId, workspaceId, workspaceName }) {
    _s();
    const { state: appState } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$app$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"])();
    const actor = appState.activeAccount;
    const actorId = actor?.id ?? accountId;
    const [posts, setPosts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [composer, setComposer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [replyDrafts, setReplyDrafts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [activeReplyPostId, setActiveReplyPostId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isPublishing, setIsPublishing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [actingPostId, setActingPostId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const actorName = actor?.name ?? "未知";
    const actorAvatar = "photoURL" in (actor ?? {}) ? actor.photoURL : undefined;
    const actorInitial = actorName.charAt(0).toUpperCase();
    const canPublish = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "WorkspaceFeedWorkspaceView.useMemo[canPublish]": ()=>composer.trim().length > 0
    }["WorkspaceFeedWorkspaceView.useMemo[canPublish]"], [
        composer
    ]);
    const refreshFeed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WorkspaceFeedWorkspaceView.useCallback[refreshFeed]": async ()=>{
            setIsLoading(true);
            setError(null);
            try {
                const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$api$2f$workspace$2d$feed$2e$facade$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workspaceFeedFacade"].getWorkspaceFeed(accountId, workspaceId, 50);
                setPosts(rows);
            } catch (err) {
                setError(err instanceof Error ? err.message : "載入 feed 失敗");
            } finally{
                setIsLoading(false);
            }
        }
    }["WorkspaceFeedWorkspaceView.useCallback[refreshFeed]"], [
        accountId,
        workspaceId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkspaceFeedWorkspaceView.useEffect": ()=>{
            void refreshFeed();
        }
    }["WorkspaceFeedWorkspaceView.useEffect"], [
        refreshFeed
    ]);
    async function handlePublish() {
        if (!canPublish || isPublishing) return;
        setIsPublishing(true);
        setError(null);
        try {
            const createdId = await __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$api$2f$workspace$2d$feed$2e$facade$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workspaceFeedFacade"].createPost({
                accountId,
                workspaceId,
                authorAccountId: actorId,
                content: composer.trim()
            });
            if (!createdId) {
                setError("建立貼文失敗");
                return;
            }
            setComposer("");
            await refreshFeed();
        } catch (err) {
            setError(err instanceof Error ? err.message : "建立貼文失敗");
        } finally{
            setIsPublishing(false);
        }
    }
    async function handleAction(postId, action) {
        setActingPostId(postId);
        setError(null);
        try {
            if (action === "like") {
                await __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$api$2f$workspace$2d$feed$2e$facade$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workspaceFeedFacade"].like({
                    accountId,
                    postId,
                    actorAccountId: actorId
                });
            }
            if (action === "view") {
                await __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$api$2f$workspace$2d$feed$2e$facade$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workspaceFeedFacade"].view({
                    accountId,
                    postId,
                    actorAccountId: actorId
                });
            }
            if (action === "bookmark") {
                await __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$api$2f$workspace$2d$feed$2e$facade$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workspaceFeedFacade"].bookmark({
                    accountId,
                    postId,
                    actorAccountId: actorId
                });
            }
            if (action === "share") {
                await __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$api$2f$workspace$2d$feed$2e$facade$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workspaceFeedFacade"].share({
                    accountId,
                    postId,
                    actorAccountId: actorId
                });
            }
            if (action === "repost") {
                const current = posts.find((row)=>row.id === postId);
                if (!current) return;
                await __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$api$2f$workspace$2d$feed$2e$facade$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workspaceFeedFacade"].repost({
                    accountId,
                    workspaceId: current.workspaceId,
                    sourcePostId: postId,
                    actorAccountId: actorId
                });
            }
            await refreshFeed();
        } catch (err) {
            setError(err instanceof Error ? err.message : "互動失敗");
        } finally{
            setActingPostId(null);
        }
    }
    async function handleReply(postId) {
        const text = replyDrafts[postId]?.trim() ?? "";
        if (!text) return;
        setActingPostId(postId);
        setError(null);
        try {
            const current = posts.find((row)=>row.id === postId);
            if (!current) return;
            await __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$api$2f$workspace$2d$feed$2e$facade$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workspaceFeedFacade"].reply({
                accountId,
                workspaceId: current.workspaceId,
                parentPostId: postId,
                authorAccountId: actorId,
                content: text
            });
            setReplyDrafts((prev)=>({
                    ...prev,
                    [postId]: ""
                }));
            await refreshFeed();
        } catch (err) {
            setError(err instanceof Error ? err.message : "回覆失敗");
        } finally{
            setActingPostId(null);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "mx-auto max-w-3xl space-y-6 rounded-3xl border border-border/60 bg-card/50 p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "flex items-start justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                className: "h-12 w-12 shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarImage"], {
                                        src: actorAvatar,
                                        alt: actorName
                                    }, void 0, false, {
                                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                        lineNumber: 147,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                        className: "text-sm font-bold",
                                        children: actorInitial
                                    }, void 0, false, {
                                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                        lineNumber: 148,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                lineNumber: 146,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-semibold",
                                        children: [
                                            workspaceName,
                                            " Feed"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                        lineNumber: 151,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: [
                                            "workspaceId: ",
                                            workspaceId
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                        lineNumber: 152,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                lineNumber: 150,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300",
                        children: "live"
                    }, void 0, false, {
                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3 rounded-2xl border border-border/60 bg-background/80 p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                        value: composer,
                        onChange: (event)=>setComposer(event.target.value),
                        placeholder: "發佈你的想法到 workspace feed...",
                        rows: 4
                    }, void 0, false, {
                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-muted-foreground",
                                children: [
                                    "actor: ",
                                    actorName,
                                    " / account: ",
                                    accountId
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                lineNumber: 168,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                onClick: handlePublish,
                                disabled: !canPublish || isPublishing,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                        className: "mr-2 h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                        lineNumber: 170,
                                        columnNumber: 13
                                    }, this),
                                    isPublishing ? "送出中..." : "發佈"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                lineNumber: 169,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                        lineNumber: 167,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                lineNumber: 160,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive",
                children: error
            }, void 0, false, {
                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                lineNumber: 177,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-muted-foreground",
                    children: "載入 feed 中..."
                }, void 0, false, {
                    fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                    lineNumber: 182,
                    columnNumber: 11
                }, this) : posts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-muted-foreground",
                    children: "目前還沒有貼文，發佈第一則吧。"
                }, void 0, false, {
                    fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                    lineNumber: 184,
                    columnNumber: 11
                }, this) : posts.map((post)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: "space-y-3 rounded-2xl border border-border/60 bg-background/70 p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: [
                                            post.type.toUpperCase(),
                                            " · ",
                                            post.workspaceId,
                                            " · ",
                                            new Date(post.createdAtISO).toLocaleString()
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                        lineNumber: 189,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: [
                                            "by ",
                                            post.authorAccountId
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                        lineNumber: 192,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                lineNumber: 188,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "whitespace-pre-wrap text-sm leading-6",
                                children: post.content
                            }, void 0, false, {
                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                lineNumber: 194,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        variant: activeReplyPostId === post.id ? "default" : "outline",
                                        onClick: ()=>setActiveReplyPostId((current)=>current === post.id ? null : post.id),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                                className: "mr-1 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                                lineNumber: 201,
                                                columnNumber: 19
                                            }, this),
                                            "Reply ",
                                            post.replyCount
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                        lineNumber: 196,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        variant: "outline",
                                        onClick: ()=>void handleAction(post.id, "repost"),
                                        disabled: actingPostId === post.id,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat2$3e$__["Repeat2"], {
                                                className: "mr-1 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                                lineNumber: 205,
                                                columnNumber: 19
                                            }, this),
                                            "Repost ",
                                            post.repostCount
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                        lineNumber: 204,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        variant: "outline",
                                        onClick: ()=>void handleAction(post.id, "like"),
                                        disabled: actingPostId === post.id,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                                className: "mr-1 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                                lineNumber: 209,
                                                columnNumber: 19
                                            }, this),
                                            "Like ",
                                            post.likeCount
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                        lineNumber: 208,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        variant: "outline",
                                        onClick: ()=>void handleAction(post.id, "view"),
                                        disabled: actingPostId === post.id,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                className: "mr-1 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                                lineNumber: 213,
                                                columnNumber: 19
                                            }, this),
                                            "View ",
                                            post.viewCount
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                        lineNumber: 212,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        variant: "outline",
                                        onClick: ()=>void handleAction(post.id, "bookmark"),
                                        disabled: actingPostId === post.id,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                className: "mr-1 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                                lineNumber: 217,
                                                columnNumber: 19
                                            }, this),
                                            "bookmark ",
                                            post.bookmarkCount
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                        lineNumber: 216,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        variant: "outline",
                                        onClick: ()=>void handleAction(post.id, "share"),
                                        disabled: actingPostId === post.id,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__["Share2"], {
                                                className: "mr-1 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                                lineNumber: 221,
                                                columnNumber: 19
                                            }, this),
                                            "share ",
                                            post.shareCount
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                        lineNumber: 220,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                lineNumber: 195,
                                columnNumber: 15
                            }, this),
                            activeReplyPostId === post.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2 rounded-xl border border-border/40 p-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                                        value: replyDrafts[post.id] ?? "",
                                        onChange: (event)=>setReplyDrafts((prev)=>({
                                                    ...prev,
                                                    [post.id]: event.target.value
                                                })),
                                        placeholder: "回覆這則貼文...",
                                        rows: 2
                                    }, void 0, false, {
                                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                        lineNumber: 228,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-end gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                size: "sm",
                                                type: "button",
                                                variant: "ghost",
                                                onClick: ()=>setActiveReplyPostId(null),
                                                children: "取消"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                                lineNumber: 235,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                size: "sm",
                                                type: "button",
                                                onClick: ()=>void handleReply(post.id),
                                                disabled: actingPostId === post.id || !(replyDrafts[post.id] ?? "").trim(),
                                                children: "回覆"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                                lineNumber: 238,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                        lineNumber: 234,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                                lineNumber: 227,
                                columnNumber: 17
                            }, this)
                        ]
                    }, post.id, true, {
                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                        lineNumber: 187,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
                lineNumber: 180,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx",
        lineNumber: 143,
        columnNumber: 5
    }, this);
}
_s(WorkspaceFeedWorkspaceView, "39oIKrH2WCXQGbWA5OfFfD+/Wgo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$app$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"]
    ];
});
_c = WorkspaceFeedWorkspaceView;
var _c;
__turbopack_context__.k.register(_c, "WorkspaceFeedWorkspaceView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorkspaceFeedAccountView",
    ()=>WorkspaceFeedAccountView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-client] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/repeat-2.js [app-client] (ecmascript) <export default as Repeat2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/share-2.js [app-client] (ecmascript) <export default as Share2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$app$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/providers/app-provider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui-shadcn/ui/textarea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$api$2f$workspace$2d$feed$2e$facade$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-feed/api/workspace-feed.facade.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function WorkspaceFeedAccountView({ accountId }) {
    _s();
    const { state: appState } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$app$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"])();
    const actorId = appState.activeAccount?.id ?? accountId;
    const [posts, setPosts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [replyDrafts, setReplyDrafts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [activeReplyPostId, setActiveReplyPostId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [actingPostId, setActingPostId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const refreshFeed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WorkspaceFeedAccountView.useCallback[refreshFeed]": async ()=>{
            setIsLoading(true);
            setError(null);
            try {
                const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$api$2f$workspace$2d$feed$2e$facade$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workspaceFeedFacade"].getAccountFeed(accountId, 80);
                setPosts(rows);
            } catch (err) {
                setError(err instanceof Error ? err.message : "載入 account feed 失敗");
            } finally{
                setIsLoading(false);
            }
        }
    }["WorkspaceFeedAccountView.useCallback[refreshFeed]"], [
        accountId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkspaceFeedAccountView.useEffect": ()=>{
            void refreshFeed();
        }
    }["WorkspaceFeedAccountView.useEffect"], [
        refreshFeed
    ]);
    async function handleAction(post, action) {
        setActingPostId(post.id);
        setError(null);
        try {
            if (action === "like") {
                await __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$api$2f$workspace$2d$feed$2e$facade$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workspaceFeedFacade"].like({
                    accountId,
                    postId: post.id,
                    actorAccountId: actorId
                });
            }
            if (action === "view") {
                await __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$api$2f$workspace$2d$feed$2e$facade$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workspaceFeedFacade"].view({
                    accountId,
                    postId: post.id,
                    actorAccountId: actorId
                });
            }
            if (action === "bookmark") {
                await __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$api$2f$workspace$2d$feed$2e$facade$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workspaceFeedFacade"].bookmark({
                    accountId,
                    postId: post.id,
                    actorAccountId: actorId
                });
            }
            if (action === "share") {
                await __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$api$2f$workspace$2d$feed$2e$facade$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workspaceFeedFacade"].share({
                    accountId,
                    postId: post.id,
                    actorAccountId: actorId
                });
            }
            if (action === "repost") {
                await __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$api$2f$workspace$2d$feed$2e$facade$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workspaceFeedFacade"].repost({
                    accountId,
                    workspaceId: post.workspaceId,
                    sourcePostId: post.id,
                    actorAccountId: actorId
                });
            }
            await refreshFeed();
        } catch (err) {
            setError(err instanceof Error ? err.message : "互動失敗");
        } finally{
            setActingPostId(null);
        }
    }
    async function handleReply(post) {
        const content = replyDrafts[post.id]?.trim() ?? "";
        if (!content) return;
        setActingPostId(post.id);
        setError(null);
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$api$2f$workspace$2d$feed$2e$facade$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["workspaceFeedFacade"].reply({
                accountId,
                workspaceId: post.workspaceId,
                parentPostId: post.id,
                authorAccountId: actorId,
                content
            });
            setReplyDrafts((prev)=>({
                    ...prev,
                    [post.id]: ""
                }));
            await refreshFeed();
        } catch (err) {
            setError(err instanceof Error ? err.message : "回覆失敗");
        } finally{
            setActingPostId(null);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive",
                children: error
            }, void 0, false, {
                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                lineNumber: 102,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-muted-foreground",
                    children: "載入 account feed 中..."
                }, void 0, false, {
                    fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                    lineNumber: 107,
                    columnNumber: 11
                }, this) : posts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-muted-foreground",
                    children: "目前沒有任何 workspace 貼文。"
                }, void 0, false, {
                    fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                    lineNumber: 109,
                    columnNumber: 11
                }, this) : posts.map((post)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: "space-y-3 rounded-2xl border border-border/60 bg-background/70 p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: [
                                            post.type.toUpperCase(),
                                            " · workspace ",
                                            post.workspaceId,
                                            " · ",
                                            new Date(post.createdAtISO).toLocaleString()
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                                        lineNumber: 114,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: [
                                            "by ",
                                            post.authorAccountId
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                                        lineNumber: 117,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                                lineNumber: 113,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "whitespace-pre-wrap text-sm leading-6",
                                children: post.content
                            }, void 0, false, {
                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                                lineNumber: 120,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        variant: activeReplyPostId === post.id ? "default" : "outline",
                                        onClick: ()=>setActiveReplyPostId((current)=>current === post.id ? null : post.id),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                                className: "mr-1 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                                                lineNumber: 128,
                                                columnNumber: 19
                                            }, this),
                                            "Reply ",
                                            post.replyCount
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                                        lineNumber: 123,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        variant: "outline",
                                        onClick: ()=>void handleAction(post, "repost"),
                                        disabled: actingPostId === post.id,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat2$3e$__["Repeat2"], {
                                                className: "mr-1 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                                                lineNumber: 132,
                                                columnNumber: 19
                                            }, this),
                                            "Repost ",
                                            post.repostCount
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                                        lineNumber: 131,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        variant: "outline",
                                        onClick: ()=>void handleAction(post, "like"),
                                        disabled: actingPostId === post.id,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                                className: "mr-1 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                                                lineNumber: 136,
                                                columnNumber: 19
                                            }, this),
                                            "Like ",
                                            post.likeCount
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                                        lineNumber: 135,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        variant: "outline",
                                        onClick: ()=>void handleAction(post, "view"),
                                        disabled: actingPostId === post.id,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                className: "mr-1 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                                                lineNumber: 140,
                                                columnNumber: 19
                                            }, this),
                                            "View ",
                                            post.viewCount
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                                        lineNumber: 139,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        variant: "outline",
                                        onClick: ()=>void handleAction(post, "bookmark"),
                                        disabled: actingPostId === post.id,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                className: "mr-1 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                                                lineNumber: 144,
                                                columnNumber: 19
                                            }, this),
                                            "bookmark ",
                                            post.bookmarkCount
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                                        lineNumber: 143,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "sm",
                                        variant: "outline",
                                        onClick: ()=>void handleAction(post, "share"),
                                        disabled: actingPostId === post.id,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__["Share2"], {
                                                className: "mr-1 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                                                lineNumber: 148,
                                                columnNumber: 19
                                            }, this),
                                            "share ",
                                            post.shareCount
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                                        lineNumber: 147,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                                lineNumber: 122,
                                columnNumber: 15
                            }, this),
                            activeReplyPostId === post.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2 rounded-xl border border-border/40 p-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                                        value: replyDrafts[post.id] ?? "",
                                        onChange: (event)=>setReplyDrafts((prev)=>({
                                                    ...prev,
                                                    [post.id]: event.target.value
                                                })),
                                        placeholder: "回覆這則貼文...",
                                        rows: 2
                                    }, void 0, false, {
                                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                                        lineNumber: 155,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-end gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                size: "sm",
                                                type: "button",
                                                variant: "ghost",
                                                onClick: ()=>setActiveReplyPostId(null),
                                                children: "取消"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                                                lineNumber: 162,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$shadcn$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                size: "sm",
                                                type: "button",
                                                onClick: ()=>void handleReply(post),
                                                disabled: actingPostId === post.id || !(replyDrafts[post.id] ?? "").trim(),
                                                children: "回覆"
                                            }, void 0, false, {
                                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                                                lineNumber: 165,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                                        lineNumber: 161,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                                lineNumber: 154,
                                columnNumber: 17
                            }, this)
                        ]
                    }, post.id, true, {
                        fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                        lineNumber: 112,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(WorkspaceFeedAccountView, "djl84MpqwJA3Kwc/EkfwdUsGAzo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$providers$2f$app$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"]
    ];
});
_c = WorkspaceFeedAccountView;
var _c;
__turbopack_context__.k.register(_c, "WorkspaceFeedAccountView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/workspace-feed/interfaces/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$interfaces$2f$queries$2f$workspace$2d$feed$2e$queries$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-feed/interfaces/queries/workspace-feed.queries.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$interfaces$2f$components$2f$WorkspaceFeedWorkspaceView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$interfaces$2f$components$2f$WorkspaceFeedAccountView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-feed/interfaces/components/WorkspaceFeedAccountView.tsx [app-client] (ecmascript)");
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/workspace-feed/domain/entities/workspace-feed-post.entity.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WORKSPACE_FEED_POST_TYPES",
    ()=>WORKSPACE_FEED_POST_TYPES
]);
const WORKSPACE_FEED_POST_TYPES = [
    "post",
    "reply",
    "repost"
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/modules/workspace-feed/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
/**
 * Module: workspace-feed
 * Layer: module/barrel (public API)
 *
 * Domain isolation rule:
 * - Cross-module callers must use `workspaceFeedFacade`.
 * - Internal layers remain private to this module.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$api$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/workspace-feed/api/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$interfaces$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/modules/workspace-feed/interfaces/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$modules$2f$workspace$2d$feed$2f$domain$2f$entities$2f$workspace$2d$feed$2d$post$2e$entity$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/modules/workspace-feed/domain/entities/workspace-feed-post.entity.ts [app-client] (ecmascript)");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=modules_workspace-feed_e488cb81._.js.map