export const WALLET_CONFIG = {
  // MetaMask
  META_MASK: {
    AUTO_CONNECT: false,
    AUTO_RECONNECT: false,
    MAX_RECONNECT_ATTEMPTS: 0,
    RECONNECT_DELAY: 0,
    SHOW_NOTIFICATIONS: true,
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
      chainId: "0xaa36a7",
      name: "Sepolia Testnet",
      rpcUrl: "https://sepolia.infura.io/v3/",
      blockExplorer: "https://sepolia.etherscan.io",
    },
    LOCALHOST: {
      chainId: "0x7a69",
      name: "Localhost 8545",
      rpcUrl: "http://localhost:8545",
      blockExplorer: "",
    },
  },

  // Default network
  DEFAULT_NETWORK: "0x7a69", // Localhost for development
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
