export interface RealtimeMetricSample {
  readonly id: string;
  readonly name: string;
  readonly value: number;
  readonly labels: Record<string, string>;
  readonly sampledAtISO: string;
}

export interface RealtimeMetricWindow {
  readonly metric: string;
  readonly windowSeconds: number;
  readonly samples: RealtimeMetricSample[];
  readonly aggregated: number;
}

export interface RealtimeInsightPort {
  /** Pushes a sample to the real-time buffer. */
  push(sample: RealtimeMetricSample): Promise<void>;
  /** Returns aggregated window data. */
  queryWindow(metric: string, windowSeconds: number): Promise<RealtimeMetricWindow>;
}
