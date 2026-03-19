import type { Assignment } from "../entities/Assignment";

export interface ScheduleMdddAssignmentRepository {
  findById(assignmentId: string): Promise<Assignment | null>;
  listByTaskId(taskId: string): Promise<readonly Assignment[]>;
  save(assignment: Assignment): Promise<Assignment>;
}
