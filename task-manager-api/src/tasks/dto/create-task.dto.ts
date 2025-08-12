export class CreateTaskDto {
  title: string;
  description?: string;
  categoryId: number;
  status?: "pending" | "in_progress" | "completed";
  priority?: "low" | "medium" | "high";
}
