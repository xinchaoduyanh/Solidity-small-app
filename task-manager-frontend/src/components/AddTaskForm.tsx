"use client";

import { useState } from "react";
import type { Category } from "@/types/category";
import { useMetaMask } from "@/hooks/useMetaMask";
import { useTasks } from "@/hooks/useTasks";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";

interface AddTaskFormProps {
  categories: Category[];
}

export default function AddTaskForm({ categories }: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<number>(categories[0]?.id || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isConnected, account } = useMetaMask();
  const { createTask } = useTasks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !isConnected || !account) return;

    setIsSubmitting(true);

    try {
      await createTask(title.trim(), categoryId);
      setTitle("");
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">
            Connect your wallet to create tasks
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">
        Create New Task
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Task Title</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title..."
            required
            disabled={isSubmitting}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <Button
          type="submit"
          disabled={!title.trim() || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Creating Task..." : "Create Task"}
        </Button>
      </form>
    </div>
  );
}
