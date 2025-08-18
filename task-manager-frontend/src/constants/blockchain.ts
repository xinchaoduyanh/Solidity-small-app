export const BLOCKCHAIN_CONFIG = {
  // Contract addresses
  CONTRACTS: {
    TASK_MANAGER: process.env.NEXT_PUBLIC_TASK_MANAGER_ADDRESS || "",
  },

  // Gas settings
  GAS: {
    DEFAULT_LIMIT: parseInt(
      process.env.NEXT_PUBLIC_DEFAULT_GAS_LIMIT || "200000"
    ),
    MULTIPLIER: parseFloat(process.env.NEXT_PUBLIC_GAS_MULTIPLIER || "1.1"),
    MAX_PRIORITY_FEE: process.env.NEXT_PUBLIC_MAX_PRIORITY_FEE || "1000000000", // 1 gwei (tối thiểu)
    DEFAULT_PRICE: process.env.NEXT_PUBLIC_DEFAULT_GAS_PRICE || "10000000000", // 10 gwei
  },

  // Transaction settings
  TRANSACTION: {
    CONFIRMATION_BLOCKS: 1, // Giảm từ 2 xuống 1 (tối thiểu)
    TIMEOUT_SECONDS: 180, // Giảm từ 300 xuống 180 (3 phút)
    MAX_RETRIES: 2, // Giảm từ 3 xuống 2
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
      chainId: "0xaa36a7", // 11155111 in hex
      name: "Sepolia Testnet",
      rpcUrl:
        process.env.NEXT_PUBLIC_INFURA_SEPOLIA_URL ||
        "https://sepolia.infura.io/v3/",
      blockExplorer:
        process.env.NEXT_PUBLIC_BLOCK_EXPLORER ||
        "https://sepolia.etherscan.io",
    },
  },
} as const;

export const BLOCKCHAIN_EVENTS = {
  TRANSACTION_SENT: "transactionSent",
  TRANSACTION_CONFIRMED: "transactionConfirmed",
  TRANSACTION_FAILED: "transactionFailed",
  CONTRACT_ERROR: "contractError",
} as const;
