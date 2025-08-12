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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 dark:shadow-indigo-400/30">
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
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">
            Filter Categories
          </h3>
          <p className="text-sm text-muted-foreground">
            Choose a category to filter tasks
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleFilterChange(null)}
          className={`group relative px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
            selectedCategory === null
              ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white shadow-xl shadow-blue-500/30"
              : "bg-card/70 backdrop-blur-sm text-foreground hover:bg-card hover:shadow-lg border border-border/50"
          }`}
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
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </button>

        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => handleFilterChange(category.id)}
            className={`group relative px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
              selectedCategory === category.id
                ? "bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white shadow-xl shadow-purple-500/30"
                : "bg-card/70 backdrop-blur-sm text-foreground hover:bg-card hover:shadow-lg border border-border/50"
            }`}
            style={{
              animationDelay: `${index * 50}ms`,
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
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-rose-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </button>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 animate-in fade-in-50 duration-500">
          <div className="w-20 h-20 bg-gradient-to-br from-muted to-muted/50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <svg
              className="w-10 h-10 text-muted-foreground"
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
          <h4 className="text-lg font-semibold text-foreground mb-2">
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
