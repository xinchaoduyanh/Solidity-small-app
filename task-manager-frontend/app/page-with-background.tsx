import type { Category } from "@/types/category";
import { WalletProvider } from "@/contexts/WalletContext";
import { WalletErrorBoundary } from "@/components/WalletErrorBoundary";
import CategoryFilter from "@/components/CategoryFilter";
import TransactionToast from "@/components/TransactionToast";
import {
  ConnectWalletButton,
  AddTaskForm,
  TaskList,
} from "./components/ClientComponents";
import { ThemeToggle } from "@/components/theme-toggle";
import { Suspense } from "react";

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

export default async function HomePageWithBackground() {
  const categories = await getCategories();

  console.log("Categories loaded:", categories);
  console.log("Rendering HomePage with background:", categories.length);

  return (
    <WalletErrorBoundary>
      <WalletProvider>
        <Suspense
          fallback={<div className="min-h-screen bg-muted animate-pulse" />}
        >
          <div className="min-h-screen relative overflow-hidden">
            {/* Base gradient backgrounds - simplified */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/40 dark:to-purple-950/30"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-50/40 via-transparent to-pink-50/30 dark:from-purple-950/20 dark:via-transparent dark:to-cyan-950/30"></div>

            {/* Optimized animated geometric patterns - reduced from 8+ to 4 elements + mobile optimization */}
            <div className="absolute inset-0 opacity-30 dark:opacity-60">
              {/* Main floating shapes - reduced blur from blur-3xl to blur-xl + GPU acceleration + mobile optimization */}
              <div
                className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-200/40 to-purple-200/40 dark:from-blue-500/20 dark:to-purple-500/20 rounded-full blur-xl animate-pulse hidden sm:block"
                style={{
                  transform: "translateZ(0)",
                  willChange: "transform, opacity",
                }}
              ></div>
              <div
                className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-200/30 to-pink-200/30 dark:from-cyan-400/15 dark:to-pink-400/15 rounded-full blur-xl animate-pulse delay-1000 hidden sm:block"
                style={{
                  transform: "translateZ(0)",
                  willChange: "transform, opacity",
                }}
              ></div>

              {/* Dark mode: Neon glowing orbs - reduced from blur-2xl to blur-lg + GPU acceleration + mobile optimization */}
              <div
                className="hidden dark:block absolute top-1/6 right-1/6 w-48 h-48 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full blur-lg animate-bounce hidden sm:block"
                style={{
                  animationDuration: "4s",
                  transform: "translateZ(0)",
                  willChange: "transform",
                }}
              ></div>
              <div
                className="hidden dark:block absolute bottom-1/6 left-1/6 w-56 h-56 bg-gradient-to-r from-purple-400/25 to-pink-400/25 rounded-full blur-lg animate-bounce delay-2000 hidden sm:block"
                style={{
                  animationDuration: "5s",
                  transform: "translateZ(0)",
                  willChange: "transform",
                }}
              ></div>

              {/* Removed: Rotating background elements (was blur-3xl + animate-spin) */}
              {/* Removed: Cyberpunk grid pattern for dark mode */}
              {/* Removed: Floating particles (was 4 animate-ping elements) */}
              {/* Removed: Light mode shadow patterns (was blur-3xl) */}
              {/* Removed: Dark mode electric glow effects (was multiple blur-3xl) */}
              {/* Removed: Neon lines */}
            </div>

            <header className="relative bg-white/80 dark:bg-slate-900/20 backdrop-blur-lg border-b border-slate-200/50 dark:border-cyan-500/20 sticky top-0 z-50 shadow-xl dark:shadow-cyan-500/10">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 dark:from-cyan-500/5 dark:via-purple-500/10 dark:to-pink-500/5"></div>

              {/* Removed: Dark mode animated gradient (was animate-pulse) */}

              <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
                <div className="flex justify-between items-center h-16 sm:h-20">
                  <div className="flex items-center space-x-4">
                    <div className="relative group/icon">
                      {/* Reduced blur from blur-lg to blur-md + GPU acceleration + mobile optimization */}
                      <div
                        className="absolute -inset-1 bg-gradient-to-r from-blue-400/50 to-indigo-400/50 dark:from-blue-400/60 dark:to-indigo-400/60 rounded-xl blur-md opacity-0 group-hover/icon:opacity-100 transition duration-300 hidden sm:block"
                        style={{
                          transform: "translateZ(0)",
                          willChange: "opacity",
                        }}
                      ></div>
                      <div
                        className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 rounded-xl flex items-center justify-center shadow-xl dark:shadow-blue-500/25 transform group-hover/icon:scale-110 transition-all duration-300"
                        style={{
                          transform: "translateZ(0)",
                          willChange: "transform",
                        }}
                      >
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
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-space-grotesk bg-gradient-to-r from-slate-800 to-blue-600 dark:from-white dark:to-blue-300 bg-clip-text text-transparent">
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

              {/* TransactionToast đã được di chuyển về cuối page */}
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 max-w-7xl relative z-10">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
                {/* Left Column - Add Task */}
                <div className="space-y-8 sm:space-y-10">
                  <div className="text-center xl:text-left space-y-4">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-space-grotesk bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 dark:from-white dark:via-cyan-300 dark:to-purple-300 bg-clip-text text-transparent leading-tight">
                      Create New Task
                    </h2>
                    <p className="text-lg sm:text-xl text-slate-600 dark:text-cyan-200/90 max-w-md mx-auto xl:mx-0">
                      Add your tasks to the blockchain and track them securely
                      with decentralized technology
                    </p>
                  </div>

                  <div className="group relative">
                    {/* Reduced blur from blur-xl to blur-lg + GPU acceleration + mobile optimization */}
                    <div
                      className="absolute -inset-1 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-indigo-400/30 dark:from-cyan-400/40 dark:via-blue-400/40 dark:to-purple-400/40 rounded-3xl blur-lg opacity-50 group-hover:opacity-100 transition duration-500 hidden sm:block"
                      style={{
                        transform: "translateZ(0)",
                        willChange: "opacity",
                      }}
                    ></div>
                    <div
                      className="relative bg-white/90 dark:bg-slate-900/30 backdrop-blur-lg rounded-3xl shadow-2xl dark:shadow-cyan-500/10 border border-slate-200/50 dark:border-cyan-500/20 p-8 sm:p-10 hover:bg-white/95 dark:hover:bg-slate-900/40 transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] dark:hover:shadow-cyan-500/20"
                      style={{
                        transform: "translateZ(0)",
                        willChange: "transform",
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-cyan-500/5 dark:via-transparent dark:to-purple-500/5 rounded-3xl"></div>
                      <div className="relative">
                        <AddTaskForm categories={categories} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Task Management */}
                <div className="space-y-8 sm:space-y-10">
                  <div className="text-center xl:text-left space-y-4">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-space-grotesk bg-gradient-to-r from-slate-800 via-purple-600 to-pink-600 dark:from-white dark:via-purple-300 dark:to-pink-300 bg-clip-text text-transparent leading-tight">
                      Manage Tasks
                    </h2>
                    <p className="text-lg sm:text-xl text-slate-600 dark:text-purple-200/90 max-w-md mx-auto xl:mx-0">
                      Filter and view your decentralized tasks with advanced
                      blockchain integration
                    </p>
                  </div>

                  <div className="space-y-6 sm:space-y-8">
                    {/* Category Filter Card */}
                    <div className="group relative">
                      {/* Reduced blur from blur-xl to blur-lg + GPU acceleration + mobile optimization */}
                      <div
                        className="absolute -inset-1 bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-purple-400/30 dark:from-purple-400/40 dark:via-pink-400/40 dark:to-purple-400/40 rounded-3xl blur-lg opacity-50 group-hover:opacity-100 transition duration-500 hidden sm:block"
                        style={{
                          transform: "translateZ(0)",
                          willChange: "opacity",
                        }}
                      ></div>
                      <div
                        className="relative bg-white/90 dark:bg-slate-900/30 backdrop-blur-lg rounded-3xl shadow-2xl dark:shadow-purple-500/10 border border-slate-200/50 dark:border-purple-500/20 p-6 sm:p-8 hover:bg-white/95 dark:hover:bg-slate-900/40 transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] dark:hover:shadow-purple-500/20"
                        style={{
                          transform: "translateZ(0)",
                          willChange: "transform",
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-pink-50/50 dark:from-purple-500/5 dark:via-transparent dark:to-pink-500/5 rounded-3xl"></div>
                        <div className="relative">
                          <div className="flex items-center space-x-4 mb-6">
                            <div className="relative group/icon">
                              {/* Reduced blur from blur-lg to blur-md + GPU acceleration + mobile optimization */}
                              <div
                                className="absolute -inset-1 bg-gradient-to-r from-purple-400/50 to-pink-400/50 dark:from-purple-400/60 dark:to-pink-400/60 rounded-xl blur-md opacity-0 group-hover/icon:opacity-100 transition duration-300 hidden sm:block"
                                style={{
                                  transform: "translateZ(0)",
                                  willChange: "opacity",
                                }}
                              ></div>
                              <div
                                className="relative w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 rounded-xl flex items-center justify-center shadow-xl dark:shadow-purple-500/25 transform group-hover/icon:scale-110 transition-all duration-300"
                                style={{
                                  transform: "translateZ(0)",
                                  willChange: "transform",
                                }}
                              >
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
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold font-space-grotesk bg-gradient-to-r from-slate-800 to-purple-600 dark:from-white dark:to-purple-300 bg-clip-text text-transparent">
                              Filter Categories
                            </h3>
                          </div>
                          <CategoryFilter categories={categories} />
                        </div>
                      </div>
                    </div>

                    {/* Task List Card */}
                    <div className="group relative">
                      {/* Reduced blur from blur-xl to blur-lg + GPU acceleration + mobile optimization */}
                      <div
                        className="absolute -inset-1 bg-gradient-to-r from-green-400/30 via-emerald-400/30 to-teal-400/30 dark:from-green-400/40 dark:via-emerald-400/40 dark:to-teal-400/40 rounded-3xl blur-lg opacity-50 group-hover:opacity-100 transition duration-500 hidden sm:block"
                        style={{
                          transform: "translateZ(0)",
                          willChange: "opacity",
                        }}
                      ></div>
                      <div
                        className="relative bg-white/90 dark:bg-slate-900/30 backdrop-blur-lg rounded-3xl shadow-2xl dark:shadow-emerald-500/10 border border-slate-200/50 dark:border-emerald-500/20 p-6 sm:p-8 hover:bg-white/95 dark:hover:bg-slate-900/40 transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] dark:hover:shadow-emerald-500/20"
                        style={{
                          transform: "translateZ(0)",
                          willChange: "transform",
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-transparent to-emerald-50/50 dark:from-green-500/5 dark:via-transparent dark:to-emerald-500/5 rounded-3xl"></div>
                        <div className="relative">
                          <div className="flex items-center space-x-4 mb-6">
                            <div className="relative group/icon">
                              {/* Reduced blur from blur-lg to blur-md + GPU acceleration + mobile optimization */}
                              <div
                                className="absolute -inset-1 bg-gradient-to-r from-green-400/50 to-emerald-400/50 dark:from-green-400/60 dark:to-emerald-400/60 rounded-xl blur-md opacity-0 group-hover/icon:opacity-100 transition duration-300 hidden sm:block"
                                style={{
                                  transform: "translateZ(0)",
                                  willChange: "opacity",
                                }}
                              ></div>
                              <div
                                className="relative w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400 rounded-xl flex items-center justify-center shadow-xl dark:shadow-emerald-500/25 transform group-hover/icon:scale-110 transition-all duration-300"
                                style={{
                                  transform: "translateZ(0)",
                                  willChange: "transform",
                                }}
                              >
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
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold font-space-grotesk bg-gradient-to-r from-slate-800 to-green-600 dark:from-white dark:to-green-300 bg-clip-text text-transparent">
                              Your Tasks
                            </h3>
                          </div>
                          <TaskList />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reduced floating elements from 4 to 2 for better performance + GPU acceleration + mobile optimization */}
              <div
                className="absolute top-20 left-10 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-r from-blue-300/20 to-cyan-300/20 dark:from-cyan-400/30 dark:to-blue-400/30 rounded-full blur-lg animate-bounce hidden sm:block"
                style={{
                  animationDuration: "3s",
                  transform: "translateZ(0)",
                  willChange: "transform",
                }}
              ></div>
              <div
                className="absolute bottom-32 right-16 w-40 h-40 sm:w-64 sm:h-64 bg-gradient-to-r from-purple-300/20 to-pink-300/20 dark:from-purple-400/30 dark:to-pink-400/30 rounded-full blur-lg animate-bounce delay-1000 hidden sm:block"
                style={{
                  animationDuration: "4s",
                  transform: "translateZ(0)",
                  willChange: "transform",
                }}
              ></div>
              {/* Removed: 2 additional floating elements (was 4 total) */}
            </main>

            <TransactionToast />
          </div>
        </Suspense>
      </WalletProvider>
    </WalletErrorBoundary>
  );
}
