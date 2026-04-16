import { z } from "zod";
import { v4 as uuid } from "uuid";

export const MetricIdSchema = z.string().uuid().brand("MetricId");
export type MetricId = z.infer<typeof MetricIdSchema>;

export const MetricTypeSchema = z.enum(["counter", "gauge", "histogram", "summary"]);
export type MetricType = z.infer<typeof MetricTypeSchema>;

export interface MetricSnapshot {
  readonly id: string;
  readonly name: string;
  readonly type: MetricType;
  readonly value: number;
  readonly labels: Record<string, string>;
  readonly workspaceId?: string;
  readonly organizationId?: string;
  readonly timestampISO: string;
}

export interface RecordMetricInput {
  readonly name: string;
  readonly type: MetricType;
  readonly value: number;
  readonly labels?: Record<string, string>;
  readonly workspaceId?: string;
  readonly organizationId?: string;
  readonly timestampISO?: string;
}

export class Metric {
  private constructor(private readonly _props: MetricSnapshot) {}

  static record(input: RecordMetricInput): Metric {
    return new Metric({
      id: uuid(),
      name: input.name,
      type: input.type,
      value: input.value,
      labels: input.labels ?? {},
      workspaceId: input.workspaceId,
      organizationId: input.organizationId,
      timestampISO: input.timestampISO ?? new Date().toISOString(),
    });
  }

  static reconstitute(snapshot: MetricSnapshot): Metric {
    return new Metric(snapshot);
  }

  get id(): string { return this._props.id; }
  get name(): string { return this._props.name; }
  get type(): MetricType { return this._props.type; }
  get value(): number { return this._props.value; }
  get timestampISO(): string { return this._props.timestampISO; }

  getSnapshot(): Readonly<MetricSnapshot> {
    return Object.freeze({ ...this._props });
  }
}
