import Web3 from "web3";

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// SSR-safe Web3 helper function
export function getWeb3(): Web3 | null {
  if (typeof window === "undefined" || !window.ethereum) {
    return null;
  }
  return new Web3(window.ethereum);
}

// Legacy service class - kept for backward compatibility
export class Web3Service {
  private web3: Web3 | null = null;
  private provider: any = null;

  async initialize(): Promise<Web3 | null> {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      // Dynamic import to avoid SSR issues
      const { default: detectEthereumProvider } = await import(
        "@metamask/detect-provider"
      );

      this.provider = await detectEthereumProvider();

      if (!this.provider) {
        throw new Error("Please install MetaMask!");
      }

      if (this.provider !== window.ethereum) {
        throw new Error("Multiple wallets detected!");
      }

      this.web3 = new Web3(this.provider);

      // Request account access
      await this.provider.request({ method: "eth_requestAccounts" });

      return this.web3;
    } catch (error) {
      console.error("Failed to initialize Web3:", error);
      return null;
    }
  }

  async getAccounts(): Promise<string[]> {
    if (!this.web3) {
      throw new Error("Web3 not initialized");
    }
    return await this.web3.eth.getAccounts();
  }

  async getNetworkId(): Promise<number> {
    if (!this.web3) {
      throw new Error("Web3 not initialized");
    }
    return Number(await this.web3.eth.net.getId());
  }

  async switchNetwork(chainId: string): Promise<void> {
    if (!this.provider) {
      throw new Error("Provider not initialized");
    }

    try {
      await this.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added, add it
        await this.provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId,
              chainName: "Local Network",
              nativeCurrency: {
                name: "ETH",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: [
                process.env.NEXT_PUBLIC_NETWORK_RPC || "http://127.0.0.1:7545",
              ],
            },
          ],
        });
      } else {
        throw error;
      }
    }
  }

  getWeb3(): Web3 | null {
    return this.web3;
  }

  getProvider(): any {
    return this.provider;
  }
}

export const web3Service = new Web3Service();
