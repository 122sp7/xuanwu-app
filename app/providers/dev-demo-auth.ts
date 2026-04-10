"use client";

/**
 * dev-demo-auth.ts — backward-compat re-export shim.
 * Canonical source: modules/platform/subdomains/identity/interfaces/utils/dev-demo-auth.ts
 */

export {
  DEV_DEMO_ACCOUNT_EMAIL,
  isLocalDevDemoAllowed,
  isDevDemoCredential,
  createDevDemoUser,
  readDevDemoSession,
  writeDevDemoSession,
  clearDevDemoSession,
} from "@/modules/platform/api";
