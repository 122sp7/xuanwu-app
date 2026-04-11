/**
 * CachedPolicyCatalogViewRepository — Firestore-backed View Repository (Driven Adapter)
 *
 * Implements: PolicyCatalogViewRepository
 * Reads PolicyCatalogView from "policy-catalogs" collection (latest active revision).
 */

import { getFirestore, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import type { PolicyCatalogViewRepository, PolicyCatalogView } from "../../domain/ports/output";

export class CachedPolicyCatalogViewRepository implements PolicyCatalogViewRepository {
private get db() {
return getFirestore(firebaseClientApp);
}

async getView(contextId: string): Promise<PolicyCatalogView | null> {
const q = query(
collection(this.db, "policy-catalogs"),
orderBy("revision", "desc"),
limit(1),
);
const snap = await getDocs(q);
if (snap.empty) return null;
const data = snap.docs[0].data() as Record<string, unknown>;
return {
contextId,
revision: typeof data.revision === "number" ? data.revision : 0,
permissionRuleCount: typeof data.permissionRuleCount === "number" ? data.permissionRuleCount : 0,
workflowRuleCount: typeof data.workflowRuleCount === "number" ? data.workflowRuleCount : 0,
notificationRuleCount: typeof data.notificationRuleCount === "number" ? data.notificationRuleCount : 0,
auditRuleCount: typeof data.auditRuleCount === "number" ? data.auditRuleCount : 0,
};
}
}
