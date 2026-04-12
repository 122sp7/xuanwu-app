import { FirebaseCommentRepository } from "../../../infrastructure/collaboration/firebase/FirebaseCommentRepository";
import { FirebasePermissionRepository } from "../../../infrastructure/collaboration/firebase/FirebasePermissionRepository";
import { FirebaseVersionRepository } from "../../../infrastructure/collaboration/firebase/FirebaseVersionRepository";

export function makeCommentRepo() {
  return new FirebaseCommentRepository();
}

export function makeVersionRepo() {
  return new FirebaseVersionRepository();
}

export function makePermissionRepo() {
  return new FirebasePermissionRepository();
}
