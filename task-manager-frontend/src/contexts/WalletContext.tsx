"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  ReactNode,
} from "react";
import { ConnectionManager, ConnectionState } from "../lib/ConnectionManager";

// Environment check for logging
const isDev = process.env.NODE_ENV === "development";
const log = isDev ? console.log : () => {};
const warn = isDev ? console.warn : () => {};
const error = isDev ? console.error : () => {};

export interface WalletContextType {
  // State
  state: ConnectionState;

  // Actions
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  switchNetwork: (chainId: string) => Promise<boolean>;
  forceReconnect: () => Promise<boolean>;
  cancelReconnect: () => void;

  // Getters
  isConnected: boolean;
  account: string | null;
  chainId: string | null;
  connectionStatus: string;
  error: string | null;
  walletType: string | null;

  // Connection manager instance
  connectionManager: ConnectionManager | null;

  // Add these methods
  resetManualDisconnect: () => void;
  manuallyDisconnected: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
  config?: {
    autoConnect?: boolean;
    autoReconnect?: boolean;
    maxReconnectAttempts?: number;
    reconnectDelay?: number;
    showNotifications?: boolean;
  };
}

export function WalletProvider({ children, config = {} }: WalletProviderProps) {
  log("🔄 WalletProvider: Rendering...");

  const [connectionManager, setConnectionManager] =
    useState<ConnectionManager | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [state, setState] = useState<ConnectionState>({
    isConnected: false,
    account: null,
    chainId: null,
    connectionStatus: "disconnected",
    error: null,
    walletType: null,
    manuallyDisconnected: false,
  });

  // Use refs to prevent infinite loops
  const isInitializedRef = useRef(false);
  const isSettingUpListenersRef = useRef(false);

  // Initialize connection manager
  useEffect(() => {
    if (isInitializedRef.current) {
      log("🚫 WalletProvider: Already initialized, skipping...");
      return;
    }

    let isMounted = true;
    isInitializedRef.current = true;

    log("🚀 WalletProvider: Starting initialization...");

    const initializeManager = async () => {
      // Check if MetaMask is available first
      const isMetaMaskAvailable =
        typeof window !== "undefined" && window.ethereum;
      log("🔍 WalletProvider: MetaMask available:", isMetaMaskAvailable);

      if (!isMetaMaskAvailable) {
        warn("⚠️ WalletProvider: MetaMask not detected");
        if (isMounted) {
          setState((prev) => ({
            ...prev,
            error: "MetaMask not detected",
            connectionStatus: "disconnected",
          }));
          setIsReady(true); // Mark as ready even with error
        }
        return;
      }

      try {
        const manager = new ConnectionManager(config);
        log("🔍 WalletProvider: ConnectionManager created:", manager);

        setConnectionManager(manager);
        log("🔍 WalletProvider: connectionManager state updated");

        // Set up listeners
        if (!isSettingUpListenersRef.current) {
          isSettingUpListenersRef.current = true;
          log("🔍 WalletProvider: Setting up listeners...");

          manager.on("ready", () => {
            log("🔍 WalletProvider: Direct listener - ready");
            if (isMounted) {
              setIsReady(true);
            }
          });

          // Initialize the manager with MetaMask
          await manager.initializeWallet("metamask");
          log("🔍 WalletProvider: Wallet initialized, setting ready");
          setIsReady(true);
        }
      } catch (err) {
        error("❌ WalletProvider: Failed to initialize:", err);
        if (isMounted) {
          setState((prev) => ({
            ...prev,
            error: err instanceof Error ? err.message : "Initialization failed",
            connectionStatus: "disconnected",
          }));
          setIsReady(true); // Mark as ready even with error
        }
      }
    };

    initializeManager();

    return () => {
      isMounted = false;
    };
  }, [config]);

  // Set up event listeners when connection manager is ready
  useEffect(() => {
    log("🔍 WalletContext: useEffect triggered with:", {
      hasConnectionManager: !!connectionManager,
      isSettingUpListenersRef: isSettingUpListenersRef.current,
      connectionManagerType: connectionManager
        ? typeof connectionManager
        : "null",
    });

    if (!connectionManager) {
      log(
        " WalletContext: Skipping event listeners setup because: no connectionManager"
      );
      return;
    }

    log("🔧 WalletProvider: Setting up event listeners...");

    // State change listener
    const handleStateChanged = (newState: ConnectionState) => {
      log("🔍 WalletContext: Received stateChanged event:", newState);
      log("📊 WalletProvider: State changed:", newState);
      setState(newState);
    };

    // Connected listener
    const handleConnected = (account: string, chainId: string) => {
      log("🔍 WalletContext: Received connected event:", account, chainId);
      log("🟢 WalletContext: Wallet connected:", account, chainId);
    };

    // Disconnected listener
    const handleDisconnected = () => {
      log("🔴 WalletContext: Wallet disconnected");
    };

    // Error listener
    const handleError = (error: string) => {
      log("❌ WalletContext: Wallet error:", error);
    };

    // Chain changed listener
    const handleChainChanged = (chainId: string) => {
      log("🔄 WalletContext: Chain changed:", chainId);
    };

    // Add event listeners
    log("🔍 WalletContext: Adding event listeners to connectionManager");
    log("🔍 WalletContext: connectionManager instance:", connectionManager);
    connectionManager.on("stateChanged", handleStateChanged);
    connectionManager.on("connected", handleConnected);
    connectionManager.on("disconnected", handleDisconnected);
    connectionManager.on("error", handleError);
    connectionManager.on("chainChanged", handleChainChanged);

    log("🔍 WalletContext: Event listeners added successfully");

    // Test event emission - ONLY in development
    if (isDev) {
      log("🧪 WalletContext: Testing event emission...");
      connectionManager.emit("test", "test data");
      log("🧪 WalletContext: Test event emitted");
    }

    // Cleanup event listeners
    return () => {
      log("🧹 WalletProvider: Cleaning up event listeners...");
      connectionManager.off("stateChanged", handleStateChanged);
      connectionManager.off("connected", handleConnected);
      connectionManager.off("disconnected", handleDisconnected);
      connectionManager.off("error", handleError);
      connectionManager.off("chainChanged", handleChainChanged);
    };
  }, [connectionManager]);

  // Connect wallet
  const connect = useCallback(async (): Promise<boolean> => {
    if (!connectionManager) {
      error("Connection manager not initialized");
      return false;
    }

    try {
      return await connectionManager.connect();
    } catch (err) {
      error("Failed to connect wallet:", err);
      return false;
    }
  }, [connectionManager]);

  // Disconnect wallet
  const disconnect = useCallback(async (): Promise<void> => {
    if (!connectionManager) {
      error("Connection manager not initialized");
      return;
    }

    try {
      await connectionManager.disconnect();
    } catch (err) {
      error("Failed to disconnect wallet:", err);
    }
  }, [connectionManager]);

  // Switch network
  const switchNetwork = useCallback(
    async (chainId: string): Promise<boolean> => {
      if (!connectionManager) {
        error("Connection manager not initialized");
        return false;
      }

      try {
        return await connectionManager.switchNetwork(chainId);
      } catch (err) {
        error("Failed to switch network:", err);
        return false;
      }
    },
    [connectionManager]
  );

  // Force reconnect
  const forceReconnect = useCallback(async (): Promise<boolean> => {
    if (!connectionManager) {
      error("Connection manager not initialized");
      return false;
    }

    try {
      return await connectionManager.forceReconnect();
    } catch (err) {
      error("Failed to force reconnect:", err);
      return false;
    }
  }, [connectionManager]);

  // Cancel reconnect
  const cancelReconnect = useCallback((): void => {
    if (!connectionManager) {
      error("Connection manager not initialized");
      return;
    }
    connectionManager.cancelReconnect();
  }, [connectionManager]);

  // Reset manuallyDisconnected flag
  const resetManualDisconnect = useCallback((): void => {
    if (!connectionManager) {
      error("Connection manager not initialized");
      return;
    }
    connectionManager.resetManualDisconnect();
  }, [connectionManager]);

  // Context value with useMemo to prevent unnecessary re-renders
  const contextValue: WalletContextType = useMemo(
    () => ({
      // State
      state,

      // Actions
      connect,
      disconnect,
      switchNetwork,
      forceReconnect,
      cancelReconnect,

      // Getters
      isConnected: state.isConnected,
      account: state.account,
      chainId: state.chainId,
      connectionStatus: state.connectionStatus,
      error: state.error,
      walletType: state.walletType,

      // Connection manager instance
      connectionManager,

      // Add these
      resetManualDisconnect,
      manuallyDisconnected: state.manuallyDisconnected,
    }),
    [
      state,
      connect,
      disconnect,
      switchNetwork,
      forceReconnect,
      cancelReconnect,
      connectionManager,
      resetManualDisconnect,
      state.manuallyDisconnected,
    ]
  );

  // Don't render children until WalletProvider is ready
  if (!isReady) {
    log("⏳ WalletProvider: Waiting for initialization...");
    return (
      <div className="min-h-screen bg-muted animate-pulse flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing wallet...</p>
        </div>
      </div>
    );
  }

  log("✅ WalletProvider: Ready, rendering children...");

  // Error state - don't block children render, just log the error
  if (state.error && !connectionManager) {
    warn("⚠️ WalletProvider: Error state detected:", state.error);
    // Continue rendering children instead of blocking
  }

  log("🎯 WalletProvider: Context value:", {
    hasState: !!contextValue.state,
    hasConnectionManager: !!contextValue.connectionManager,
    isReady,
  });

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

// Custom hook to use wallet context
export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);

  if (context === undefined) {
    error("useWallet must be used within a WalletProvider");
    // Return a fallback context instead of throwing
    return {
      state: {
        isConnected: false,
        account: null,
        chainId: null,
        connectionStatus: "disconnected",
        error: "Wallet provider not available",
        walletType: null,
        manuallyDisconnected: false,
      },
      isConnected: false,
      account: null,
      chainId: null,
      error: "Wallet provider not available",
      connect: async () => false,
      disconnect: async () => {},
      connectionManager: null,
      switchNetwork: async () => false,
      forceReconnect: async () => false,
      cancelReconnect: async () => false,
      connectionStatus: "disconnected",
      walletType: null,
      resetManualDisconnect: () => {},
      manuallyDisconnected: false,
    };
  }

  return context;
}

// Hook for wallet state only
export function useWalletState(): ConnectionState {
  const { state } = useWallet();
  return state;
}

// Hook for wallet actions only
export function useWalletActions() {
  const {
    connect,
    disconnect,
    switchNetwork,
    forceReconnect,
    cancelReconnect,
  } = useWallet();
  return {
    connect,
    disconnect,
    switchNetwork,
    forceReconnect,
    cancelReconnect,
  };
}

// Hook for connection status
export function useConnectionStatus(): string {
  const { connectionStatus } = useWallet();
  return connectionStatus;
}

// Hook for wallet connection state
export function useWalletConnection(): {
  isConnected: boolean;
  account: string | null;
  chainId: string | null;
} {
  const { isConnected, account, chainId } = useWallet();
  return { isConnected, account, chainId };
}

// Hook for wallet errors
export function useWalletError(): string | null {
  const { error } = useWallet();
  return error;
}
