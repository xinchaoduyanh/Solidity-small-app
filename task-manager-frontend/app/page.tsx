import type { Category } from "@/types/category";
import CategoryFilter from "@/components/CategoryFilter";
import TransactionToast from "@/components/TransactionToast";
import {
  ConnectWalletButton,
  AddTaskForm,
  TaskList,
} from "./components/ClientComponents";

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

export default async function HomePage() {
  const categories = await getCategories();

  console.log("Categories loaded:", categories);
  console.log("Rendering HomePage with categories:", categories.length);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Decentralized Task Manager
            </h1>
            <ConnectWalletButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <AddTaskForm categories={categories} />
          </div>

          <div className="space-y-6">
            <CategoryFilter categories={categories} />
            <TaskList />
          </div>
        </div>
      </main>

      <TransactionToast />
    </div>
  );
}
