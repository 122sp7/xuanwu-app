import { z } from "zod";

export const CreateFeedPostSchema = z.object({
  accountId: z.string(),
  workspaceId: z.string().uuid(),
  authorAccountId: z.string(),
  content: z.string().min(1).max(5000),
  photoUrls: z.array(z.string().url()).max(9).optional(),
  replyToPostId: z.string().uuid().optional(),
  repostOfPostId: z.string().uuid().optional(),
});

export type CreateFeedPostDTO = z.infer<typeof CreateFeedPostSchema>;

export const ListFeedPostsSchema = z.object({
  accountId: z.string(),
  workspaceId: z.string().uuid(),
  /** YYYY-MM-DD. Omit to list across all dates (up to limit). */
  dateKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

export type ListFeedPostsDTO = z.infer<typeof ListFeedPostsSchema>;
