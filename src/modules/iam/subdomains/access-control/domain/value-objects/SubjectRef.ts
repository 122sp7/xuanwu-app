import { z } from "zod";

export const SubjectRefSchema = z.object({
  subjectId: z.string().min(1),
  subjectType: z.enum(["actor", "organization", "service"]),
});
export type SubjectRef = z.infer<typeof SubjectRefSchema>;

export function createSubjectRef(
  subjectId: string,
  subjectType: SubjectRef["subjectType"],
): SubjectRef {
  return SubjectRefSchema.parse({ subjectId, subjectType });
}
