"use client";

import { useState, useEffect, useCallback } from "react";
import { web3Service } from "../lib/web3";

export interface WalletState {
  isConnected: boolean;
  account: string | null;
  networkId: number | null;
  isConnecting: boolean;
  error: string | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    account: null,
    networkId: null,
    isConnecting: false,
    error: null,
  });

  const connect = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isConnecting: true, error: null }));

      const web3 = await web3Service.initialize();
      if (!web3) {
        throw new Error("Failed to initialize Web3");
      }

      const accounts = await web3Service.getAccounts();
      const networkId = await web3Service.getNetworkId();

      if (accounts.length > 0) {
        setState({
          isConnected: true,
          account: accounts[0],
          networkId,
          isConnecting: false,
          error: null,
        });
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
  }, []);

  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      account: null,
      networkId: null,
      isConnecting: false,
      error: null,
    });
  }, []);

  const switchNetwork = useCallback(async (chainId: string) => {
    try {
      await web3Service.switchNetwork(chainId);
      const networkId = await web3Service.getNetworkId();
      setState((prev) => ({ ...prev, networkId }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || "Failed to switch network",
      }));
    }
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const provider = web3Service.getProvider();
        if (provider && provider.isMetaMask) {
          const accounts = await provider.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            const web3 = await web3Service.initialize();
            if (web3) {
              const networkId = await web3Service.getNetworkId();
              setState({
                isConnected: true,
                account: accounts[0],
                networkId,
                isConnecting: false,
                error: null,
              });
            }
          }
        }
      } catch (error) {
        console.error("Auto-connect failed:", error);
      }
    };

    checkConnection();

    // Listen for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setState((prev) => ({ ...prev, account: accounts[0] }));
      }
    };

    // Listen for chain changes
    const handleChainChanged = (chainId: string) => {
      setState((prev) => ({ ...prev, networkId: parseInt(chainId, 16) }));
    };

    const provider = web3Service.getProvider();
    if (provider) {
      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);

      return () => {
        provider.removeListener("accountsChanged", handleAccountsChanged);
        provider.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    switchNetwork,
  };
}
