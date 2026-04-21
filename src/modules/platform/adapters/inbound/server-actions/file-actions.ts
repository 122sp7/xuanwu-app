"use server";

/**
 * file-actions — platform file storage server actions.
 *
 * NOTE: All file-storage Firestore operations have been moved to client-side
 * helpers in platform/adapters/outbound/firebase-composition.ts.
 *
 * The Firebase Web Client SDK requires a signed-in user session in the browser.
 * Server Actions executing Firestore reads/writes via the web SDK have no user
 * auth context → Security Rules block every operation with
 * "Missing or insufficient permissions".
 *
 * Use listWorkspaceFiles(), registerUploadedFile(), deleteWorkspaceFile() from
 * platform/adapters/outbound/firebase-composition instead.
 */
