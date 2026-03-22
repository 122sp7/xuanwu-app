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

const functionsInstances = new Map<string, Functions>();

export function getFirebaseFunctions(regionOrCustomDomain?: string): Functions {
  const resolvedRegion =
    regionOrCustomDomain ?? process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION ?? "asia-east1";

  let functions = functionsInstances.get(resolvedRegion);
  if (!functions) {
    functions = getFunctions(firebaseClientApp, resolvedRegion);
    functionsInstances.set(resolvedRegion, functions);

    // 只有在明確設定 emulator host 時才連接，否則直接用雲端
    if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_EMULATOR_HOST) {
      const emulatorHost = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_EMULATOR_HOST;
      const emulatorPort = Number(process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_EMULATOR_PORT ?? "5001");
      connectFunctionsEmulator(functions, emulatorHost, emulatorPort);
    }
  }

  return functions;
}

export const functionsApi = {
  httpsCallable,
  httpsCallableFromURL,
};
