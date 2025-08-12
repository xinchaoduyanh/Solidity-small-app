import type { Category } from "@/types/category"
import CategoryFilter from "@/components/CategoryFilter"
import TransactionToast from "@/components/TransactionToast"
import { ConnectWalletButton, AddTaskForm, TaskList } from "./components/ClientComponents"
import { ThemeToggle } from "@/components/theme-toggle"

async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`, {
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return []
  }
}

export default async function HomePage() {
  const categories = await getCategories()

  console.log("Categories loaded:", categories)
  console.log("Rendering HomePage with categories:", categories.length)

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Base gradient backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/40 dark:to-purple-950/30"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-50/40 via-transparent to-pink-50/30 dark:from-purple-950/20 dark:via-transparent dark:to-cyan-950/30"></div>

      {/* Animated geometric patterns */}
      <div className="absolute inset-0 opacity-30 dark:opacity-60">
        {/* Light mode: Soft floating shapes */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-200/40 to-purple-200/40 dark:from-blue-500/20 dark:to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-200/30 to-pink-200/30 dark:from-cyan-400/15 dark:to-pink-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Dark mode: Neon glowing orbs */}
        <div
          className="hidden dark:block absolute top-1/6 right-1/6 w-48 h-48 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full blur-2xl animate-bounce"
          style={{ animationDuration: "4s" }}
        ></div>
        <div
          className="hidden dark:block absolute bottom-1/6 left-1/6 w-56 h-56 bg-gradient-to-r from-purple-400/25 to-pink-400/25 rounded-full blur-2xl animate-bounce delay-2000"
          style={{ animationDuration: "5s" }}
        ></div>

        {/* Rotating background elements */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100/10 to-purple-100/10 dark:from-cyan-500/5 dark:to-purple-500/5 rounded-full blur-3xl animate-spin"
          style={{ animationDuration: "30s" }}
        ></div>

        {/* Cyberpunk grid pattern for dark mode */}
        <div className="hidden dark:block absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/60 dark:bg-cyan-400/80 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400/60 dark:bg-purple-400/80 rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-indigo-400/60 dark:bg-blue-400/80 rounded-full animate-ping delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-pink-400/60 dark:bg-pink-400/80 rounded-full animate-ping delay-3000"></div>

        {/* Light mode: Subtle shadow patterns */}
        <div
          className="block dark:hidden absolute top-1/3 left-1/2 w-96 h-96 bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-full blur-3xl transform -translate-x-1/2 animate-pulse"
          style={{ animationDuration: "6s" }}
        ></div>

        {/* Dark mode: Electric glow effects */}
        <div className="hidden dark:block absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1500"></div>

          {/* Neon lines */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-pulse"></div>
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-purple-400/20 to-transparent animate-pulse delay-1000"></div>
        </div>
      </div>

      <header className="relative bg-white/80 dark:bg-slate-900/20 backdrop-blur-2xl border-b border-slate-200/50 dark:border-cyan-500/20 sticky top-0 z-50 shadow-xl dark:shadow-cyan-500/10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 dark:from-cyan-500/5 dark:via-purple-500/10 dark:to-pink-500/5"></div>

        <div className="hidden dark:block absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 animate-pulse"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/50 to-indigo-400/50 dark:from-cyan-400/60 dark:to-blue-400/60 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-500 dark:to-blue-500 rounded-xl flex items-center justify-center shadow-2xl dark:shadow-cyan-500/25 transform group-hover:scale-110 transition-all duration-300">
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
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-space-grotesk bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 dark:from-white dark:via-cyan-300 dark:to-blue-300 bg-clip-text text-transparent">
                  Decentralized Task Manager
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-cyan-300/80 font-medium hidden sm:block">
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

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* Left Column - Add Task */}
          <div className="space-y-8 sm:space-y-10">
            <div className="text-center xl:text-left space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-space-grotesk bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 dark:from-white dark:via-cyan-300 dark:to-purple-300 bg-clip-text text-transparent leading-tight">
                Create New Task
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-cyan-200/90 max-w-md mx-auto xl:mx-0">
                Add your tasks to the blockchain and track them securely with decentralized technology
              </p>
            </div>

            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-indigo-400/30 dark:from-cyan-400/40 dark:via-blue-400/40 dark:to-purple-400/40 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-white/90 dark:bg-slate-900/30 backdrop-blur-2xl rounded-3xl shadow-2xl dark:shadow-cyan-500/10 border border-slate-200/50 dark:border-cyan-500/20 p-8 sm:p-10 hover:bg-white/95 dark:hover:bg-slate-900/40 transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] dark:hover:shadow-cyan-500/20">
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
                Filter and view your decentralized tasks with advanced blockchain integration
              </p>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {/* Category Filter Card */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/30 via-pink-400/30 to-purple-400/30 dark:from-purple-400/40 dark:via-pink-400/40 dark:to-purple-400/40 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-white/90 dark:bg-slate-900/30 backdrop-blur-2xl rounded-3xl shadow-2xl dark:shadow-purple-500/10 border border-slate-200/50 dark:border-purple-500/20 p-6 sm:p-8 hover:bg-white/95 dark:hover:bg-slate-900/40 transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] dark:hover:shadow-purple-500/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-pink-50/50 dark:from-purple-500/5 dark:via-transparent dark:to-pink-500/5 rounded-3xl"></div>
                  <div className="relative">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="relative group/icon">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/50 to-pink-400/50 dark:from-purple-400/60 dark:to-pink-400/60 rounded-xl blur-lg opacity-0 group-hover/icon:opacity-100 transition duration-300"></div>
                        <div className="relative w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 rounded-xl flex items-center justify-center shadow-xl dark:shadow-purple-500/25 transform group-hover/icon:scale-110 transition-all duration-300">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400/30 via-emerald-400/30 to-teal-400/30 dark:from-green-400/40 dark:via-emerald-400/40 dark:to-teal-400/40 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-white/90 dark:bg-slate-900/30 backdrop-blur-2xl rounded-3xl shadow-2xl dark:shadow-emerald-500/10 border border-slate-200/50 dark:border-emerald-500/20 p-6 sm:p-8 hover:bg-white/95 dark:hover:bg-slate-900/40 transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] dark:hover:shadow-emerald-500/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-transparent to-emerald-50/50 dark:from-green-500/5 dark:via-transparent dark:to-emerald-500/5 rounded-3xl"></div>
                  <div className="relative">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="relative group/icon">
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-400/50 to-emerald-400/50 dark:from-green-400/60 dark:to-emerald-400/60 rounded-xl blur-lg opacity-0 group-hover/icon:opacity-100 transition duration-300"></div>
                        <div className="relative w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400 rounded-xl flex items-center justify-center shadow-xl dark:shadow-emerald-500/25 transform group-hover/icon:scale-110 transition-all duration-300">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <div
          className="absolute top-20 left-10 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-r from-blue-300/20 to-cyan-300/20 dark:from-cyan-400/30 dark:to-blue-400/30 rounded-full blur-2xl animate-bounce"
          style={{ animationDuration: "3s" }}
        ></div>
        <div
          className="absolute bottom-32 right-16 w-40 h-40 sm:w-64 sm:h-64 bg-gradient-to-r from-purple-300/20 to-pink-300/20 dark:from-purple-400/30 dark:to-pink-400/30 rounded-full blur-2xl animate-bounce delay-1000"
          style={{ animationDuration: "4s" }}
        ></div>
        <div className="absolute top-1/2 left-8 w-24 h-24 sm:w-36 sm:h-36 bg-gradient-to-r from-indigo-300/20 to-purple-300/20 dark:from-indigo-400/30 dark:to-purple-400/30 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 sm:w-44 sm:h-44 bg-gradient-to-r from-emerald-300/20 to-teal-300/20 dark:from-emerald-400/30 dark:to-teal-400/30 rounded-full blur-xl animate-pulse delay-2000"></div>
      </main>

      <TransactionToast />
    </div>
  )
}
