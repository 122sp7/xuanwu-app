import { FirebaseRelationRepository } from "../../../infrastructure/relations/firebase/FirebaseRelationRepository";

export function makeRelationRepo() {
  return new FirebaseRelationRepository();
}
