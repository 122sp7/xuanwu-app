/**
 * @module workspace-flow/application/ports
 * @file TaskService.ts
 * @description Application port interface for Task operations.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Wire use cases and implement concrete adapters
 */

import type { Task } from "../../domain/entities/Task";
import type { TaskStatus } from "../../domain/value-objects/TaskStatus";
import type { CreateTaskDto } from "../dto/create-task.dto";
import type { TaskQueryDto } from "../dto/task-query.dto";

export interface TaskService {
  createTask(dto: CreateTaskDto): Promise<Task>;
  assignTask(taskId: string, assigneeId: string): Promise<Task>;
  transitionStatus(taskId: string, to: TaskStatus): Promise<Task>;
  listTasks(query: TaskQueryDto): Promise<Task[]>;
  getTask(taskId: string): Promise<Task | null>;
}
 
