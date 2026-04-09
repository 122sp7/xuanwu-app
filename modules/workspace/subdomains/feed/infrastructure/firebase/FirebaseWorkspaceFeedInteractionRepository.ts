import {
  collection,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";

import type { WorkspaceFeedInteractionRepository } from "../../domain/repositories/workspace-feed.repositories";

type FirestoreDb = ReturnType<typeof getFirestore>;

function postDoc(db: FirestoreDb, accountId: string, postId: string) {
  return doc(db, "accounts", accountId, "workspaceFeedPosts", postId);
}

function likesDoc(db: FirestoreDb, accountId: string, postId: string, actorAccountId: string) {
  return doc(postDoc(db, accountId, postId), "likes", actorAccountId);
}

function bookmarksDoc(db: FirestoreDb, accountId: string, postId: string, actorAccountId: string) {
  return doc(postDoc(db, accountId, postId), "bookmarks", actorAccountId);
}

function viewsCol(db: FirestoreDb, accountId: string, postId: string) {
  return collection(postDoc(db, accountId, postId), "views");
}

function sharesCol(db: FirestoreDb, accountId: string, postId: string) {
  return collection(postDoc(db, accountId, postId), "shares");
}

export class FirebaseWorkspaceFeedInteractionRepository implements WorkspaceFeedInteractionRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async like(accountId: string, postId: string, actorAccountId: string): Promise<boolean> {
    const ref = likesDoc(this.db, accountId, postId, actorAccountId);
    const snap = await getDoc(ref);
    if (snap.exists()) return false;

    await setDoc(ref, {
      accountId,
      postId,
      actorAccountId,
      createdAtISO: new Date().toISOString(),
      createdAt: serverTimestamp(),
    });
    return true;
  }

  async bookmark(accountId: string, postId: string, actorAccountId: string): Promise<boolean> {
    const ref = bookmarksDoc(this.db, accountId, postId, actorAccountId);
    const snap = await getDoc(ref);
    if (snap.exists()) return false;

    await setDoc(ref, {
      accountId,
      postId,
      actorAccountId,
      createdAtISO: new Date().toISOString(),
      createdAt: serverTimestamp(),
    });
    return true;
  }

  async view(accountId: string, postId: string, actorAccountId: string): Promise<void> {
    await setDoc(doc(viewsCol(this.db, accountId, postId), generateId()), {
      accountId,
      postId,
      actorAccountId,
      createdAtISO: new Date().toISOString(),
      createdAt: serverTimestamp(),
    });
  }

  async share(accountId: string, postId: string, actorAccountId: string): Promise<void> {
    await setDoc(doc(sharesCol(this.db, accountId, postId), generateId()), {
      accountId,
      postId,
      actorAccountId,
      createdAtISO: new Date().toISOString(),
      createdAt: serverTimestamp(),
    });
  }
}
