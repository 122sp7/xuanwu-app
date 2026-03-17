/**
 * @module functions/firebase/messaging
 * Firebase Admin Cloud Messaging wrapper.
 */

import {
  getMessaging,
  type Message,
  type MulticastMessage,
  type BatchResponse,
  type SendResponse,
  type Messaging,
} from "firebase-admin/messaging";
import { getAdminApp } from "./app.js";

export type { Message, MulticastMessage, BatchResponse, SendResponse, Messaging };

export function getAdminMessaging(): Messaging {
  return getMessaging(getAdminApp());
}

export const adminMessagingApi = {
  /** Send a single message. */
  send: (message: Message, dryRun = false) =>
    getAdminMessaging().send(message, dryRun),

  /** Send to multiple tokens at once (≤500 per call). */
  sendEachForMulticast: (message: MulticastMessage, dryRun = false) =>
    getAdminMessaging().sendEachForMulticast(message, dryRun),

  /** Send a batch of independent messages (≤500 per call). */
  sendEach: (messages: Message[], dryRun = false) =>
    getAdminMessaging().sendEach(messages, dryRun),

  /** Subscribe tokens to a topic. */
  subscribeToTopic: (tokens: string | string[], topic: string) =>
    getAdminMessaging().subscribeToTopic(tokens, topic),

  /** Unsubscribe tokens from a topic. */
  unsubscribeFromTopic: (tokens: string | string[], topic: string) =>
    getAdminMessaging().unsubscribeFromTopic(tokens, topic),
};
