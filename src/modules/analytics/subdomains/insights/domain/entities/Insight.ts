export interface Insight {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: "usage" | "performance" | "engagement" | "anomaly";
  readonly severity: "info" | "warning" | "critical";
  readonly workspaceId?: string;
  readonly organizationId?: string;
  readonly data: Record<string, unknown>;
  readonly generatedAtISO: string;
}

export interface InsightRepository {
  save(insight: Insight): Promise<void>;
  findById(id: string): Promise<Insight | null>;
  listForWorkspace(workspaceId: string, limit?: number): Promise<Insight[]>;
  listForOrganization(organizationId: string, limit?: number): Promise<Insight[]>;
}
