"use client";

import type { AuthUser } from "@/modules/platform/api/contracts";

const DEV_DEMO_SESSION_KEY = "xuanwu_dev_demo_session_v1";

export const DEV_DEMO_ACCOUNT_EMAIL = "test@demo.com";
// Localhost-only development fallback secret for the requested smoke-test account.
// Never reuse this pattern for production authentication flows.
const DEV_DEMO_ACCOUNT_PASSWORD =
  process.env.NEXT_PUBLIC_DEV_DEMO_PASSWORD ?? "123456";

function isLocalhostHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === "[::1]"
  );
}

export function isLocalDevDemoAllowed(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return process.env.NODE_ENV !== "production" && isLocalhostHost(window.location.hostname);
}

export function isDevDemoCredential(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === DEV_DEMO_ACCOUNT_EMAIL &&
    password === DEV_DEMO_ACCOUNT_PASSWORD
  );
}

export function createDevDemoUser(): AuthUser {
  return {
    id: "dev-demo-user",
    name: "Demo User",
    email: DEV_DEMO_ACCOUNT_EMAIL,
  };
}

export function readDevDemoSession(): AuthUser | null {
  if (!isLocalDevDemoAllowed()) {
    return null;
  }

  const raw = window.localStorage.getItem(DEV_DEMO_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (
      typeof parsed.id !== "string" ||
      typeof parsed.name !== "string" ||
      typeof parsed.email !== "string"
    ) {
      return null;
    }
    return { id: parsed.id, name: parsed.name, email: parsed.email };
  } catch {
    return null;
  }
}

export function writeDevDemoSession(user: AuthUser): void {
  if (!isLocalDevDemoAllowed()) {
    return;
  }
  window.localStorage.setItem(DEV_DEMO_SESSION_KEY, JSON.stringify(user));
}

export function clearDevDemoSession(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(DEV_DEMO_SESSION_KEY);
}
