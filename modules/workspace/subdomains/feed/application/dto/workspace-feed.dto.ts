import { z } from "@lib-zod";

const AccountScopeSchema = z.object({
  accountId: z.string().min(1),
});

const WorkspaceScopeSchema = AccountScopeSchema.extend({
  workspaceId: z.string().min(1),
});

export const FeedLimitSchema = z.number().int().min(1).max(200).default(50);

export const CreateWorkspaceFeedPostSchema = WorkspaceScopeSchema.extend({
  authorAccountId: z.string().min(1),
  content: z.string().trim().min(1).max(5000),
});

export type CreateWorkspaceFeedPostDto = z.infer<typeof CreateWorkspaceFeedPostSchema>;

export const ReplyWorkspaceFeedPostSchema = WorkspaceScopeSchema.extend({
  parentPostId: z.string().min(1),
  authorAccountId: z.string().min(1),
  content: z.string().trim().min(1).max(5000),
});

export type ReplyWorkspaceFeedPostDto = z.infer<typeof ReplyWorkspaceFeedPostSchema>;

export const RepostWorkspaceFeedPostSchema = WorkspaceScopeSchema.extend({
  sourcePostId: z.string().min(1),
  actorAccountId: z.string().min(1),
  comment: z.string().trim().max(1000).optional(),
});

export type RepostWorkspaceFeedPostDto = z.infer<typeof RepostWorkspaceFeedPostSchema>;

export const FeedInteractionSchema = AccountScopeSchema.extend({
  postId: z.string().min(1),
  actorAccountId: z.string().min(1),
});

export type FeedInteractionDto = z.infer<typeof FeedInteractionSchema>;

export const ListWorkspaceFeedSchema = WorkspaceScopeSchema.extend({
  limit: FeedLimitSchema.optional(),
});

export type ListWorkspaceFeedDto = z.infer<typeof ListWorkspaceFeedSchema>;

export const ListAccountFeedSchema = AccountScopeSchema.extend({
  limit: FeedLimitSchema.optional(),
});

export type ListAccountFeedDto = z.infer<typeof ListAccountFeedSchema>;
