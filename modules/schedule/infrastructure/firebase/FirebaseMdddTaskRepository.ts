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

import { firebaseClientApp } from "@integration-firebase";
import type { Task } from "../../domain/mddd/entities/Task";
import type { ScheduleMdddTaskRepository } from "../../domain/mddd/repositories/TaskRepository";

const COLLECTION_NAME = "scheduleMdddTasks";

export class FirebaseMdddTaskRepository implements ScheduleMdddTaskRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async findById(taskId: string): Promise<Task | null> {
    const snapshot = await getDoc(doc(this.db, COLLECTION_NAME, taskId));
    if (!snapshot.exists()) {
      return null;
    }
    return snapshot.data() as Task;
  }

  async listByRequestId(requestId: string): Promise<readonly Task[]> {
    const snapshots = await getDocs(
      query(collection(this.db, COLLECTION_NAME), where("requestId", "==", requestId)),
    );

    return snapshots.docs.map((snapshot) => snapshot.data() as Task);
  }

  async save(task: Task): Promise<Task> {
    await setDoc(doc(this.db, COLLECTION_NAME, task.taskId), task, { merge: true });
    return task;
  }
}
