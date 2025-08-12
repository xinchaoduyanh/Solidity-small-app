"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { Category } from "../../src/types/category";

// Dynamic imports for client-only components
export const ConnectWalletButton = dynamic(
  () => import("../../src/components/ConnectWalletButton"),
  {
    ssr: false,
  }
) as ComponentType<{}>;

export const AddTaskForm = dynamic(
  () => import("../../src/components/AddTaskForm"),
  {
    ssr: false,
  }
) as ComponentType<{ categories: Category[] }>;

export const TaskList = dynamic(() => import("../../src/components/TaskList"), {
  ssr: false,
}) as ComponentType<{}>;
