"use client";

import useSWR, { mutate } from "swr";
import { useState } from "react";
import { getTaskManagerContract } from "@/lib/contract";
import {
  getWalletAccount,
  getContractInstance,
  estimateAndSendTransaction,
} from "@/lib/utils/blockchain";
import { APP_CONFIG, ERROR_MESSAGES } from "@/constants/app";
import type { Task } from "@/types/task";

export function useTasks() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: tasks = [], isLoading: isLoadingTasks } = useSWR(
    APP_CONFIG.CACHE.TASKS_KEY,
    async () => {
      try {
        if (typeof window === "undefined") {
          return [];
        }

        const contract = getContractInstance();
        const taskCountBigInt = await contract.methods.taskCount().call();

        // ✅ FIX: Convert BigInt to number safely
        const taskCount = Number(taskCountBigInt);

        if (taskCount === 0) return [];

        // Parallel fetching instead of sequential for better performance
        const taskPromises = Array.from({ length: taskCount }, (_, i) =>
          contract.methods
            .tasks(i)
            .call()
            .catch((err: any) => {
              console.warn(`Failed to fetch task ${i + 1}:`, err);
              return null;
            })
        );

        const results = await Promise.allSettled(taskPromises);
        const tasks: Task[] = results
          .map((result, index) => {
            if (result.status === "fulfilled" && result.value) {
              const task = result.value;
              // Only include valid tasks (not empty owner)
              if (task.owner !== "0x0000000000000000000000000000000000000000") {
                return {
                  id: index + 1,
                  title: task.title,
                  categoryId: Number(task.categoryId),
                  completed: task.completed,
                  owner: task.owner,
                };
              }
            }
            return null;
          })
          .filter((task): task is Task => task !== null);

        return tasks;
      } catch (error: any) {
        console.error("Failed to fetch tasks:", error);
        throw error;
      }
    },
    {
      refreshInterval: APP_CONFIG.BLOCKCHAIN.REFRESH_INTERVAL,
      revalidateOnFocus: true,
      errorRetryCount: APP_CONFIG.BLOCKCHAIN.MAX_RETRY_COUNT,
    }
  );

  const createTask = async (
    title: string,
    categoryId: number
  ): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);

      const account = await getWalletAccount();
      const contract = getContractInstance();

      const method = contract.methods.createTask(title, BigInt(categoryId));
      const transactionHash = await estimateAndSendTransaction(method, account);

      // Refresh tasks after creation
      await mutate(APP_CONFIG.CACHE.TASKS_KEY);

      return transactionHash;
    } catch (error: any) {
      const errorMessage = error.message || ERROR_MESSAGES.TASKS.CREATE_FAILED;
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const completeTask = async (taskId: number): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);

      const account = await getWalletAccount();
      const contract = getContractInstance();

      const method = contract.methods.completeTask(BigInt(taskId));
      const transactionHash = await estimateAndSendTransaction(method, account);

      // Refresh tasks after completion
      await mutate(APP_CONFIG.CACHE.TASKS_KEY);

      return transactionHash;
    } catch (error: any) {
      const errorMessage =
        error.message || ERROR_MESSAGES.TASKS.COMPLETE_FAILED;
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTasks = () => {
    mutate(APP_CONFIG.CACHE.TASKS_KEY);
  };

  return {
    tasks,
    isLoading: isLoading || isLoadingTasks,
    error,
    createTask,
    completeTask,
    refreshTasks,
  };
}
