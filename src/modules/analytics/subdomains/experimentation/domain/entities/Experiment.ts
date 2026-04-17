export type ExperimentStatus = "draft" | "running" | "paused" | "completed";

export interface Experiment {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly variants: string[];
  readonly trafficAllocation: Record<string, number>;
  readonly status: ExperimentStatus;
  readonly workspaceId?: string;
  readonly startedAtISO?: string;
  readonly endedAtISO?: string;
  readonly createdAtISO: string;
}

export interface ExperimentRepository {
  save(experiment: Experiment): Promise<void>;
  findById(id: string): Promise<Experiment | null>;
  findRunning(workspaceId?: string): Promise<Experiment[]>;
  assignVariant(experimentId: string, actorId: string): Promise<string>;
}
