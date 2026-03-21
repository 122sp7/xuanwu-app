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

import { firebaseClientApp } from "@integration-firebase/client";
import type { Schedule } from "../../domain/mddd/entities/Schedule";
import type { ScheduleMdddScheduleRepository } from "../../domain/mddd/repositories/ScheduleRepository";

const COLLECTION_NAME = "scheduleMdddSchedules";

export class FirebaseMdddScheduleRepository implements ScheduleMdddScheduleRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async findById(scheduleId: string): Promise<Schedule | null> {
    const snapshot = await getDoc(doc(this.db, COLLECTION_NAME, scheduleId));
    if (!snapshot.exists()) {
      return null;
    }
    return snapshot.data() as Schedule;
  }

  async listByAssigneeAccountUserId(accountUserId: string): Promise<readonly Schedule[]> {
    const snapshots = await getDocs(
      query(collection(this.db, COLLECTION_NAME), where("assigneeAccountUserId", "==", accountUserId)),
    );

    return snapshots.docs.map((snapshot) => snapshot.data() as Schedule);
  }

  async save(schedule: Schedule): Promise<Schedule> {
    await setDoc(doc(this.db, COLLECTION_NAME, schedule.scheduleId), schedule, { merge: true });
    return schedule;
  }
}
