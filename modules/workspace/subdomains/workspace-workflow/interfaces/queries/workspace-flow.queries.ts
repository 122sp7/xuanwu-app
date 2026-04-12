/**
 * @module workspace-flow/interfaces/queries
 * @file workspace-flow.queries.ts
 * @description Server-side read queries for workspace-flow entities.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add pagination support and caching layer
 */

import type { Task } from "../../application/dto/workflow.dto";
import type { Issue } from "../../application/dto/workflow.dto";
import type { Invoice } from "../../application/dto/workflow.dto";
import type { InvoiceItem } from "../../application/dto/workflow.dto";
import type { TaskMaterializationBatchJob } from "../../application/dto/workflow.dto";
import {
  makeInvoiceRepo,
  makeIssueRepo,
  makeTaskMaterializationBatchJobRepo,
  makeTaskRepo,
} from "../../api/factories";

/**
 * List all tasks for a workspace.
 *
 * @param workspaceId - The workspace to query
 */
export async function getWorkspaceFlowTasks(workspaceId: string): Promise<Task[]> {
  return makeTaskRepo().findByWorkspaceId(workspaceId);
}

/**
 * Get a single task by id.
 *
 * @param taskId - The task identifier
 */
export async function getWorkspaceFlowTask(taskId: string): Promise<Task | null> {
  return makeTaskRepo().findById(taskId);
}

/**
 * List all issues for a task.
 *
 * @param taskId - The task identifier
 */
export async function getWorkspaceFlowIssues(taskId: string): Promise<Issue[]> {
  return makeIssueRepo().findByTaskId(taskId);
}

/**
 * List all invoices for a workspace.
 *
 * @param workspaceId - The workspace to query
 */
export async function getWorkspaceFlowInvoices(workspaceId: string): Promise<Invoice[]> {
  return makeInvoiceRepo().findByWorkspaceId(workspaceId);
}

/**
 * Get items for an invoice.
 *
 * @param invoiceId - The invoice identifier
 */
export async function getWorkspaceFlowInvoiceItems(invoiceId: string): Promise<InvoiceItem[]> {
  return makeInvoiceRepo().listItems(invoiceId);
}

/**
 * List task materialization batch jobs for a workspace.
 */
export async function getWorkspaceFlowTaskMaterializationBatchJobs(
  workspaceId: string,
): Promise<TaskMaterializationBatchJob[]> {
  return makeTaskMaterializationBatchJobRepo().findByWorkspaceId(workspaceId);
}

/**
 * Get a single task materialization batch job by id.
 */
export async function getWorkspaceFlowTaskMaterializationBatchJob(
  jobId: string,
): Promise<TaskMaterializationBatchJob | null> {
  return makeTaskMaterializationBatchJobRepo().findById(jobId);
}
 
