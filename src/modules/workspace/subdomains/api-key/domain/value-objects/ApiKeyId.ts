import { z } from "zod";

export const ApiKeyIdSchema = z.string().uuid().brand("ApiKeyId");
export type ApiKeyId = z.infer<typeof ApiKeyIdSchema>;

export function createApiKeyId(raw: string): ApiKeyId {
  return ApiKeyIdSchema.parse(raw);
}
