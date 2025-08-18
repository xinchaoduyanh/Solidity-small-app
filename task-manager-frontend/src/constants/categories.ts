export interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 1,
    name: "General",
    description:
      "General tasks and miscellaneous items that don't fit other categories",
    color: "#3B82F6",
  },
  {
    id: 2,
    name: "Work",
    description:
      "Professional tasks, meetings, deadlines, and work-related projects",
    color: "#8B5CF6",
  },
  {
    id: 3,
    name: "Personal",
    description:
      "Personal life tasks, family matters, and daily personal activities",
    color: "#10B981",
  },
  {
    id: 4,
    name: "Study",
    description:
      "Learning goals, courses, research, and educational activities",
    color: "#F59E0B",
  },
  {
    id: 5,
    name: "Health",
    description:
      "Fitness goals, medical appointments, wellness activities, and self-care",
    color: "#EF4444",
  },
  {
    id: 6,
    name: "Finance",
    description:
      "Budget planning, bill payments, investments, and financial goals",
    color: "#06B6D4",
  },
  {
    id: 7,
    name: "Travel",
    description:
      "Trip planning, bookings, travel documents, and vacation preparation",
    color: "#84CC16",
  },
  {
    id: 8,
    name: "Home",
    description:
      "Household chores, maintenance, decoration, and home improvement projects",
    color: "#F97316",
  },
  {
    id: 9,
    name: "Creative",
    description: "Art projects, writing, design work, and creative endeavors",
    color: "#EC4899",
  },
  {
    id: 10,
    name: "Social",
    description:
      "Social events, networking, community activities, and relationship building",
    color: "#6366F1",
  },
];

export const getCategoryById = (id: number): Category | undefined => {
  return CATEGORIES.find((cat) => cat.id === id);
};

export const getCategoryName = (id: number): string => {
  const category = getCategoryById(id);
  return category ? category.name : `Category ${id}`;
};
