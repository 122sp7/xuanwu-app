/**
 * @module functions/firebase/remote-config
 * Firebase Admin Remote Config wrapper.
 */

import {
  getRemoteConfig,
  type RemoteConfig,
  type RemoteConfigTemplate,
  type RemoteConfigParameter,
  type RemoteConfigCondition,
} from "firebase-admin/remote-config";
import { getAdminApp } from "./app.js";

export type {
  RemoteConfig,
  RemoteConfigTemplate,
  RemoteConfigParameter,
  RemoteConfigCondition,
};

export function getAdminRemoteConfig(): RemoteConfig {
  return getRemoteConfig(getAdminApp());
}

export const adminRemoteConfigApi = {
  /** Get the active Remote Config template. */
  getTemplate: () => getAdminRemoteConfig().getTemplate(),

  /** Get a specific template version. */
  getTemplateAtVersion: (versionNumber: number | string) =>
    getAdminRemoteConfig().getTemplateAtVersion(versionNumber),

  /** Validate a template without publishing. */
  validateTemplate: (template: RemoteConfigTemplate) =>
    getAdminRemoteConfig().validateTemplate(template),

  /** Publish (force-replace) a template. */
  publishTemplate: (
    template: RemoteConfigTemplate,
    options?: { force: boolean }
  ) => getAdminRemoteConfig().publishTemplate(template, options),

  /** Roll back to a previous version. */
  rollback: (versionNumber: number | string) =>
    getAdminRemoteConfig().rollback(versionNumber),

  /** List template versions. */
  listVersions: (options?: Parameters<RemoteConfig["listVersions"]>[0]) =>
    getAdminRemoteConfig().listVersions(options),
};
