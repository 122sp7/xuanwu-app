import { FirebaseThreadRepository } from "../infrastructure/firebase/FirebaseThreadRepository";

export function makeThreadRepo() {
  return new FirebaseThreadRepository();
}
