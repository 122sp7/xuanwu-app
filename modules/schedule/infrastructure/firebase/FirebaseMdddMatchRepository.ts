import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";
import type { Match } from "../../domain/mddd/entities/Match";
import type { ScheduleMdddMatchRepository } from "../../domain/mddd/repositories/MatchRepository";

const COLLECTION_NAME = "scheduleMdddMatches";

export class FirebaseMdddMatchRepository implements ScheduleMdddMatchRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async listByTaskId(taskId: string): Promise<readonly Match[]> {
    const snapshots = await getDocs(
      query(collection(this.db, COLLECTION_NAME), where("taskId", "==", taskId)),
    );

    return snapshots.docs.map((snapshot) => snapshot.data() as Match);
  }

  async saveAll(matches: readonly Match[]): Promise<readonly Match[]> {
    await Promise.all(
      matches.map((match) =>
        setDoc(doc(this.db, COLLECTION_NAME, match.matchId), match, { merge: true }),
      ),
    );

    return matches;
  }
}
