import { FirebaseThreadRepository } from "../../../infrastructure/conversation/firebase/FirebaseThreadRepository";

export function makeThreadRepo() {
  return new FirebaseThreadRepository();
}
