"use client";

import { useState, useEffect, useCallback } from "react";

export interface MetaMaskState {
  provider: any | null;
  isDetected: boolean;
  isConnected: boolean;
  account: string | null;
  chainId: string | null;
  isConnecting: boolean;
  error: string | null;
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
  });

  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !state.provider) {
      setState((prev) => ({ ...prev, error: "MetaMask not available" }));
      return;
    }

    try {
      setState((prev) => ({ ...prev, isConnecting: true, error: null }));

      // Request account access
      const accounts = (await state.provider.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (accounts.length > 0) {
        // Get current chain ID
        const chainId = (await state.provider.request({
          method: "eth_chainId",
        })) as string;

        setState((prev) => ({
          ...prev,
          isConnected: true,
          account: accounts[0],
          chainId,
          isConnecting: false,
          error: null,
        }));
      } else {
        throw new Error("No accounts found");
      }
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error.message || "Failed to connect wallet",
      }));
    }
  }, [state.provider]);

  const disconnect = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isConnected: false,
      account: null,
      chainId: null,
      error: null,
    }));
  }, []);

  // Detect MetaMask provider on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const detectProvider = async () => {
      try {
        // Dynamic import to avoid SSR issues
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

          // Check if already connected
          try {
            const accounts = (await provider.request({
              method: "eth_accounts",
            })) as string[];
            const chainId = (await provider.request({
              method: "eth_chainId",
            })) as string;

            if (accounts.length > 0) {
              setState((prev) => ({
                ...prev,
                isConnected: true,
                account: accounts[0],
                chainId,
              }));
            }
          } catch (error) {
            console.log("No existing connection");
          }

          // Set up event listeners
          const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length === 0) {
              setState((prev) => ({
                ...prev,
                isConnected: false,
                account: null,
              }));
            } else {
              setState((prev) => ({
                ...prev,
                account: accounts[0],
              }));
            }
          };

          const handleChainChanged = (chainId: string) => {
            setState((prev) => ({
              ...prev,
              chainId,
            }));
          };

          provider.on("accountsChanged", handleAccountsChanged);
          provider.on("chainChanged", handleChainChanged);

          return () => {
            provider.removeListener("accountsChanged", handleAccountsChanged);
            provider.removeListener("chainChanged", handleChainChanged);
          };
        } else {
          setState((prev) => ({
            ...prev,
            isDetected: false,
            error: "MetaMask not detected",
          }));
        }
      } catch (error) {
        console.error("Failed to detect MetaMask:", error);
        setState((prev) => ({
          ...prev,
          isDetected: false,
          error: "Failed to detect MetaMask",
        }));
      }
    };

    detectProvider();
  }, []);

  return {
    ...state,
    connect,
    disconnect,
  };
}
