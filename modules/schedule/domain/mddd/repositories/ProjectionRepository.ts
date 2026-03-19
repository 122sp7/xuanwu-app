import type { ScheduleDomainEvent } from "../events/ScheduleDomainEvents";

export interface ScheduleMdddProjectionRepository {
  project(events: readonly ScheduleDomainEvent[]): Promise<void>;
}
