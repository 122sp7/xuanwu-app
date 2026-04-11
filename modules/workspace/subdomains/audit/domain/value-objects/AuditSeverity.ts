import { z } from "@lib-zod";

import { AUDIT_SEVERITIES } from "../schema";

export const AuditSeveritySchema = z.enum(AUDIT_SEVERITIES).brand("AuditSeverity");

export type AuditSeverity = z.infer<typeof AuditSeveritySchema>;

export function createAuditSeverity(raw: string): AuditSeverity {
	return AuditSeveritySchema.parse(raw);
}

export function unsafeAuditSeverity(raw: string): AuditSeverity {
	return raw as AuditSeverity;
}

const SEVERITY_LEVELS: Record<string, number> = {
	low: 0,
	medium: 1,
	high: 2,
	critical: 3,
};

/** Numeric level for ordering/comparison (low=0, medium=1, high=2, critical=3). */
export function severityLevel(severity: AuditSeverity): number {
	return SEVERITY_LEVELS[severity] ?? 0;
}

/** Returns true when `severity` is at or above the given threshold. */
export function isAtLeast(severity: AuditSeverity, threshold: AuditSeverity): boolean {
	return severityLevel(severity) >= severityLevel(threshold);
}
