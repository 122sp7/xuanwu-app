import type {
  ScheduleRequest,
  SubmitScheduleRequestInput,
} from "../entities/ScheduleRequest";

export interface ScheduleRequestRepository {
  findById(requestId: string): Promise<ScheduleRequest | null>;
  submit(input: SubmitScheduleRequestInput): Promise<ScheduleRequest>;
  save(request: ScheduleRequest): Promise<ScheduleRequest>;
}
