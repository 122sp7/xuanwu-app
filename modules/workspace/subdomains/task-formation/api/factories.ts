/**
 * @module task-formation/api
 * @file factories.ts
 * @description Factory helpers for task-formation subdomain repositories.
 */

import { FirebaseTaskFormationJobRepository } from "../infrastructure/repositories/FirebaseTaskFormationJobRepository";

export function makeTaskFormationJobRepo() {
  return new FirebaseTaskFormationJobRepository();
}
