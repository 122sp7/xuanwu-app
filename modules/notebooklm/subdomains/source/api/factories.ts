import { FirebaseRagDocumentAdapter } from "../infrastructure/firebase/FirebaseRagDocumentAdapter";
import { FirebaseSourceFileAdapter } from "../infrastructure/firebase/FirebaseSourceFileAdapter";

export function makeSourceFileAdapter() {
  return new FirebaseSourceFileAdapter();
}

export function makeRagDocumentAdapter() {
  return new FirebaseRagDocumentAdapter();
}
