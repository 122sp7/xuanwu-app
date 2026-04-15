/**
 * @module workspace-flow/application/ports
 * @file InvoiceService.ts
 * @description Application-layer port interface for Invoice operations.
 *
 * @applicationPort This is an Application-layer Port (not a Domain-layer Port) because
 * its method signatures depend on application DTOs (AddInvoiceItemDto, InvoiceQueryDto)
 * defined in application/dto/. It must remain in application/ports/ and must NOT be
 * moved to domain/ports/. See ADR-1102 §3.
 *
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Wire use cases and implement concrete adapters
 */

import type { Invoice } from "../../domain/entities/Invoice";
import type { InvoiceItem } from "../../domain/entities/InvoiceItem";
import type { InvoiceStatus } from "../../domain/value-objects/InvoiceStatus";
import type { AddInvoiceItemDto } from "../dto/add-invoice-item.dto";
import type { InvoiceQueryDto } from "../dto/invoice-query.dto";

export interface InvoiceService {
  createInvoice(workspaceId: string): Promise<Invoice>;
  addItem(dto: AddInvoiceItemDto): Promise<InvoiceItem>;
  removeItem(invoiceItemId: string): Promise<void>;
  transitionStatus(invoiceId: string, to: InvoiceStatus): Promise<Invoice>;
  listInvoices(query: InvoiceQueryDto): Promise<Invoice[]>;
  getInvoice(invoiceId: string): Promise<Invoice | null>;
}
 
