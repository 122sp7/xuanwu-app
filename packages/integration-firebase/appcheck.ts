/**
 * Firebase App Check wrapper.
 * Must be initialised before any other Firebase service is used.
 * Uses ReCaptchaEnterpriseProvider in production and debug provider in dev/test.
 */

import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  getToken,
  onTokenChanged,
  setTokenAutoRefreshEnabled,
  type AppCheck,
  type AppCheckToken,
} from "firebase/app-check";
import { firebaseClientApp } from "./client";

export type { AppCheck, AppCheckToken };

/**
 * Lazily initialise App Check (browser-only).
 * Call once at app bootstrap (e.g. inside the root Provider).
 */
export function initFirebaseAppCheck(): AppCheck | null {
  if (typeof window === "undefined") return null;

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN =
      process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_DEBUG_TOKEN ?? true;
  }

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY;
  if (!siteKey) {
    throw new Error("NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY is not configured.");
  }

  return initializeAppCheck(firebaseClientApp, {
    provider: new ReCaptchaEnterpriseProvider(siteKey),
    isTokenAutoRefreshEnabled: true,
  });
}

export const appCheckApi = {
  getToken,
  onTokenChanged,
  setTokenAutoRefreshEnabled,
};
