"use client";

import type { Task } from "@/types/task";
import { useTasks } from "@/hooks/useTasks";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { Category } from "@/types/category";
import { formatAddress, getStatusColor } from "@/lib/utils/ui";
import { getCategoryName } from "@/constants";

interface TaskItemProps {
  task: Task;
  categories: Category[];
}

export default function TaskItem({ task, categories }: TaskItemProps) {
  const { completeTask } = useTasks();

  const handleComplete = async () => {
    try {
      await completeTask(task.id);
    } catch (error) {
      console.error("Failed to complete task:", error);
    }
  };

  return (
    <div className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow bg-card/50">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4
            className={`text-sm font-medium ${
              task.completed
                ? "text-muted-foreground line-through"
                : "text-foreground"
            }`}
          >
            {task.title}
          </h4>

          <div className="flex items-center gap-2 mt-2">
            <Badge className="text-xs">
              {getCategoryName(task.categoryId)}
            </Badge>

            <span className="text-xs text-muted-foreground">
              by {formatAddress(task.owner)}
            </span>

            {task.completed && (
              <Badge className={`text-xs ${getStatusColor("completed")}`}>
                Completed
              </Badge>
            )}
          </div>
        </div>

        {!task.completed && (
          <Button
            onClick={handleComplete}
            className="ml-4 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
          >
            Complete
          </Button>
        )}
      </div>
    </div>
  );
}
