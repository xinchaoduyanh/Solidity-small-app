// Wallet Management
export { WalletManager } from "./WalletManager";
export type { WalletState, WalletEvents } from "./WalletManager";

// Wallet Adapters
export type { WalletAdapter, BaseWalletAdapter } from "./WalletAdapter";
export type { WalletAdapterConfig } from "./WalletAdapter";

// MetaMask Adapter
export { MetaMaskAdapter } from "./adapters/MetaMaskAdapter";
export type { MetaMaskState } from "./adapters/MetaMaskAdapter";

// Connection Management
export { ConnectionManager } from "./ConnectionManager";
export type {
  ConnectionManagerConfig,
  ConnectionState,
} from "./ConnectionManager";

// Context
export {
  WalletProvider,
  useWallet,
  useWalletState,
  useWalletActions,
  useConnectionStatus,
  useWalletConnection,
  useWalletError,
} from "../contexts/WalletContext";
export type { WalletContextType } from "../contexts/WalletContext";
