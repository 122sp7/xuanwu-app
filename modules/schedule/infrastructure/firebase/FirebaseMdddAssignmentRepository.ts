import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import { firebaseClientApp } from "@/infrastructure/firebase/client";
import type { Assignment } from "../../domain/mddd/entities/Assignment";
import type { ScheduleMdddAssignmentRepository } from "../../domain/mddd/repositories/AssignmentRepository";

const COLLECTION_NAME = "scheduleMdddAssignments";

export class FirebaseMdddAssignmentRepository implements ScheduleMdddAssignmentRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async findById(assignmentId: string): Promise<Assignment | null> {
    const snapshot = await getDoc(doc(this.db, COLLECTION_NAME, assignmentId));
    if (!snapshot.exists()) {
      return null;
    }
    return snapshot.data() as Assignment;
  }

  async listByTaskId(taskId: string): Promise<readonly Assignment[]> {
    const snapshots = await getDocs(
      query(collection(this.db, COLLECTION_NAME), where("taskId", "==", taskId)),
    );

    return snapshots.docs.map((snapshot) => snapshot.data() as Assignment);
  }

  async save(assignment: Assignment): Promise<Assignment> {
    await setDoc(doc(this.db, COLLECTION_NAME, assignment.assignmentId), assignment, { merge: true });
    return assignment;
  }
}
