/**
 * platform subdomain inventory module.
 */

export const PLATFORM_SUBDOMAIN_INVENTORY = [
	"identity",
	"account",
	"account-profile",
	"organization",
	"access-control",
	"security-policy",
	"platform-config",
	"feature-flag",
	"onboarding",
	"compliance",
	"billing",
	"subscription",
	"referral",
	"integration",
	"workflow",
	"notification",
	"background-job",
	"content",
	"search",
	"audit-log",
	"observability",
	"analytics",
	"support",
] as const;

export type PlatformSubdomain = (typeof PLATFORM_SUBDOMAIN_INVENTORY)[number];