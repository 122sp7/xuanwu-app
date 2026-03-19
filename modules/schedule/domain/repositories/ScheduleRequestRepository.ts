import type {
  ScheduleRequest,
  SubmitScheduleRequestInput,
} from "../entities/ScheduleRequest";

export interface ScheduleRequestRepository {
  submit(input: SubmitScheduleRequestInput): Promise<ScheduleRequest>;
}
