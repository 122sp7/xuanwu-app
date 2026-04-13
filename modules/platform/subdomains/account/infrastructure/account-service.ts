/**
 * AccountService — Backward-compatibility re-export shim.
 *
 * Composition logic (use-case wiring, service facade) has been relocated to
 * interfaces/composition/account-service.ts to fix the
 * infrastructure → application dependency direction violation.
 */

export {
  accountService,
  createClientAccountUseCases,
  createAccountQueryRepository,
} from "../interfaces/composition/account-service";

// Internal re-export for the legacy bridge within this subdomain only.
export { FirebaseAccountQueryRepository } from "./firebase/FirebaseAccountQueryRepository";

