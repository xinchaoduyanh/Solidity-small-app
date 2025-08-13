"use client";

import React from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/ui/button";
import { useState } from "react";

function ConnectWalletButton() {
  try {
    const {
      state,
      isConnected,
      account,
      chainId,
      error,
      connect,
      disconnect,
      connectionManager,
    } = useWallet();

    // Debug logging - thêm log này
    console.log("🔍 ConnectWalletButton: Component rendered with state:", {
      state,
      isConnected,
      account,
      chainId,
      error,
      hasConnectionManager: !!connectionManager,
      connectionStatus: state.connectionStatus,
      isConnectedFromState: state.isConnected,
    });

    // Check if MetaMask is available in the browser
    const isMetaMaskAvailable =
      typeof window !== "undefined" && window.ethereum;
    const isDetected = isMetaMaskAvailable;
    const isConnecting = state.connectionStatus === "connecting";

    const [isDisconnecting, setIsDisconnecting] = useState(false);

    const formatAddress = (address: string) => {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const handleDisconnect = async () => {
      setIsDisconnecting(true);
      try {
        await disconnect();
      } catch (error) {
        console.error("Disconnect failed:", error);
      } finally {
        setIsDisconnecting(false);
      }
    };

    const targetChainId = process.env.NEXT_PUBLIC_CHAIN_ID || "1337";
    const isWrongNetwork =
      chainId && chainId !== `0x${parseInt(targetChainId).toString(16)}`;

    // MetaMask not detected - show install prompt
    if (!isDetected) {
      return (
        <div className="flex flex-col items-center gap-2">
          <Button
            onClick={() =>
              window.open("https://metamask.io/download/", "_blank")
            }
            className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
          >
            Install MetaMask
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            MetaMask extension not detected
          </p>
        </div>
      );
    }

    // MetaMask detected but not connected
    if (!isConnected) {
      return (
        <div className="flex flex-col items-center gap-2">
          <Button
            onClick={connect}
            disabled={isConnecting}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
          {error && (
            <div className="text-xs text-red-500 text-center max-w-32">
              {error}
            </div>
          )}
        </div>
      );
    }

    // Wrong network
    if (isWrongNetwork) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-destructive">Wrong Network</span>
          <Button
            onClick={() => {
              if (connectionManager) {
                connectionManager.switchNetwork(
                  `0x${parseInt(targetChainId).toString(16)}`
                );
              }
            }}
            variant="outline"
            className="text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            Switch Network
          </Button>
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-destructive">{error}</span>
          <Button onClick={connect} variant="outline">
            Retry
          </Button>
        </div>
      );
    }

    // Connected state
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {account && formatAddress(account)}
          {chainId && (
            <span className="ml-2 text-xs text-muted-foreground/70">
              (Chain: {parseInt(chainId, 16)})
            </span>
          )}
        </span>
        <Button
          onClick={handleDisconnect}
          variant="outline"
          size="sm"
          disabled={isDisconnecting}
        >
          {isDisconnecting ? "Disconnecting..." : "Disconnect"}
        </Button>
      </div>
    );
  } catch (error) {
    console.error("❌ ConnectWalletButton: Error in component:", error);
    // Fallback when WalletProvider is not available
    return (
      <Button
        onClick={() => window.open("https://metamask.io/download/", "_blank")}
        className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
      >
        Install MetaMask
      </Button>
    );
  }
}

// Export with React.memo to prevent unnecessary re-renders
export default React.memo(ConnectWalletButton);
