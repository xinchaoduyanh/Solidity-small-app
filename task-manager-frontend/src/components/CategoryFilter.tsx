"use client";

import { useState } from "react";
import type { Category } from "@/types/category";

interface CategoryFilterProps {
  categories: Category[];
  onFilterChange?: (categoryId: number | null) => void;
}

export default function CategoryFilter({
  categories,
  onFilterChange,
}: CategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const handleFilterChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    onFilterChange?.(categoryId);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Filter by Category
      </h3>

      <div className="space-y-2">
        <button
          onClick={() => handleFilterChange(null)}
          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
            selectedCategory === null
              ? "bg-blue-100 text-blue-700"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          All Tasks
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleFilterChange(category.id)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              selectedCategory === category.id
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
