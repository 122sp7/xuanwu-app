import { FirebaseDemandRepository } from "../infrastructure/firebase/FirebaseDemandRepository";

export function makeDemandRepo() {
  return new FirebaseDemandRepository();
}
