"use client";

import dynamic from "next/dynamic";

// Dynamic imports for client-only components
export const ConnectWalletButton = dynamic(
  () => import("./ConnectWalletButton"),
  {
    ssr: false,
  }
);

export const AddTaskForm = dynamic(() => import("./AddTaskForm"), {
  ssr: false,
});

export const TaskList = dynamic(() => import("./TaskList"), {
  ssr: false,
});
