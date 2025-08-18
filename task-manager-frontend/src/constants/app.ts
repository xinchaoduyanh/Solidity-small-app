import { UI_CONFIG } from "./ui";

export const APP_CONFIG = {
  // Blockchain
  BLOCKCHAIN: {
    REFRESH_INTERVAL: 10000, // 10 seconds
    GAS_MULTIPLIER: parseFloat(process.env.NEXT_PUBLIC_GAS_MULTIPLIER || "1.2"),
    MAX_RETRY_COUNT: 3,
  },

  // Wallet
  WALLET: {
    AUTO_CONNECT: false,
    AUTO_RECONNECT: false,
    MAX_RECONNECT_ATTEMPTS: 0,
    RECONNECT_DELAY: 0,
    SHOW_NOTIFICATIONS: true,
  },

  // UI
  UI: {
    SKELETON_ITEMS: UI_CONFIG.LOADING.SKELETON_ITEMS,
    ANIMATION_DURATION: UI_CONFIG.ANIMATION.DURATION,
  },

  // Cache
  CACHE: {
    TASKS_KEY: "tasks",
  },
} as const;

export const ERROR_MESSAGES = {
  WALLET: {
    NOT_CONNECTED: "No wallet connected",
    NOT_AVAILABLE: "Web3 not available",
    CONTRACT_NOT_AVAILABLE:
      "Contract not available. Please check your network and contract configuration.",
    META_MASK_NOT_DETECTED: "MetaMask not detected",
  },
  TASKS: {
    CREATE_FAILED: "Failed to create task",
    COMPLETE_FAILED: "Failed to complete task",
    FETCH_FAILED: "Failed to fetch tasks",
    SERVER_SIDE_ERROR: "Cannot perform action on server side",
  },
} as const;
