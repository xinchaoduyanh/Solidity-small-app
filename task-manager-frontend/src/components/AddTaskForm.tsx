"use client";

import type React from "react";
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100/90 via-blue-50/80 to-indigo-50/90 dark:from-slate-900/90 dark:via-slate-800/80 dark:to-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-cyan-500/10 animate-pulse" />
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500/20 dark:bg-blue-500/30 rounded-full blur-3xl animate-bounce" />
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-purple-500/20 dark:bg-purple-500/30 rounded-full blur-2xl animate-pulse delay-1000" />

        <div className="relative p-8 text-center">
          {/* Wallet icon with blockchain effect */}
          <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg relative">
            {/* Blockchain connection lines */}
            <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ping" />
            <div className="absolute inset-0 rounded-full border-2 border-purple-400/30 animate-ping delay-500" />

            <svg
              className="w-8 h-8 text-white relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>

          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-3">
            Wallet Connection Required
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-sm mx-auto leading-relaxed">
            Connect your MetaMask wallet to start creating and managing your
            decentralized tasks securely on the blockchain.
          </p>

          {/* Decorative blockchain elements */}
          <div className="flex justify-center space-x-2 opacity-60">
            <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-ping" />
            <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-ping delay-200" />
            <div className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-ping delay-400" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/95 via-slate-50/90 to-white/95 dark:from-slate-900/95 dark:via-slate-800/90 dark:to-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-2xl">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-cyan-500/10" />
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-cyan-500/10 dark:from-purple-500/20 dark:to-cyan-500/20 rounded-full blur-2xl" />

      <div className="relative p-8">
        {/* Header with blockchain icon */}
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-4 shadow-lg relative">
            {/* Blockchain effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse opacity-75" />
            <svg
              className="w-5 h-5 text-white relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Create New Task
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Add your tasks to the blockchain and track them securely
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Title Input */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-slate-700 dark:text-slate-200 font-medium flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Task Title
            </Label>
            <div className="relative group">
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your task description..."
                required
                disabled={isSubmitting}
                className="bg-white/70 dark:bg-slate-800/50 border-slate-300/50 dark:border-slate-600/50 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:border-blue-500/50 dark:focus:border-blue-500/50 focus:ring-blue-500/20 dark:focus:ring-blue-500/20 rounded-xl h-12 px-4 backdrop-blur-sm transition-all duration-200 hover:bg-white/90 dark:hover:bg-slate-800/70"
              />
              {/* Input glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none" />
            </div>
          </div>

          {/* Category Select */}
          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="text-slate-700 dark:text-slate-200 font-medium flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2 text-purple-500 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              Category
            </Label>
            <div className="relative group">
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                disabled={isSubmitting}
                className="w-full h-12 px-4 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-600/50 text-slate-900 dark:text-slate-100 focus:border-purple-500/50 dark:focus:border-purple-500/50 focus:ring-purple-500/20 dark:focus:ring-purple-500/20 focus:outline-none transition-all duration-200 hover:bg-white/90 dark:hover:bg-slate-800/70 appearance-none cursor-pointer"
              >
                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                    className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    {category.name}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-slate-500 dark:text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!title.trim() || isSubmitting}
            className="w-full h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

            <span className="relative flex items-center justify-center">
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating Task...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Create Task
                </>
              )}
            </span>
          </Button>
        </form>
      </div>
    </div>
  );
}
