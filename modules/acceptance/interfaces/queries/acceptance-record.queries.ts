import type { AcceptanceRecord } from "../../domain/entities/AcceptanceRecord";
import { ListAcceptanceRecordsUseCase } from "../../application/use-cases/acceptance-record.use-cases";
import { FirebaseAcceptanceRecordRepository } from "../../infrastructure/firebase/FirebaseAcceptanceRecordRepository";

export async function getAcceptanceRecords(workspaceId: string): Promise<AcceptanceRecord[]> {
  return new ListAcceptanceRecordsUseCase(new FirebaseAcceptanceRecordRepository()).execute(workspaceId);
}
