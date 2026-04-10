import { FirebaseCommentRepository } from "../infrastructure/firebase/FirebaseCommentRepository";
import { FirebasePermissionRepository } from "../infrastructure/firebase/FirebasePermissionRepository";
import { FirebaseVersionRepository } from "../infrastructure/firebase/FirebaseVersionRepository";

export function makeCommentRepo() {
  return new FirebaseCommentRepository();
}

export function makeVersionRepo() {
  return new FirebaseVersionRepository();
}

export function makePermissionRepo() {
  return new FirebasePermissionRepository();
}
