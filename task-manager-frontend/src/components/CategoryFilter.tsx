"use client";

import { useState } from "react";
import type { Category } from "@/types/category";
import { Plus, CheckCircle } from "lucide-react";

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

  const selectedCategoryData = categories.find(
    (cat) => cat.id === selectedCategory
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleFilterChange(null)}
          className={`group relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
            selectedCategory === null
              ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-lg shadow-blue-500/30"
              : "bg-card/70 backdrop-blur-sm text-foreground hover:bg-card hover:shadow-md border border-border/50"
          }`}
          style={{
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14-7l-7 7-7-7m14 18l-7-7-7 7"
              />
            </svg>
            All Categories
          </span>
          {selectedCategory === null && (
            <div
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block"
              style={{
                transform: "translateZ(0)",
                willChange: "opacity",
              }}
            />
          )}
        </button>

        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => handleFilterChange(category.id)}
            className={`group relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              selectedCategory === category.id
                ? "bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white shadow-lg shadow-purple-500/30"
                : "bg-card/70 backdrop-blur-sm text-foreground hover:bg-card hover:shadow-md border border-border/50"
            }`}
            style={{
              animationDelay: `${index * 50}ms`,
              transform: "translateZ(0)",
              willChange: "transform",
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  selectedCategory === category.id
                    ? "bg-white"
                    : "bg-muted-foreground"
                }`}
              />
              {category.name}
            </span>
            {selectedCategory === category.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-rose-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </button>
        ))}
      </div>

      {/* Category Selection Message */}
      {selectedCategoryData && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
                Category Selected: {selectedCategoryData.name}
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
                {selectedCategoryData.description}
              </p>
              <div className="flex items-center space-x-2 text-xs text-purple-600 dark:text-purple-400">
                <Plus className="w-4 h-4" />
                <span>You can now create tasks in this category</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {categories.length === 0 && (
        <div className="text-center py-8 animate-in fade-in-50 duration-500">
          <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          </div>
          <h4 className="text-base font-semibold text-foreground mb-2">
            No Categories Yet
          </h4>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
            Create your first category to start organizing your tasks
            efficiently
          </p>
        </div>
      )}
    </div>
  );
}
