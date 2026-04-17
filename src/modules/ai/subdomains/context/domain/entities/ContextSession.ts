import { z } from "zod";
import { v4 as uuid } from "uuid";

export const ContextSessionIdSchema = z.string().uuid().brand("ContextSessionId");
export type ContextSessionId = z.infer<typeof ContextSessionIdSchema>;

export type ContextRole = "user" | "assistant" | "system";

export interface ContextMessage {
  readonly id: string;
  readonly role: ContextRole;
  readonly content: string;
  readonly createdAtISO: string;
}

export interface ContextSessionSnapshot {
  readonly id: string;
  readonly actorId?: string;
  readonly workspaceId?: string;
  readonly messages: ContextMessage[];
  readonly systemPrompt?: string;
  readonly model?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export class ContextSession {
  private constructor(private _props: ContextSessionSnapshot) {}

  static create(input: {
    actorId?: string;
    workspaceId?: string;
    systemPrompt?: string;
    model?: string;
  }): ContextSession {
    const now = new Date().toISOString();
    return new ContextSession({
      id: uuid(),
      actorId: input.actorId,
      workspaceId: input.workspaceId,
      messages: [],
      systemPrompt: input.systemPrompt,
      model: input.model,
      createdAtISO: now,
      updatedAtISO: now,
    });
  }

  static reconstitute(snapshot: ContextSessionSnapshot): ContextSession {
    return new ContextSession(snapshot);
  }

  addMessage(role: ContextRole, content: string): void {
    const msg: ContextMessage = { id: uuid(), role, content, createdAtISO: new Date().toISOString() };
    this._props = {
      ...this._props,
      messages: [...this._props.messages, msg],
      updatedAtISO: new Date().toISOString(),
    };
  }

  get id(): string { return this._props.id; }
  get messages(): ContextMessage[] { return [...this._props.messages]; }

  getSnapshot(): Readonly<ContextSessionSnapshot> {
    return Object.freeze({ ...this._props });
  }
}
