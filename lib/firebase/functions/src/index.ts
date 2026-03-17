/**
 * @module lib/firebase/functions
 * Cloud Functions entry point.
 *
 * All firebase-admin usage MUST go through `./firebase` barrel —
 * do NOT import firebase-admin packages directly in function handlers.
 *
 * Trigger submodule imports (examples):
 *   import { onCall, onRequest } from "firebase-functions/v2/https";
 *   import { onDocumentWritten } from "firebase-functions/v2/firestore";
 *   import * as logger from "firebase-functions/logger";
 *
 * Admin SDK (via wrapper barrel):
 *   import { getAdminAuth, getAdminFirestore, adminMessagingApi } from "./firebase/index.js";
 */

import { setGlobalOptions } from "firebase-functions";

// Initialise Admin SDK eagerly so all downstream wrappers share one app instance.
import { getAdminApp } from "./firebase/index.js";
getAdminApp();

setGlobalOptions({ maxInstances: 10 });
