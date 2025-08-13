"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { Category } from "../../src/types/category";

// Dynamic imports for client-only components with proper error boundaries
export const ConnectWalletButton = dynamic(
  () => import("../../src/components/ConnectWalletButton"),
  {
    ssr: false,
    loading: () => (
      <div className="h-10 w-24 bg-muted animate-pulse rounded-md" />
    ),
  }
) as ComponentType<{}>;

export const AddTaskForm = dynamic(
  () => import("../../src/components/AddTaskForm"),
  {
    ssr: false,
    loading: () => <div className="h-64 bg-muted animate-pulse rounded-md" />,
  }
) as ComponentType<{ categories: Category[] }>;

export const TaskList = dynamic(() => import("../../src/components/TaskList"), {
  ssr: false,
  loading: () => <div className="h-32 bg-muted animate-pulse rounded-md" />,
}) as ComponentType<{}>;
