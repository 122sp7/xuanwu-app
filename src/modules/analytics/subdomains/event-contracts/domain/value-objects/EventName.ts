import { z } from "zod";

export const EventNameSchema = z.string().min(1).max(200).brand("EventName");
export type EventName = z.infer<typeof EventNameSchema>;

export function createEventName(value: string): EventName {
  return EventNameSchema.parse(value);
}
