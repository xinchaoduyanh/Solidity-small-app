"use client";

import { useState, useEffect } from "react";
import type { Category } from "@/types/category";
import CategoryFilter from "@/components/CategoryFilter";
import TransactionToast from "@/components/TransactionToast";
import {
  ConnectWalletButton,
  AddTaskForm,
  TaskList,
} from "./components/ClientComponents";
import { ThemeToggle } from "@/components/theme-toggle";

async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`,
      {
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export default function HomePageClean() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<
    number | null
  >(null);

  // Load categories on component mount
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleFilterChange = (categoryId: number | null) => {
    setSelectedCategoryFilter(categoryId);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Simple header without complex backgrounds */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-5 h-5 sm:w-7 sm:h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-space-grotesk text-slate-900 dark:text-white">
                  Decentralized Task Manager
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium hidden sm:block">
                  Blockchain-powered productivity platform
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 max-w-7xl">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* Left Column - Add Task */}
          <div className="space-y-8 sm:space-y-10">
            <div className="text-center xl:text-left space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-space-grotesk text-slate-900 dark:text-white leading-tight">
                Create New Task
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-md mx-auto xl:mx-0">
                Add your tasks to the blockchain and track them securely with
                decentralized technology
              </p>
            </div>

            {/* Simple card without complex effects */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 sm:p-10">
              <AddTaskForm categories={categories} />
            </div>
          </div>

          {/* Right Column - Task Management */}
          <div className="space-y-8 sm:space-y-10">
            <div className="text-center xl:text-left space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-space-grotesk text-slate-900 dark:text-white leading-tight">
                Manage Tasks
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-md mx-auto xl:mx-0">
                Filter and view your decentralized tasks with advanced
                blockchain integration
              </p>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {/* Category Filter Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-10 h-10 bg-purple-500 dark:bg-purple-400 rounded-xl flex items-center justify-center shadow-lg">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-space-grotesk text-slate-900 dark:text-white">
                      Filter Categories
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Choose a category to filter tasks
                    </p>
                  </div>
                </div>
                <CategoryFilter
                  categories={categories}
                  onFilterChange={handleFilterChange}
                />
              </div>

              {/* Task List Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-10 h-10 bg-green-500 dark:bg-green-400 rounded-xl flex items-center justify-center shadow-lg">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-space-grotesk text-slate-900 dark:text-white">
                    Your Tasks
                  </h3>
                </div>
                <TaskList categoryFilter={selectedCategoryFilter} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <TransactionToast />
    </div>
  );
}
