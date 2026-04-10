import { FirebaseAuditRepository } from "../infrastructure/firebase/FirebaseAuditRepository";

export function makeAuditRepo() {
  return new FirebaseAuditRepository();
}
