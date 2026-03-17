/**
 * @module functions/firebase/app-check
 * Firebase Admin App Check wrapper.
 * Use on the server to verify App Check tokens sent by the client.
 */

import {
  getAppCheck,
  type AppCheck,
  type DecodedAppCheckToken,
} from "firebase-admin/app-check";
import { getAdminApp } from "./app.js";

export type { AppCheck, DecodedAppCheckToken };

export function getAdminAppCheck(): AppCheck {
  return getAppCheck(getAdminApp());
}

export const adminAppCheckApi = {
  /**
   * Verify an App Check token from a client request.
   * Throws if the token is invalid.
   */
  verifyToken: (token: string, options?: { consume?: boolean }) =>
    getAdminAppCheck().verifyToken(token, options),

  /**
   * Create a custom App Check token for testing / service-to-service calls.
   */
  createToken: (
    appId: string,
    options?: Parameters<AppCheck["createToken"]>[1]
  ) => getAdminAppCheck().createToken(appId, options),
};
