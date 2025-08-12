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
        className="bg-orange-600 hover:bg-orange-700"
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
        className="bg-blue-600 hover:bg-blue-700"
      >
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    );
  }

  // Wrong network
  if (isWrongNetwork) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-600">Wrong Network</span>
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
          className="border border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
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
        <span className="text-sm text-red-600">{error}</span>
        <Button
          onClick={connect}
          className="border border-gray-300 bg-transparent hover:bg-gray-50"
        >
          Retry
        </Button>
      </div>
    );
  }

  // Connected state
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">
        {account && formatAddress(account)}
        {chainId && (
          <span className="ml-2 text-xs text-gray-400">
            (Chain: {parseInt(chainId, 16)})
          </span>
        )}
      </span>
      <Button
        onClick={disconnect}
        className="border border-gray-300 bg-transparent hover:bg-gray-50 text-sm px-3 py-1.5"
      >
        Disconnect
      </Button>
    </div>
  );
}
