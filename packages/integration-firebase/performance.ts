/**
 * @module libs/firebase/performance
 * Firebase Performance Monitoring wrapper (browser-only).
 */

import {
  getPerformance,
  trace,
  type FirebasePerformance,
  type PerformanceTrace,
} from "firebase/performance";
import { firebaseClientApp } from "./client";

export type { FirebasePerformance, PerformanceTrace };

let _perf: FirebasePerformance | null = null;

/**
 * Returns the singleton Performance instance (browser-only).
 */
export function getFirebasePerformance(): FirebasePerformance | null {
  if (typeof window === "undefined") return null;
  if (_perf) return _perf;
  _perf = getPerformance(firebaseClientApp);
  return _perf;
}

export const performanceApi = {
  trace,
};
