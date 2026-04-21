"use server";

/**
 * feed-actions — workspace/feed inbound server actions.
 *
 * NOTE: All feed Firestore operations have been moved to client-side helpers
 * in workspace/adapters/outbound/firebase-composition.ts.
 *
 * The Firebase Web Client SDK requires a signed-in user session in the browser.
 * Server Actions executing Firestore reads/writes via the web SDK have no user
 * auth context → Security Rules block every operation with
 * "Missing or insufficient permissions".
 *
 * Use listFeedPosts(), createFeedPost(), listAccountFeedPosts() from
 * workspace/adapters/outbound/firebase-composition instead.
 */
