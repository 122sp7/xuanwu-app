/**
 * @module workspace-flow/infrastructure/firebase
 * @file workspace-flow.collections.ts
 * @description Firestore collection path constants for the workspace-flow module.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Update collection names to match production Firestore schema
 */

/** Top-level Firestore collection for workspace-flow tasks. */
export const WF_TASKS_COLLECTION = "workspaceFlowTasks" as const;

/** Top-level Firestore collection for workspace-flow issues. */
export const WF_ISSUES_COLLECTION = "workspaceFlowIssues" as const;

/** Top-level Firestore collection for workspace-flow invoices. */
export const WF_INVOICES_COLLECTION = "workspaceFlowInvoices" as const;

/** Top-level Firestore collection for workspace-flow invoice items. */
export const WF_INVOICE_ITEMS_COLLECTION = "workspaceFlowInvoiceItems" as const;
 
