import { z } from "@lib-zod";

/**
 * ActorId — receives platform's "actor reference" published language token.
 * 
 * MAPPING (AGENTS.md ubiquitous language):
 * - platform.Actor (upstream) → workspace.audit.ActorId (downstream)
 * - Platform defines the "actor reference" token in its ubiquitous language
 * - workspace.audit consumes this token without redefining Actor semantics
 * - ActorId is a local value object; does NOT own Actor concept
 * 
 * NOTE: Field name uses "Actor" only for clarity; it represents a consumed token.
 */
export const ActorIdSchema = z.string().min(1).brand("ActorId");

export type ActorId = z.infer<typeof ActorIdSchema>;

export function createActorId(raw: string): ActorId {
	return ActorIdSchema.parse(raw);
}

export function unsafeActorId(raw: string): ActorId {
	return raw as ActorId;
}
