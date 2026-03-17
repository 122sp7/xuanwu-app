/**
 * @module functions/firebase/auth
 * Firebase Admin Auth wrapper.
 */

import { getAuth, type Auth, type DecodedIdToken } from "firebase-admin/auth";
import { getAdminApp } from "./app.js";

export type { Auth, DecodedIdToken };

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}

export const adminAuthApi = {
  /** Verify and decode a Firebase ID token. */
  verifyIdToken: (token: string, checkRevoked = false) =>
    getAdminAuth().verifyIdToken(token, checkRevoked),

  /** Verify a session cookie. */
  verifySessionCookie: (cookie: string, checkRevoked = false) =>
    getAdminAuth().verifySessionCookie(cookie, checkRevoked),

  /** Create a custom token for the given uid. */
  createCustomToken: (uid: string, claims?: Record<string, unknown>) =>
    getAdminAuth().createCustomToken(uid, claims),

  /** Create a session cookie from an ID token. */
  createSessionCookie: (idToken: string, expiresIn: number) =>
    getAdminAuth().createSessionCookie(idToken, { expiresIn }),

  /** Get a user by uid. */
  getUser: (uid: string) => getAdminAuth().getUser(uid),

  /** Get a user by email. */
  getUserByEmail: (email: string) => getAdminAuth().getUserByEmail(email),

  /** Get a user by phone number. */
  getUserByPhoneNumber: (phoneNumber: string) =>
    getAdminAuth().getUserByPhoneNumber(phoneNumber),

  /** List users (paginated). */
  listUsers: (maxResults?: number, pageToken?: string) =>
    getAdminAuth().listUsers(maxResults, pageToken),

  /** Create a new user. */
  createUser: (properties: admin_auth_CreateRequest) =>
    getAdminAuth().createUser(properties),

  /** Update a user's properties. */
  updateUser: (uid: string, properties: admin_auth_UpdateRequest) =>
    getAdminAuth().updateUser(uid, properties),

  /** Delete a user. */
  deleteUser: (uid: string) => getAdminAuth().deleteUser(uid),

  /** Revoke all refresh tokens for a user. */
  revokeRefreshTokens: (uid: string) =>
    getAdminAuth().revokeRefreshTokens(uid),

  /** Set custom claims on a user. */
  setCustomUserClaims: (uid: string, claims: Record<string, unknown> | null) =>
    getAdminAuth().setCustomUserClaims(uid, claims),
};

// Re-export Admin Auth request types for convenience.
import type {
  CreateRequest as admin_auth_CreateRequest,
  UpdateRequest as admin_auth_UpdateRequest,
} from "firebase-admin/auth";
export type { admin_auth_CreateRequest as CreateRequest, admin_auth_UpdateRequest as UpdateRequest };
