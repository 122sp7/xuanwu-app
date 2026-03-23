/**
 * finance module public API
 */
export type {
  FinanceAggregateEntity,
  FinanceLifecycleStage,
  FinanceClaimLineItem,
} from "./domain/entities/Finance";
export { canAdvanceStage, nextStage, calculateTotalClaim } from "./domain/entities/Finance";
export type { FinanceRepository } from "./domain/repositories/FinanceRepository";
export {
  SubmitClaimUseCase,
  AdvanceFinanceStageUseCase,
  RecordPaymentReceivedUseCase,
} from "./application/use-cases/finance.use-cases";
export { FirebaseFinanceRepository } from "./infrastructure/firebase/FirebaseFinanceRepository";
export {
  submitClaim,
  advanceFinanceStage,
  recordPaymentReceived,
} from "./interfaces/_actions/finance.actions";
export { getFinanceByWorkspaceId } from "./interfaces/queries/finance.queries";
export { WorkspaceFinanceTab } from "./interfaces/components/WorkspaceFinanceTab";

// ── MDDD Domain: Invoice aggregate (formal billing document) ──────────────────
export type {
  Invoice,
  InvoiceItem,
  InvoiceStatus,
} from "./domain/entities/Invoice";
export { calculateInvoiceTotal } from "./domain/entities/Invoice";

// ── MDDD Domain: invoice state machine ───────────────────────────────────────
export {
  INVOICE_STATUSES,
  canTransitionInvoice,
  nextInvoiceStatus,
  isTerminalInvoiceStatus,
  isInvoiceMutable,
} from "./domain/value-objects/invoice-state";

// ── MDDD Domain: events ───────────────────────────────────────────────────────
export type {
  FinanceDomainEvent,
  InvoiceCreatedEvent,
  InvoiceItemAddedEvent,
  InvoiceStatusChangedEvent,
  InvoicePaidEvent,
} from "./domain/events/finance.events";

// ── MDDD Application: DTOs ────────────────────────────────────────────────────
export type {
  CreateInvoiceInputDto,
  AddInvoiceItemInputDto,
  AdvanceInvoiceInputDto,
  RecordPaymentInputDto,
} from "./application/dto/finance.dto";
export {
  CreateInvoiceInputSchema,
  AddInvoiceItemInputSchema,
  AdvanceInvoiceInputSchema,
  RecordPaymentInputSchema,
  InvoiceStatusSchema,
} from "./application/dto/finance.dto";
