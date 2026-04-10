import { FirebaseContentBlockRepository } from "../infrastructure/firebase/FirebaseContentBlockRepository";
import { FirebaseKnowledgeCollectionRepository } from "../infrastructure/firebase/FirebaseKnowledgeCollectionRepository";
import { FirebaseKnowledgePageRepository } from "../infrastructure/firebase/FirebaseKnowledgePageRepository";

export function makePageRepo() {
  return new FirebaseKnowledgePageRepository();
}

export function makeBlockRepo() {
  return new FirebaseContentBlockRepository();
}

export function makeCollectionRepo() {
  return new FirebaseKnowledgeCollectionRepository();
}
