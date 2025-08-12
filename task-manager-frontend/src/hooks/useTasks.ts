"use client";

import useSWR, { mutate } from "swr";
import { useState } from "react";
import { getWeb3 } from "@/lib/web3";
import { getTaskManagerContract } from "@/lib/contract";
import type { Task } from "@/types/task";

const TASKS_CACHE_KEY = "tasks";

export function useTasks() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: tasks = [], isLoading: isLoadingTasks } = useSWR(
    TASKS_CACHE_KEY,
    async () => {
      try {
        if (typeof window === "undefined") {
          return [];
        }

        const contract = getTaskManagerContract();
        if (!contract) {
          throw new Error(
            "Contract not available. Please check your network and contract configuration."
          );
        }

        const taskCount = await contract.methods.taskCount().call();
        const tasks = [];

        for (let i = 1; i <= taskCount; i++) {
          try {
            const task = await contract.methods.tasks(i - 1).call();
            if (task.owner !== "0x0000000000000000000000000000000000000000") {
              tasks.push({
                id: i,
                title: task.title,
                categoryId: Number(task.categoryId),
                completed: task.completed,
                owner: task.owner,
              });
            }
          } catch (error) {
            console.warn(`Failed to fetch task ${i}:`, error);
            continue;
          }
        }

        return tasks;
      } catch (error: any) {
        console.error("Failed to fetch tasks:", error);
        throw error;
      }
    },
    {
      refreshInterval: 10000, // Refresh every 10 seconds
      revalidateOnFocus: true,
      errorRetryCount: 3,
    }
  );

  const createTask = async (
    title: string,
    categoryId: number
  ): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);

      if (typeof window === "undefined") {
        throw new Error("Cannot create task on server side");
      }

      const web3 = getWeb3();
      if (!web3) {
        throw new Error("Web3 not available");
      }

      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        throw new Error("No wallet connected");
      }

      const contract = getTaskManagerContract();
      if (!contract) {
        throw new Error(
          "Contract not available. Please check your network and contract configuration."
        );
      }

      const gasEstimate = await contract.methods
        .createTask(title, BigInt(categoryId))
        .estimateGas({ from: accounts[0] });

      const result = await contract.methods
        .createTask(title, BigInt(categoryId))
        .send({
          from: accounts[0],
          gas: Math.floor(Number(gasEstimate) * 1.2),
        });

      // Refresh tasks after creation
      await mutate(TASKS_CACHE_KEY);

      return result.transactionHash;
    } catch (error: any) {
      setError(error.message || "Failed to create task");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const completeTask = async (taskId: number): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);

      if (typeof window === "undefined") {
        throw new Error("Cannot complete task on server side");
      }

      const web3 = getWeb3();
      if (!web3) {
        throw new Error("Web3 not available");
      }

      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        throw new Error("No wallet connected");
      }

      const contract = getTaskManagerContract();
      if (!contract) {
        throw new Error(
          "Contract not available. Please check your network and contract configuration."
        );
      }

      const gasEstimate = await contract.methods
        .completeTask(BigInt(taskId))
        .estimateGas({ from: accounts[0] });

      const result = await contract.methods.completeTask(BigInt(taskId)).send({
        from: accounts[0],
        gas: Math.floor(Number(gasEstimate) * 1.2),
      });

      // Refresh tasks after completion
      await mutate(TASKS_CACHE_KEY);

      return result.transactionHash;
    } catch (error: any) {
      setError(error.message || "Failed to complete task");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTasks = () => {
    mutate(TASKS_CACHE_KEY);
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
