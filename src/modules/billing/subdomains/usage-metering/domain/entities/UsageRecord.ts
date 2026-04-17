import { z } from "zod";
import { v4 as uuid } from "uuid";

export const UsageRecordIdSchema = z.string().uuid().brand("UsageRecordId");
export type UsageRecordId = z.infer<typeof UsageRecordIdSchema>;

export const UsageUnitSchema = z.enum(["requests", "tokens", "bytes", "documents", "seats", "minutes"]);
export type UsageUnit = z.infer<typeof UsageUnitSchema>;

export interface UsageRecordSnapshot {
  readonly id: string;
  readonly contextId: string;
  readonly featureKey: string;
  readonly quantity: number;
  readonly unit: UsageUnit;
  readonly metadata?: Record<string, unknown>;
  readonly recordedAtISO: string;
}

export interface RecordUsageInput {
  readonly contextId: string;
  readonly featureKey: string;
  readonly quantity: number;
  readonly unit: UsageUnit;
  readonly metadata?: Record<string, unknown>;
}

export class UsageRecord {
  private constructor(private readonly _props: UsageRecordSnapshot) {}

  static record(input: RecordUsageInput): UsageRecord {
    return new UsageRecord({
      id: uuid(),
      contextId: input.contextId,
      featureKey: input.featureKey,
      quantity: input.quantity,
      unit: input.unit,
      metadata: input.metadata,
      recordedAtISO: new Date().toISOString(),
    });
  }

  static reconstitute(snapshot: UsageRecordSnapshot): UsageRecord {
    return new UsageRecord(snapshot);
  }

  get id(): string { return this._props.id; }
  get contextId(): string { return this._props.contextId; }
  get featureKey(): string { return this._props.featureKey; }
  get quantity(): number { return this._props.quantity; }
  get unit(): UsageUnit { return this._props.unit; }
  get recordedAtISO(): string { return this._props.recordedAtISO; }

  getSnapshot(): Readonly<UsageRecordSnapshot> {
    return Object.freeze({ ...this._props });
  }
}
