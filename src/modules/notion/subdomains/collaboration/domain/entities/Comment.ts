export type PresenceStatus = "online" | "idle" | "offline";

export interface PagePresence {
  readonly pageId: string;
  readonly accountId: string;
  readonly cursorPosition?: number;
  readonly status: PresenceStatus;
  readonly lastSeenISO: string;
}

export interface Comment {
  readonly id: string;
  readonly pageId: string;
  readonly blockId?: string;
  readonly accountId: string;
  readonly content: string;
  readonly resolved: boolean;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CommentRepository {
  save(comment: Comment): Promise<void>;
  findById(id: string): Promise<Comment | null>;
  findByPageId(pageId: string): Promise<Comment[]>;
  resolveComment(id: string): Promise<void>;
  delete(id: string): Promise<void>;
}
