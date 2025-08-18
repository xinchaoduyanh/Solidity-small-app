"use client";

import { useTasks } from "@/hooks/useTasks";
import { useWallet } from "@/contexts/WalletContext";
import TaskItem from "./TaskItem";
import { CATEGORIES, APP_CONFIG } from "@/constants";
import type { Task } from "@/types/task";

interface TaskListProps {
  categoryFilter?: number | null;
}

export default function TaskList({ categoryFilter }: TaskListProps) {
  const { isConnected } = useWallet();
  const { tasks, isLoading, error } = useTasks();

  // Filter tasks based on selected category
  const filteredTasks =
    categoryFilter !== null
      ? tasks.filter((task) => task.categoryId === categoryFilter)
      : tasks;

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Connect your wallet to view tasks
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-2">Failed to load tasks</p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(APP_CONFIG.UI.SKELETON_ITEMS)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-muted rounded-md"></div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-8">
        {categoryFilter !== null ? (
          <>
            <p className="text-muted-foreground">No tasks in this category</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Try selecting a different category or create a new task
            </p>
          </>
        ) : (
          <>
            <p className="text-muted-foreground">No tasks yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Create your first task to get started
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredTasks.map((task: Task) => (
        <TaskItem key={task.id} task={task} categories={CATEGORIES} />
      ))}
    </div>
  );
}
