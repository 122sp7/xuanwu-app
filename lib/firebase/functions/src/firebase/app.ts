/**
 * @module functions/firebase/app
 * Firebase Admin SDK app initialisation (singleton).
 * All other Admin wrappers depend on this module.
 */

import * as admin from "firebase-admin";

let _app: admin.app.App | null = null;

/**
 * Returns the singleton Admin App instance.
 * Uses Application Default Credentials when running on Google Cloud /
 * Firebase Hosting; falls back to explicit service-account env vars for
 * local development and CI.
 */
export function getAdminApp(): admin.app.App {
  if (_app) return _app;

  if (admin.apps.length > 0) {
    _app = admin.apps[0] as admin.app.App;
    return _app;
  }

  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } =
    process.env;

  if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
    _app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  } else {
    // Running inside GCP — Application Default Credentials
    _app = admin.initializeApp();
  }

  return _app;
}
