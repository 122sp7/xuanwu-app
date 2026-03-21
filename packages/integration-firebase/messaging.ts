/**
 * Firebase Cloud Messaging (FCM) wrapper (browser / service-worker only).
 */

import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
  type Messaging,
  type MessagePayload,
} from "firebase/messaging";
import { firebaseClientApp } from "./client";

export type { Messaging, MessagePayload };

let _messaging: Messaging | null = null;

/**
 * Returns the singleton Messaging instance.
 * Returns null in SSR or unsupported environments.
 */
export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (typeof window === "undefined") return null;
  if (_messaging) return _messaging;
  const supported = await isSupported();
  if (!supported) return null;
  _messaging = getMessaging(firebaseClientApp);
  return _messaging;
}

export const messagingApi = {
  isSupported,
  getToken,
  onMessage,
};
