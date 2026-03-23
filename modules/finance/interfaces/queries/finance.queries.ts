import type { Invoice } from "../../domain/entities/Invoice";
import { ListInvoicesUseCase } from "../../application/use-cases/finance.use-cases";
import { FirebaseInvoiceRepository } from "../../infrastructure/firebase/FirebaseFinanceRepository";

export async function getInvoices(workspaceId: string): Promise<Invoice[]> {
  return new ListInvoicesUseCase(new FirebaseInvoiceRepository()).execute(workspaceId);
}
