"use client";

import type { Task } from "@/types/task";
import { useTasks } from "@/hooks/useTasks";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const { completeTask } = useTasks();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

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
            <Badge className="text-xs">Category {task.categoryId}</Badge>

            <span className="text-xs text-muted-foreground">
              by {formatAddress(task.owner)}
            </span>

            {task.completed && (
              <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
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
