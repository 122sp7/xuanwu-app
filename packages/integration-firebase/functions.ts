/**
 * @module integration-firebase/functions
 * Firebase Cloud Functions (HTTPS Callable) client helpers.
 */

import { getFunctions, httpsCallable, type Functions } from "firebase/functions";
import { firebaseClientApp } from "./client";

export type { Functions };
export { httpsCallable };

export function getFirebaseFunctions(region = "asia-southeast1"): Functions {
  return getFunctions(firebaseClientApp, region);
}
