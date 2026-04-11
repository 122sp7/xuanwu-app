import { z } from "@lib-zod";

export const ActorIdSchema = z.string().min(1).brand("ActorId");

export type ActorId = z.infer<typeof ActorIdSchema>;

export function createActorId(raw: string): ActorId {
	return ActorIdSchema.parse(raw);
}

export function unsafeActorId(raw: string): ActorId {
	return raw as ActorId;
}
