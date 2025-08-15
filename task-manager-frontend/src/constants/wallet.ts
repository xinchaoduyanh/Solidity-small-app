export const WALLET_CONFIG = {
  // MetaMask
  META_MASK: {
    AUTO_CONNECT: process.env.NEXT_PUBLIC_AUTO_CONNECT === "true",
    AUTO_RECONNECT: false,
    MAX_RECONNECT_ATTEMPTS: 0,
    RECONNECT_DELAY: 0,
    SHOW_NOTIFICATIONS:
      process.env.NEXT_PUBLIC_SHOW_TRANSACTION_NOTIFICATIONS === "true",
  },

  // Supported networks
  NETWORKS: {
    ETHEREUM_MAINNET: {
      chainId: "0x1",
      name: "Ethereum Mainnet",
      rpcUrl: "https://mainnet.infura.io/v3/",
      blockExplorer: "https://etherscan.io",
    },
    ETHEREUM_SEPOLIA: {
      chainId: "0xaa36a7", // 11155111 in hex
      name: "Sepolia Testnet",
      rpcUrl:
        process.env.NEXT_PUBLIC_INFURA_SEPOLIA_URL ||
        "https://sepolia.infura.io/v3/",
      blockExplorer:
        process.env.NEXT_PUBLIC_BLOCK_EXPLORER ||
        "https://sepolia.etherscan.io",
    },
    LOCALHOST: {
      chainId: "0x7a69",
      name: "Localhost 8545",
      rpcUrl: "http://localhost:8545",
      blockExplorer: "",
    },
  },

  // Default network - Chuyển sang Sepolia
  DEFAULT_NETWORK: "0xaa36a7", // Sepolia testnet
} as const;

export const WALLET_EVENTS = {
  CONNECTED: "connected",
  DISCONNECTED: "disconnected",
  ACCOUNT_CHANGED: "accountsChanged",
  CHAIN_CHANGED: "chainChanged",
  STATE_CHANGED: "stateChanged",
  ERROR: "error",
  READY: "ready",
} as const;
