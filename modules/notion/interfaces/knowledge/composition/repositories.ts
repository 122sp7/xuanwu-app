import { FirebaseContentBlockRepository } from "../../../infrastructure/knowledge/firebase/FirebaseContentBlockRepository";
import { FirebaseKnowledgeCollectionRepository } from "../../../infrastructure/knowledge/firebase/FirebaseKnowledgeCollectionRepository";
import { FirebaseKnowledgePageRepository } from "../../../infrastructure/knowledge/firebase/FirebaseKnowledgePageRepository";

export function makePageRepo() {
  return new FirebaseKnowledgePageRepository();
}

export function makeBlockRepo() {
  return new FirebaseContentBlockRepository();
}

export function makeCollectionRepo() {
  return new FirebaseKnowledgeCollectionRepository();
}
