import type { EntitlementGrantSnapshot } from '../../domain/entities/EntitlementGrant';

export type EntitlementGrantView = Readonly<EntitlementGrantSnapshot>;

export interface EntitlementSignal {
  readonly contextId: string;
  readonly activeFeatures: string[];
  readonly grants: EntitlementGrantView[];
}
