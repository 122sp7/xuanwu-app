import { FirebaseArticleRepository } from "../../../infrastructure/authoring/firebase/FirebaseArticleRepository";
import { FirebaseCategoryRepository } from "../../../infrastructure/authoring/firebase/FirebaseCategoryRepository";

export function makeArticleRepo() {
  return new FirebaseArticleRepository();
}

export function makeCategoryRepo() {
  return new FirebaseCategoryRepository();
}
