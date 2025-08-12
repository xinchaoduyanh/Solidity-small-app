"use client";

import { useTasks } from "@/hooks/useTasks";
import { useMetaMask } from "@/hooks/useMetaMask";
import TaskItem from "./TaskItem";
import type { Task } from "@/types/task";

export default function TaskList() {
  const { isConnected } = useMetaMask();
  const { tasks, isLoading, error } = useTasks();

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Connect your wallet to view tasks</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-2">Failed to load tasks</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Tasks</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Tasks</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No tasks yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Create your first task to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Your Tasks</h3>
      <div className="space-y-3">
        {tasks.map((task: Task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
