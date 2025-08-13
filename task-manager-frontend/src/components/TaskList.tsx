"use client";

import { useTasks } from "@/hooks/useTasks";
import { useWallet } from "@/contexts/WalletContext";
import TaskItem from "./TaskItem";
import { CATEGORIES, APP_CONFIG } from "@/constants";
import type { Task } from "@/types/task";

export default function TaskList() {
  const { isConnected } = useWallet();
  const { tasks, isLoading, error } = useTasks();

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

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No tasks yet</p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Create your first task to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task: Task) => (
        <TaskItem key={task.id} task={task} categories={CATEGORIES} />
      ))}
    </div>
  );
}
