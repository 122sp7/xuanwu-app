/**
 * @module integration-firebase/functions
 * Firebase Cloud Functions (HTTPS Callable) client helpers.
 */

import { getFunctions, httpsCallable, type Functions } from "firebase/functions";
import { firebaseClientApp } from "./client";

export type { Functions };
export { httpsCallable };

export function getFirebaseFunctions(): Functions {
  return getFunctions(firebaseClientApp);
}
