// ── Domain: Invoice aggregate ─────────────────────────────────────────────────
export type { Invoice, InvoiceItem, InvoiceStatus } from "./domain/entities/Invoice";
export { calculateInvoiceTotal } from "./domain/entities/Invoice";

// ── Domain: invoice state machine ─────────────────────────────────────────────
export {
  INVOICE_STATUSES,
  canTransitionInvoice,
  nextInvoiceStatus,
  isTerminalInvoiceStatus,
  isInvoiceMutable,
} from "./domain/value-objects/invoice-state";

// ── Domain: events ────────────────────────────────────────────────────────────
export type {
  FinanceDomainEvent,
  InvoiceCreatedEvent,
  InvoiceItemAddedEvent,
  InvoiceStatusChangedEvent,
  InvoicePaidEvent,
} from "./domain/events/finance.events";

// ── Domain: repository port ───────────────────────────────────────────────────
export type {
  IInvoiceRepository,
  CreateInvoiceEntityInput,
} from "./domain/repositories/FinanceRepository";

// ── Application: DTOs ─────────────────────────────────────────────────────────
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

// ── Application: use-cases ────────────────────────────────────────────────────
export {
  CreateInvoiceUseCase,
  AdvanceInvoiceUseCase,
  DeleteInvoiceUseCase,
  ListInvoicesUseCase,
} from "./application/use-cases/finance.use-cases";

// ── Infrastructure ────────────────────────────────────────────────────────────
export {
  FirebaseInvoiceRepository,
  FirebaseFinanceRepository,
} from "./infrastructure/firebase/FirebaseFinanceRepository";

// ── Interfaces: Server Actions ────────────────────────────────────────────────
export { createInvoice, advanceInvoice, deleteInvoice } from "./interfaces/_actions/finance.actions";

// ── Interfaces: queries ───────────────────────────────────────────────────────
export { getInvoices } from "./interfaces/queries/finance.queries";

// ── Interfaces: UI component ──────────────────────────────────────────────────
export { WorkspaceFinanceTab } from "./interfaces/components/WorkspaceFinanceTab";
