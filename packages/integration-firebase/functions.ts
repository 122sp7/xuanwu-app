/**
 * @module libs/firebase/functions-client
 * Firebase callable client wrapper.
 */

import {
  getFunctions,
  httpsCallable,
  httpsCallableFromURL,
  connectFunctionsEmulator,
  type Functions,
  type HttpsCallable,
  type HttpsCallableOptions,
} from "firebase/functions";
import { firebaseClientApp } from "./client";

export type { Functions, HttpsCallable, HttpsCallableOptions };

let _functions: Functions | null = null;

export function getFirebaseFunctions(regionOrCustomDomain?: string): Functions {
  if (!_functions) {
    _functions = getFunctions(
      firebaseClientApp,
      regionOrCustomDomain ?? process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION ?? "us-central1"
    );
    if (process.env.NODE_ENV === "development") {
      const emulatorHost =
        process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_EMULATOR_HOST ?? "localhost";
      const emulatorPort = Number(
        process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_EMULATOR_PORT ?? "5001"
      );
      connectFunctionsEmulator(_functions, emulatorHost, emulatorPort);
    }
  }
  return _functions;
}

export const functionsApi = {
  httpsCallable,
  httpsCallableFromURL,
};
