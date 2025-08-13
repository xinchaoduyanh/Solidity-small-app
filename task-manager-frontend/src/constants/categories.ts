export interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: 1, name: "General", description: "General tasks", color: "#3B82F6" },
  { id: 2, name: "Work", description: "Work related tasks", color: "#8B5CF6" },
  { id: 3, name: "Personal", description: "Personal tasks", color: "#10B981" },
  { id: 4, name: "Study", description: "Study tasks", color: "#F59E0B" },
  { id: 5, name: "Health", description: "Health tasks", color: "#EF4444" },
];

export const getCategoryById = (id: number): Category | undefined => {
  return CATEGORIES.find((cat) => cat.id === id);
};

export const getCategoryName = (id: number): string => {
  const category = getCategoryById(id);
  return category ? category.name : `Category ${id}`;
};
