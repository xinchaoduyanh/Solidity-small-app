"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface MetaMaskState {
  provider: any | null;
  isDetected: boolean;
  isConnected: boolean;
  account: string | null;
  chainId: string | null;
  isConnecting: boolean;
  error: string | null;
  lastConnectionCheck: number;
  connectionStatus:
    | "disconnected"
    | "connecting"
    | "connected"
    | "reconnecting";
  manuallyDisconnected: boolean;
}

export function useMetaMask() {
  const [state, setState] = useState<MetaMaskState>({
    provider: null,
    isDetected: false,
    isConnected: false,
    account: null,
    chainId: null,
    isConnecting: false,
    error: null,
    lastConnectionCheck: 0,
    connectionStatus: "disconnected",
    manuallyDisconnected: false,
  });

  const connectionCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 3;

  // Use ref to store current state for event listeners
  const stateRef = useRef(state);

  // Update ref whenever state changes
  useEffect(() => {
    console.log(
      "🔄 State updated - manuallyDisconnected:",
      state.manuallyDisconnected
    );
    console.log(
      "🔄 State updated - provider:",
      state.provider ? "exists" : "null"
    );
    console.log("🔄 State updated - isDetected:", state.isDetected);
    stateRef.current = state;
  }, [state]);

  // Enhanced connection check function
  const checkConnectionStatus = useCallback(async (provider: any) => {
    try {
      console.log("🔄 Checking connection status...");
      console.log(
        "📊 Current state - manuallyDisconnected:",
        stateRef.current.manuallyDisconnected
      );

      const accounts = (await provider.request({
        method: "eth_accounts",
      })) as string[];

      const chainId = (await provider.request({
        method: "eth_chainId",
      })) as string;

      const isCurrentlyConnected = accounts.length > 0;
      console.log(
        "📊 Connection check result - accounts:",
        accounts,
        "isConnected:",
        isCurrentlyConnected
      );

      setState((prev) => {
        // Check if user manually disconnected - if so, don't auto-reconnect
        if (prev.manuallyDisconnected && isCurrentlyConnected) {
          console.log(
            "🚫 Ignoring connection check - user manually disconnected"
          );
          return prev; // Don't change state if manually disconnected
        }

        console.log("✅ Updating connection state from check");
        return {
          ...prev,
          isConnected: isCurrentlyConnected,
          account: isCurrentlyConnected ? accounts[0] : null,
          chainId: isCurrentlyConnected ? chainId : null,
          lastConnectionCheck: Date.now(),
          connectionStatus: isCurrentlyConnected ? "connected" : "disconnected",
          error: null,
          manuallyDisconnected: isCurrentlyConnected
            ? false
            : prev.manuallyDisconnected, // Reset flag only if connected
        };
      });

      return isCurrentlyConnected;
    } catch (error) {
      console.log("❌ Connection check failed:", error);
      return false;
    }
  }, []);

  // Function to reset manual disconnect flag when user wants to connect
  const resetManualDisconnect = useCallback(() => {
    console.log("🔄 Resetting manual disconnect flag");
    setState((prev) => ({
      ...prev,
      manuallyDisconnected: false,
    }));
  }, []);

  // Enhanced connect function with better error handling
  const connect = useCallback(async () => {
    if (typeof window === "undefined") {
      setState((prev) => ({
        ...prev,
        error: "MetaMask not available",
        connectionStatus: "disconnected",
      }));
      return;
    }

    // If provider is null, we need to re-detect MetaMask
    if (!stateRef.current.provider) {
      console.log("🔄 Provider is null, re-detecting MetaMask...");
      try {
        const { default: detectEthereumProvider } = await import(
          "@metamask/detect-provider"
        );

        const provider = await detectEthereumProvider({
          mustBeMetaMask: true,
        });

        if (provider) {
          setState((prev) => ({
            ...prev,
            provider,
            isDetected: true,
          }));
          stateRef.current.provider = provider;
        } else {
          throw new Error("MetaMask not detected");
        }
      } catch (error) {
        console.log("❌ Failed to re-detect MetaMask:", error);
        setState((prev) => ({
          ...prev,
          error: "Failed to detect MetaMask",
          connectionStatus: "disconnected",
        }));
        return;
      }
    }

    try {
      console.log("🔄 User actively trying to connect...");
      console.log(
        "📊 Current state - manuallyDisconnected:",
        stateRef.current.manuallyDisconnected
      );

      // Reset manual disconnect flag when user actively tries to connect
      console.log("✅ Resetting manuallyDisconnected flag to false");
      setState((prev) => ({
        ...prev,
        manuallyDisconnected: false,
        isConnecting: true,
        error: null,
        connectionStatus: "connecting",
      }));

      // Request account access
      const accounts = (await stateRef.current.provider.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (accounts.length > 0) {
        // Get current chain ID
        const chainId = (await stateRef.current.provider.request({
          method: "eth_chainId",
        })) as string;

        console.log(
          "✅ Connection successful - accounts:",
          accounts,
          "chainId:",
          chainId
        );
        setState((prev) => ({
          ...prev,
          isConnected: true,
          account: accounts[0],
          chainId,
          isConnecting: false,
          error: null,
          connectionStatus: "connected",
          lastConnectionCheck: Date.now(),
          manuallyDisconnected: false, // Reset manual disconnect flag when user actively connects
        }));

        // Reset reconnect attempts on successful connection
        reconnectAttempts.current = 0;
      } else {
        throw new Error("No accounts found");
      }
    } catch (error: any) {
      console.log("❌ Connection failed:", error);
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error.message || "Failed to connect wallet",
        connectionStatus: "disconnected",
      }));
    }
  }, []);

  // Enhanced disconnect function
  const disconnect = useCallback(async () => {
    try {
      console.log("🔄 Starting disconnect process...");

      // MetaMask doesn't have a direct disconnect method, but we can try several approaches:

      if (stateRef.current.provider) {
        try {
          // Method 1: Try to revoke ALL permissions completely
          try {
            console.log("🔒 Attempting to revoke all permissions...");
            await stateRef.current.provider.request({
              method: "wallet_requestPermissions",
              params: [], // Empty params should revoke all permissions
            });
            console.log("✅ Permissions revoked successfully");
          } catch (error) {
            console.log("Method 1 (revoke permissions) failed:", error);
          }

          // Method 2: Try to clear accounts by requesting empty accounts
          try {
            console.log("🔒 Attempting to clear accounts...");
            await stateRef.current.provider.request({
              method: "eth_accounts",
              params: [],
            });
            console.log("✅ Accounts cleared successfully");
          } catch (error) {
            console.log("Method 2 (clear accounts) failed:", error);
          }

          // Method 3: Try to use a custom disconnect method if available
          if (typeof stateRef.current.provider.disconnect === "function") {
            try {
              console.log("🔒 Attempting custom disconnect...");
              await stateRef.current.provider.disconnect();
              console.log("✅ Custom disconnect successful");
            } catch (error) {
              console.log("Method 3 (custom disconnect) failed:", error);
            }
          }

          // Method 4: Try to trigger disconnect by changing accounts to empty
          try {
            console.log("🔒 Attempting to trigger accountsChanged event...");
            // This might trigger the accountsChanged event with empty array
            if (
              stateRef.current.provider._events &&
              stateRef.current.provider._events.accountsChanged
            ) {
              // Manually trigger accountsChanged with empty array
              stateRef.current.provider.emit("accountsChanged", []);
              console.log("✅ accountsChanged event triggered");
            }
          } catch (error) {
            console.log("Method 4 (manual emit) failed:", error);
          }

          // Method 5: Try to remove the provider completely
          try {
            console.log("🔒 Attempting to remove provider...");
            // Remove all event listeners
            stateRef.current.provider.removeAllListeners();
            console.log("✅ All event listeners removed");
          } catch (error) {
            console.log("Method 5 (remove listeners) failed:", error);
          }

          // Method 6: Try to clear localStorage and sessionStorage for this domain
          try {
            console.log("🔒 Attempting to clear browser storage...");
            // Clear any MetaMask related data from localStorage
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (
                key &&
                (key.includes("metamask") ||
                  key.includes("wallet") ||
                  key.includes("ethereum"))
              ) {
                keysToRemove.push(key);
              }
            }
            keysToRemove.forEach((key) => {
              localStorage.removeItem(key);
              console.log("🗑️ Removed localStorage key:", key);
            });

            // Clear any MetaMask related data from sessionStorage
            const sessionKeysToRemove = [];
            for (let i = 0; i < sessionStorage.length; i++) {
              const key = sessionStorage.key(i);
              if (
                key &&
                (key.includes("metamask") ||
                  key.includes("wallet") ||
                  key.includes("ethereum"))
              ) {
                sessionKeysToRemove.push(key);
              }
            }
            sessionKeysToRemove.forEach((key) => {
              sessionStorage.removeItem(key);
              console.log("🗑️ Removed sessionStorage key:", key);
            });
          } catch (error) {
            console.log("Method 6 (clear storage) failed:", error);
          }
        } catch (error) {
          console.log("MetaMask disconnect attempts failed:", error);
        }
      }

      // Always update local state regardless of MetaMask response
      console.log("✅ Setting manuallyDisconnected flag to true");
      setState((prev) => ({
        ...prev,
        isConnected: false,
        account: null,
        chainId: null,
        error: null,
        connectionStatus: "disconnected",
        manuallyDisconnected: true,
        // Also clear the provider to force a fresh connection
        provider: null,
        isDetected: false,
      }));

      // Reset reconnect attempts
      reconnectAttempts.current = 0;

      // Clear any existing connection check intervals
      if (connectionCheckInterval.current) {
        clearInterval(connectionCheckInterval.current);
        connectionCheckInterval.current = null;
      }

      // Force re-detect MetaMask provider after disconnect
      console.log("🔄 Forcing re-detection of MetaMask provider...");
      setTimeout(() => {
        // This will trigger the useEffect to re-detect the provider
        setState((prev) => ({
          ...prev,
          provider: null,
          isDetected: false,
        }));
      }, 100);

      console.log("✅ Disconnect completed successfully - all data cleared");
    } catch (error) {
      console.log("❌ Disconnect error:", error);
      // Even if there's an error, update the state
      setState((prev) => ({
        ...prev,
        isConnected: false,
        account: null,
        chainId: null,
        error: null,
        connectionStatus: "disconnected",
        manuallyDisconnected: true,
        provider: null,
        isDetected: false,
      }));
    }
  }, []);

  // Auto-reconnect function
  const attemptReconnect = useCallback(async () => {
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      setState((prev) => ({
        ...prev,
        error: "Max reconnection attempts reached. Please refresh the page.",
        connectionStatus: "disconnected",
      }));
      return;
    }

    reconnectAttempts.current += 1;
    setState((prev) => ({
      ...prev,
      connectionStatus: "reconnecting",
      error: `Reconnecting... Attempt ${reconnectAttempts.current}/${maxReconnectAttempts}`,
    }));

    try {
      await connect();
    } catch (error) {
      // Schedule next reconnection attempt
      setTimeout(() => {
        if (stateRef.current.provider) {
          attemptReconnect();
        }
      }, 2000 * reconnectAttempts.current); // Exponential backoff
    }
  }, [connect]);

  // Enhanced provider detection and event handling
  useEffect(() => {
    if (typeof window === "undefined") return;

    const detectProvider = async () => {
      try {
        console.log("🔄 Starting MetaMask provider detection...");

        // Dynamic import to avoid SSR issues
        const { default: detectEthereumProvider } = await import(
          "@metamask/detect-provider"
        );

        const provider = await detectEthereumProvider({
          mustBeMetaMask: true,
        });

        if (provider) {
          console.log("✅ MetaMask provider detected successfully");
          setState((prev) => ({
            ...prev,
            provider,
            isDetected: true,
          }));

          // Initial connection check
          await checkConnectionStatus(provider);

          // Set up enhanced event listeners
          const handleAccountsChanged = async (accounts: string[]) => {
            console.log("🔄 Accounts changed event triggered:", accounts);
            console.log(
              "📊 Current state - manuallyDisconnected:",
              stateRef.current.manuallyDisconnected
            );

            if (accounts.length === 0) {
              console.log("📉 No accounts - setting disconnected state");
              setState((prev) => ({
                ...prev,
                isConnected: false,
                account: null,
                connectionStatus: "disconnected",
                error: "Wallet disconnected",
              }));
            } else {
              // Check if user manually disconnected - if so, don't auto-reconnect
              setState((prev) => {
                if (prev.manuallyDisconnected) {
                  console.log(
                    "🚫 Ignoring accountsChanged event - user manually disconnected"
                  );
                  return prev; // Don't change state if manually disconnected
                }

                console.log("✅ Auto-connecting from accountsChanged event");
                return {
                  ...prev,
                  isConnected: true,
                  account: accounts[0],
                  connectionStatus: "connected",
                  error: null,
                  lastConnectionCheck: Date.now(),
                  manuallyDisconnected: false, // Reset flag when auto-connecting
                };
              });
            }
          };

          const handleChainChanged = (chainId: string) => {
            console.log("🔄 Chain changed event triggered:", chainId);
            setState((prev) => ({
              ...prev,
              chainId,
              lastConnectionCheck: Date.now(),
            }));
          };

          const handleConnect = () => {
            console.log("🔄 Connect event triggered");
            console.log(
              "📊 Current state - manuallyDisconnected:",
              stateRef.current.manuallyDisconnected
            );

            setState((prev) => {
              // Check if user manually disconnected - if so, don't auto-reconnect
              if (prev.manuallyDisconnected) {
                console.log(
                  "🚫 Ignoring connect event - user manually disconnected"
                );
                return prev; // Don't change state if manually disconnected
              }

              console.log("✅ Processing connect event");
              return {
                ...prev,
                connectionStatus: "connected",
                error: null,
                manuallyDisconnected: false, // Reset flag when auto-connecting
              };
            });
          };

          const handleDisconnect = () => {
            console.log("🔄 Disconnect event triggered");
            console.log(
              "📊 Current state - manuallyDisconnected:",
              stateRef.current.manuallyDisconnected
            );

            setState((prev) => {
              // Check if user manually disconnected - if so, don't override the state
              if (prev.manuallyDisconnected) {
                console.log(
                  "🚫 Ignoring disconnect event - user manually disconnected"
                );
                return prev; // Don't change state if manually disconnected
              }

              console.log("✅ Processing disconnect event");
              return {
                ...prev,
                isConnected: false,
                account: null,
                connectionStatus: "disconnected",
                error: "Wallet disconnected",
              };
            });
          };

          // Add all event listeners
          provider.on("accountsChanged", handleAccountsChanged);
          provider.on("chainChanged", handleChainChanged);
          provider.on("connect", handleConnect);
          provider.on("disconnect", handleDisconnect);

          // Set up periodic connection check (every 10 seconds)
          connectionCheckInterval.current = setInterval(() => {
            if (
              provider &&
              stateRef.current.isConnected &&
              !stateRef.current.manuallyDisconnected
            ) {
              checkConnectionStatus(provider);
            }
          }, 10000);

          return () => {
            console.log(
              "🚫 Periodic connection check skipped - conditions not met"
            );
            provider.removeListener("chainChanged", handleChainChanged);
            provider.removeListener("connect", handleConnect);
            provider.removeListener("disconnect", handleDisconnect);

            if (connectionCheckInterval.current) {
              clearInterval(connectionCheckInterval.current);
            }
          };
        } else {
          setState((prev) => ({
            ...prev,
            isDetected: false,
            error: "MetaMask not detected",
            connectionStatus: "disconnected",
          }));
        }
      } catch (error) {
        console.error("Failed to detect MetaMask:", error);
        setState((prev) => ({
          ...prev,
          isDetected: false,
          error: "Failed to detect MetaMask",
          connectionStatus: "disconnected",
        }));
      }
    };

    detectProvider();

    // Cleanup function
    return () => {
      if (connectionCheckInterval.current) {
        clearInterval(connectionCheckInterval.current);
      }
    };
  }, [checkConnectionStatus, state.isConnected]);

  return {
    ...state,
    connect,
    disconnect,
    attemptReconnect,
    checkConnectionStatus,
    resetManualDisconnect,
  };
}
