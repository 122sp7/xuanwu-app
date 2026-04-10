import { FirebaseWorkspaceFeedInteractionRepository } from "../infrastructure/firebase/FirebaseWorkspaceFeedInteractionRepository";
import { FirebaseWorkspaceFeedPostRepository } from "../infrastructure/firebase/FirebaseWorkspaceFeedPostRepository";

export function makeWorkspaceFeedPostRepo() {
  return new FirebaseWorkspaceFeedPostRepository();
}

export function makeWorkspaceFeedInteractionRepo() {
  return new FirebaseWorkspaceFeedInteractionRepository();
}
