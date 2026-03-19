/**
 * @module lib/firebase/remote-config
 * Firebase Remote Config wrapper.
 */

import {
  getRemoteConfig,
  fetchAndActivate,
  fetchConfig,
  activate,
  ensureInitialized,
  getValue,
  getString,
  getNumber,
  getBoolean,
  getAll,
  type RemoteConfig,
  type Value,
} from "firebase/remote-config";
import { firebaseClientApp } from "./client";

export type { RemoteConfig, Value };

let _remoteConfig: RemoteConfig | null = null;

/**
 * Returns the singleton Remote Config instance (browser-only).
 * Sets a sensible default `minimumFetchIntervalMillis` of 30 s in dev.
 */
export function getFirebaseRemoteConfig(): RemoteConfig | null {
  if (typeof window === "undefined") return null;
  if (_remoteConfig) return _remoteConfig;
  const rc = getRemoteConfig(firebaseClientApp);
  if (process.env.NODE_ENV !== "production") {
    rc.settings.minimumFetchIntervalMillis = 30_000;
  }
  _remoteConfig = rc;
  return _remoteConfig;
}

export const remoteConfigApi = {
  fetchAndActivate,
  fetchConfig,
  activate,
  ensureInitialized,
  getValue,
  getString,
  getNumber,
  getBoolean,
  getAll,
};
