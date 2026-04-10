/**
 * @module workspace-flow/api
 * @file workspace-flow-invoice.facade.ts
 * @description Focused facade for Invoice aggregate write and summary-read operations.
 *
 * Consumers that only need Invoice operations should use this class directly
 * instead of the composite {@link WorkspaceFlowFacade}.
 *
 * @author workspace-flow
 * @since 2026-04-06
 */

import type { InvoiceRepository } from "../domain/repositories/InvoiceRepository";

import { CreateInvoiceUseCase } from "../application/use-cases/create-invoice.use-case";
import { AddInvoiceItemUseCase } from "../application/use-cases/add-invoice-item.use-case";
import { UpdateInvoiceItemUseCase } from "../application/use-cases/update-invoice-item.use-case";
import { RemoveInvoiceItemUseCase } from "../application/use-cases/remove-invoice-item.use-case";
import { SubmitInvoiceUseCase } from "../application/use-cases/submit-invoice.use-case";
import { ReviewInvoiceUseCase } from "../application/use-cases/review-invoice.use-case";
import { ApproveInvoiceUseCase } from "../application/use-cases/approve-invoice.use-case";
import { RejectInvoiceUseCase } from "../application/use-cases/reject-invoice.use-case";
import { PayInvoiceUseCase } from "../application/use-cases/pay-invoice.use-case";
import { CloseInvoiceUseCase } from "../application/use-cases/close-invoice.use-case";

import type { AddInvoiceItemDto } from "../application/dto/add-invoice-item.dto";
import type { UpdateInvoiceItemDto } from "../application/dto/update-invoice-item.dto";
import type { RemoveInvoiceItemDto } from "../application/dto/remove-invoice-item.dto";
import type { InvoiceQueryDto } from "../application/dto/invoice-query.dto";
import type { PaginationDto, PagedResult } from "../application/dto/pagination.dto";

import type { InvoiceSummary } from "../interfaces/contracts/workspace-flow.contract";
import { toInvoiceSummary } from "../interfaces/contracts/workspace-flow.contract";

import type { CommandResult } from "@shared-types";

// ── Pagination helper ─────────────────────────────────────────────────────────

function toPagedResult<T>(items: T[], pagination?: PaginationDto): PagedResult<T> {
  const page = pagination?.page ?? 1;
  const pageSize = pagination?.pageSize ?? (items.length || 20);
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);
  return { items: paged, total: items.length, page, pageSize, hasMore: start + pageSize < items.length };
}

/**
 * WorkspaceFlowInvoiceFacade
 *
 * Single entry point for all Invoice write and summary-read operations.
 * Requires only InvoiceRepository — no cross-aggregate dependencies.
 */
export class WorkspaceFlowInvoiceFacade {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  // ── Write operations ─────────────────────────────────────────────────────────

  async createInvoice(workspaceId: string): Promise<CommandResult> {
    return new CreateInvoiceUseCase(this.invoiceRepository).execute(workspaceId);
  }

  async addInvoiceItem(dto: AddInvoiceItemDto): Promise<CommandResult> {
    return new AddInvoiceItemUseCase(this.invoiceRepository).execute(dto);
  }

  async updateInvoiceItem(invoiceItemId: string, dto: UpdateInvoiceItemDto): Promise<CommandResult> {
    return new UpdateInvoiceItemUseCase(this.invoiceRepository).execute(invoiceItemId, dto);
  }

  async removeInvoiceItem(dto: RemoveInvoiceItemDto): Promise<CommandResult> {
    return new RemoveInvoiceItemUseCase(this.invoiceRepository).execute(dto.invoiceId, dto.invoiceItemId);
  }

  async submitInvoice(invoiceId: string): Promise<CommandResult> {
    return new SubmitInvoiceUseCase(this.invoiceRepository).execute(invoiceId);
  }

  async reviewInvoice(invoiceId: string): Promise<CommandResult> {
    return new ReviewInvoiceUseCase(this.invoiceRepository).execute(invoiceId);
  }

  async approveInvoice(invoiceId: string): Promise<CommandResult> {
    return new ApproveInvoiceUseCase(this.invoiceRepository).execute(invoiceId);
  }

  async rejectInvoice(invoiceId: string): Promise<CommandResult> {
    return new RejectInvoiceUseCase(this.invoiceRepository).execute(invoiceId);
  }

  async payInvoice(invoiceId: string): Promise<CommandResult> {
    return new PayInvoiceUseCase(this.invoiceRepository).execute(invoiceId);
  }

  async closeInvoice(invoiceId: string): Promise<CommandResult> {
    return new CloseInvoiceUseCase(this.invoiceRepository).execute(invoiceId);
  }

  // ── Read operations ──────────────────────────────────────────────────────────

  async listInvoices(query: InvoiceQueryDto, pagination?: PaginationDto): Promise<PagedResult<InvoiceSummary>> {
    const all = await this.invoiceRepository.findByWorkspaceId(query.workspaceId);
    const filtered = query.status ? all.filter((inv) => inv.status === query.status) : all;
    return toPagedResult(filtered.map(toInvoiceSummary), pagination);
  }

  async getInvoiceSummary(invoiceId: string): Promise<InvoiceSummary | null> {
    const invoice = await this.invoiceRepository.findById(invoiceId);
    return invoice ? toInvoiceSummary(invoice) : null;
  }
}
 
