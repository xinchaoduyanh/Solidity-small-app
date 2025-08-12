"use client";

import { useMetaMask } from "@/hooks/useMetaMask";
import { Button } from "@/ui/button";

export default function ConnectWalletButton() {
  const {
    provider,
    isDetected,
    isConnected,
    account,
    chainId,
    isConnecting,
    error,
    connect,
    disconnect,
  } = useMetaMask();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const targetChainId = process.env.NEXT_PUBLIC_CHAIN_ID || "1337";
  const isWrongNetwork =
    chainId && chainId !== `0x${parseInt(targetChainId).toString(16)}`;

  // MetaMask not detected - show install prompt
  if (!isDetected) {
    return (
      <Button
        onClick={() => window.open("https://metamask.io/download/", "_blank")}
        className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
      >
        Install MetaMask
      </Button>
    );
  }

  // MetaMask detected but not connected
  if (!isConnected) {
    return (
      <Button
        onClick={connect}
        disabled={isConnecting}
        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    );
  }

  // Wrong network
  if (isWrongNetwork) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-destructive">Wrong Network</span>
        <Button
          onClick={() => {
            if (provider) {
              provider.request({
                method: "wallet_switchEthereumChain",
                params: [
                  { chainId: `0x${parseInt(targetChainId).toString(16)}` },
                ],
              });
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
      <Button onClick={disconnect} variant="outline" size="sm">
        Disconnect
      </Button>
    </div>
  );
}
