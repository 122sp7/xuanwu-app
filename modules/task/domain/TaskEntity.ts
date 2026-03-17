export interface TaskEntity {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  createdAt: Date;
  updatedAt: Date;
}
