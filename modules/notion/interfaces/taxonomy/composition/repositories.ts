import { FirebaseTaxonomyRepository } from "../../../infrastructure/taxonomy/firebase/FirebaseTaxonomyRepository";

export function makeTaxonomyRepo() {
  return new FirebaseTaxonomyRepository();
}
