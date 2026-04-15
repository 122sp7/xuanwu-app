import { FirebaseInvoiceRepository } from "../infrastructure/repositories/FirebaseInvoiceRepository";

export function makeInvoiceRepo() {
  return new FirebaseInvoiceRepository();
}
