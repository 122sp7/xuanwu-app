/**
 * @module libs/firebase/analytics
 * Firebase Analytics wrapper (browser-only).
 * All exports are safe to import in SSR; actual SDK calls are no-ops on the server.
 */

import {
  getAnalytics,
  isSupported,
  logEvent,
  setCurrentScreen,
  setUserId,
  setUserProperties,
  setAnalyticsCollectionEnabled,
  type Analytics,
  type EventParams,
} from "firebase/analytics";
import { firebaseClientApp } from "./client";

export type { Analytics, EventParams };

let _analytics: Analytics | null = null;

/**
 * Returns the singleton Analytics instance.
 * Returns null in SSR or when Analytics is not supported.
 */
export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (_analytics) return _analytics;
  const supported = await isSupported();
  if (!supported) return null;
  _analytics = getAnalytics(firebaseClientApp);
  return _analytics;
}

export const analyticsApi = {
  isSupported,
  logEvent,
  setCurrentScreen,
  setUserId,
  setUserProperties,
  setAnalyticsCollectionEnabled,
};
