export const BLOCKCHAIN_CONFIG = {
  // Contract addresses
  CONTRACTS: {
    TASK_MANAGER: process.env.NEXT_PUBLIC_TASK_MANAGER_ADDRESS || "",
  },

  // Gas settings
  GAS: {
    DEFAULT_LIMIT: 300000,
    MULTIPLIER: 1.2,
    MAX_PRIORITY_FEE: "2000000000", // 2 gwei
  },

  // Transaction settings
  TRANSACTION: {
    CONFIRMATION_BLOCKS: 1,
    TIMEOUT_SECONDS: 300, // 5 minutes
    MAX_RETRIES: 3,
  },

  // Network settings
  NETWORKS: {
    LOCALHOST: {
      chainId: "0x7a69",
      name: "Localhost 8545",
      rpcUrl: "http://localhost:8545",
      blockExplorer: "",
    },
    SEPOLIA: {
      chainId: "0xaa36a7",
      name: "Sepolia Testnet",
      rpcUrl: "https://sepolia.infura.io/v3/",
      blockExplorer: "https://sepolia.etherscan.io",
    },
  },
} as const;

export const BLOCKCHAIN_EVENTS = {
  TRANSACTION_SENT: "transactionSent",
  TRANSACTION_CONFIRMED: "transactionConfirmed",
  TRANSACTION_FAILED: "transactionFailed",
  CONTRACT_ERROR: "contractError",
} as const;
