export const UI_CONFIG = {
  // Animation
  ANIMATION: {
    DURATION: 300,
    EASING: "ease-in-out",
    DELAY: 100,
  },

  // Loading states
  LOADING: {
    SKELETON_ITEMS: 3,
    SPINNER_SIZE: "w-8 h-8",
    TEXT_COLOR: "text-muted-foreground",
  },

  // Colors
  COLORS: {
    PRIMARY: "#3B82F6",
    SECONDARY: "#8B5CF6",
    SUCCESS: "#10B981",
    WARNING: "#F59E0B",
    ERROR: "#EF4444",
    INFO: "#06B6D4",
  },

  // Spacing
  SPACING: {
    XS: "0.25rem",
    SM: "0.5rem",
    MD: "1rem",
    LG: "1.5rem",
    XL: "2rem",
    XXL: "3rem",
  },

  // Breakpoints
  BREAKPOINTS: {
    SM: "640px",
    MD: "768px",
    LG: "1024px",
    XL: "1280px",
    "2XL": "1536px",
  },
} as const;

export const UI_CLASSES = {
  // Common button styles
  BUTTON: {
    PRIMARY: "bg-primary hover:bg-primary/90 text-primary-foreground",
    SECONDARY: "bg-secondary hover:bg-secondary/90 text-secondary-foreground",
    SUCCESS: "bg-green-600 hover:bg-green-700 text-white",
    DANGER: "bg-red-600 hover:bg-red-700 text-white",
    OUTLINE:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  },

  // Card styles
  CARD: {
    DEFAULT:
      "border border-border rounded-lg p-4 hover:shadow-sm transition-shadow bg-card/50",
    HOVER: "hover:shadow-md hover:border-primary/20",
  },

  // Text styles
  TEXT: {
    TITLE: "text-lg font-semibold text-foreground",
    SUBTITLE: "text-sm font-medium text-muted-foreground",
    BODY: "text-sm text-foreground",
    CAPTION: "text-xs text-muted-foreground",
  },
} as const;
