import { FirebaseArticleRepository } from "../infrastructure/firebase/FirebaseArticleRepository";
import { FirebaseCategoryRepository } from "../infrastructure/firebase/FirebaseCategoryRepository";

export function makeArticleRepo() {
  return new FirebaseArticleRepository();
}

export function makeCategoryRepo() {
  return new FirebaseCategoryRepository();
}
