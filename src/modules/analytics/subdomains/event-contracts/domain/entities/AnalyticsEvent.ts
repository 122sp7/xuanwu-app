import { z } from "@lib-zod";
import { v4 as uuid } from "@lib-uuid";

export const AnalyticsEventIdSchema = z.string().uuid().brand("AnalyticsEventId");
export type AnalyticsEventId = z.infer<typeof AnalyticsEventIdSchema>;

export const AnalyticsEventSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  source: z.string().min(1).max(100),
  actorId: z.string().optional(),
  workspaceId: z.string().optional(),
  organizationId: z.string().optional(),
  properties: z.record(z.string(), z.unknown()).default({}),
  occurredAt: z.string().datetime(),
  ingestedAt: z.string().datetime(),
});

export type AnalyticsEventSnapshot = z.infer<typeof AnalyticsEventSchema>;

export interface TrackEventInput {
  readonly name: string;
  readonly source: string;
  readonly actorId?: string;
  readonly workspaceId?: string;
  readonly organizationId?: string;
  readonly properties?: Record<string, unknown>;
  readonly occurredAt?: string;
}

export class AnalyticsEvent {
  private constructor(private readonly _props: AnalyticsEventSnapshot) {}

  static create(input: TrackEventInput): AnalyticsEvent {
    const now = new Date().toISOString();
    const props = AnalyticsEventSchema.parse({
      id: uuid(),
      name: input.name,
      source: input.source,
      actorId: input.actorId,
      workspaceId: input.workspaceId,
      organizationId: input.organizationId,
      properties: input.properties ?? {},
      occurredAt: input.occurredAt ?? now,
      ingestedAt: now,
    });
    return new AnalyticsEvent(props);
  }

  static reconstitute(snapshot: AnalyticsEventSnapshot): AnalyticsEvent {
    return new AnalyticsEvent(AnalyticsEventSchema.parse(snapshot));
  }

  get id(): string { return this._props.id; }
  get name(): string { return this._props.name; }
  get source(): string { return this._props.source; }
  get actorId(): string | undefined { return this._props.actorId; }
  get workspaceId(): string | undefined { return this._props.workspaceId; }
  get occurredAt(): string { return this._props.occurredAt; }

  getSnapshot(): Readonly<AnalyticsEventSnapshot> {
    return Object.freeze({ ...this._props });
  }
}
