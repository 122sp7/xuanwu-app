import { z } from "@lib-zod";

export const CreateFeedPostSchema = z.object({
  accountId: z.string(),
  workspaceId: z.string().uuid(),
  authorAccountId: z.string(),
  content: z.string().min(1).max(5000),
  replyToPostId: z.string().uuid().optional(),
  repostOfPostId: z.string().uuid().optional(),
});

export type CreateFeedPostDTO = z.infer<typeof CreateFeedPostSchema>;
