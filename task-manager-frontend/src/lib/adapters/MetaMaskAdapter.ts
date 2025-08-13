import { BaseWalletAdapter, WalletAdapterConfig } from "../WalletAdapter";
import { WalletState } from "../WalletManager";

export interface MetaMaskState extends WalletState {
  isDetected: boolean;
  manuallyDisconnected: boolean;
}

export class MetaMaskAdapter extends BaseWalletAdapter {
  private provider: any | null = null;
  private connectionCheckInterval: NodeJS.Timeout | null = null;
  private reconnectAttempts: number = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor(config: WalletAdapterConfig = {}) {
    super(config);

    // Initialize state
    this.state = {
      isConnected: false,
      account: null,
      chainId: null,
      isConnecting: false,
      error: null,
      connectionStatus: "disconnected",
      manuallyDisconnected: false,
      provider: null,
      isDetected: false,
    };
  }

  async connect(): Promise<boolean> {
    try {
      if (!this.provider) {
        const detected = await this.detectProvider();
        if (!detected) return false;
      }

      console.log("🔄 MetaMask: User actively trying to connect...");
      console.log(
        "📊 Current state - manuallyDisconnected:",
        this.state.manuallyDisconnected
      );

      // CRITICAL: Reset manual disconnect flag when user actively tries to connect
      if (this.state.manuallyDisconnected) {
        console.log(
          "🔄 MetaMask: Resetting manuallyDisconnected flag for user-initiated connect"
        );
        this.setState({
          manuallyDisconnected: false,
        });
      }

      console.log("✅ MetaMask: Resetting manuallyDisconnected flag to false");
      this.setState({
        manuallyDisconnected: false,
        isConnecting: true,
        error: null,
        connectionStatus: "connecting",
      });

      const accounts = await this.provider!.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const chainId = await this.provider!.request({ method: "eth_chainId" });

        console.log(
          "✅ MetaMask: Connection successful - accounts:",
          accounts,
          "chainId:",
          chainId
        );

        // Thêm log này để debug
        console.log("🔍 MetaMask: About to emit stateChanged event");

        this.setState({
          isConnected: true,
          account: accounts[0],
          chainId,
          isConnecting: false,
          error: null,
          connectionStatus: "connected",
          manuallyDisconnected: false,
        });

        // Thêm log này để debug
        console.log(
          "🔍 MetaMask: State updated, checking if events were emitted"
        );

        // Reset reconnect attempts
        this.reconnectAttempts = 0;

        // Start periodic connection check
        this.startPeriodicCheck();

        return true;
      } else {
        throw new Error("No accounts found");
      }
    } catch (error: any) {
      console.log("❌ MetaMask: Connection failed:", error);
      this.setState({
        isConnecting: false,
        error: error.message || "Failed to connect MetaMask",
        connectionStatus: "disconnected",
      });
      return false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      console.log("🔄 MetaMask: Starting disconnect process...");
      console.log("📊 MetaMask: Current state before disconnect:", this.state);

      // Stop periodic connection check
      this.stopPeriodicCheck();
      console.log("✅ MetaMask: Periodic check stopped");

      // Clear reconnect timeout
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
        console.log("✅ MetaMask: Reconnect timeout cleared");
      }

      // Reset reconnect attempts
      this.reconnectAttempts = 0;
      console.log("✅ MetaMask: Reconnect attempts reset");

      // Clear provider and state
      if (this.provider) {
        console.log("🔄 MetaMask: Removing event listeners from provider");
        // Remove all event listeners
        this.provider.removeAllListeners();
        console.log("✅ MetaMask: Provider event listeners removed");
      }

      // Update state to disconnected
      console.log("🔄 MetaMask: About to update state to disconnected");
      this.setState({
        isConnected: false,
        account: null,
        chainId: null,
        error: null,
        connectionStatus: "disconnected",
        manuallyDisconnected: true,
        provider: null,
        isDetected: false,
        isConnecting: false,
      });
      console.log("✅ MetaMask: State updated to disconnected");

      console.log("✅ MetaMask: Disconnect completed successfully");
    } catch (error) {
      console.log("❌ MetaMask: Disconnect error:", error);
      // Even if there's an error, update the state
      this.setState({
        isConnected: false,
        account: null,
        chainId: null,
        error: null,
        connectionStatus: "disconnected",
        manuallyDisconnected: true,
        provider: null,
        isDetected: false,
        isConnecting: false,
      });
    }
  }

  isConnected(): boolean {
    return this.state.isConnected;
  }

  getAccount(): string | null {
    return this.state.account;
  }

  getChainId(): string | null {
    return this.state.chainId;
  }

  getProvider(): any | null {
    return this.provider;
  }

  async switchNetwork(chainId: string): Promise<boolean> {
    try {
      if (!this.provider) return false;

      await this.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });

      return true;
    } catch (error) {
      console.log("❌ MetaMask: Failed to switch network:", error);
      return false;
    }
  }

  async getNetworkId(): Promise<number> {
    try {
      if (!this.provider) return 0;

      const chainId = await this.provider.request({ method: "eth_chainId" });
      return parseInt(chainId, 16);
    } catch (error) {
      console.log("❌ MetaMask: Failed to get network ID:", error);
      return 0;
    }
  }

  // MetaMask specific methods
  async detectProvider(): Promise<boolean> {
    try {
      if (typeof window === "undefined") {
        this.setState({
          isDetected: false,
          error: "MetaMask not available in this environment",
        });
        return false;
      }

      const { default: detectEthereumProvider } = await import(
        "@metamask/detect-provider"
      );
      const provider = await detectEthereumProvider({ mustBeMetaMask: true });

      if (provider) {
        this.provider = provider;
        this.setState({
          provider,
          isDetected: true,
          error: null,
        });

        // Set up event listeners
        this.setupEventListeners(provider);

        // Check initial connection status
        await this.checkConnectionStatus(provider);

        return true;
      } else {
        this.setState({
          isDetected: false,
          error: "MetaMask not detected",
        });
        return false;
      }
    } catch (error) {
      this.setState({
        isDetected: false,
        error: "Failed to detect MetaMask",
      });
      return false;
    }
  }

  private setupEventListeners(provider: any): void {
    // Remove existing listeners if any
    provider.removeAllListeners();
    console.log("🧹 MetaMask: Removed existing event listeners");

    // Accounts changed
    provider.on("accountsChanged", (accounts: string[]) => {
      console.log("🔄 MetaMask: Accounts changed event:", accounts);
      console.log(
        "📊 MetaMask: Current manuallyDisconnected state:",
        this.state.manuallyDisconnected
      );

      if (this.state.manuallyDisconnected) {
        console.log(
          "🚫 MetaMask: BLOCKING accountsChanged event - user manually disconnected"
        );
        return;
      }

      if (accounts.length === 0) {
        console.log("📉 MetaMask: No accounts - setting disconnected state");
        this.setState({
          isConnected: false,
          account: null,
          connectionStatus: "disconnected",
          error: "Wallet disconnected",
        });
      } else {
        console.log("✅ MetaMask: Auto-connecting from accountsChanged event");
        this.setState({
          isConnected: true,
          account: accounts[0],
          connectionStatus: "connected",
          error: null,
          manuallyDisconnected: false,
        });
      }
    });

    // Chain changed
    provider.on("chainChanged", (chainId: string) => {
      console.log("🔄 MetaMask: Chain changed event:", chainId);
      this.setState({ chainId });
    });

    // Connect event
    provider.on("connect", () => {
      console.log("🔄 MetaMask: Connect event triggered");
      console.log(
        "📊 MetaMask: Current manuallyDisconnected state:",
        this.state.manuallyDisconnected
      );

      if (this.state.manuallyDisconnected) {
        console.log(
          "🚫 MetaMask: BLOCKING connect event - user manually disconnected"
        );
        return;
      }

      console.log("✅ MetaMask: Processing connect event");
      this.setState({
        connectionStatus: "connected",
        error: null,
        manuallyDisconnected: false,
      });
    });

    // Disconnect event
    provider.on("disconnect", () => {
      console.log("🔄 MetaMask: Disconnect event triggered");
      console.log(
        "📊 MetaMask: Current manuallyDisconnected state:",
        this.state.manuallyDisconnected
      );

      if (this.state.manuallyDisconnected) {
        console.log(
          "🚫 MetaMask: BLOCKING disconnect event - user manually disconnected"
        );
        return;
      }

      console.log("✅ MetaMask: Processing disconnect event");
      this.setState({
        isConnected: false,
        account: null,
        connectionStatus: "disconnected",
        error: "Wallet disconnected",
      });
    });

    console.log("✅ MetaMask: Event listeners setup completed");
  }

  private async checkConnectionStatus(provider?: any): Promise<boolean> {
    try {
      const targetProvider = provider || this.provider;
      if (!targetProvider) return false;

      console.log("🔄 MetaMask: Checking connection status...");
      console.log(
        "📊 Current state - manuallyDisconnected:",
        this.state.manuallyDisconnected
      );

      // CRITICAL: Don't check if manually disconnected
      if (this.state.manuallyDisconnected) {
        console.log(
          "🚫 MetaMask: Connection check BLOCKED - user manually disconnected"
        );
        return false;
      }

      const accounts = await targetProvider.request({ method: "eth_accounts" });
      const chainId = await targetProvider.request({ method: "eth_chainId" });

      const isCurrentlyConnected = accounts.length > 0;
      console.log(
        "📊 MetaMask: Connection check result - accounts:",
        accounts,
        "isConnected:",
        isCurrentlyConnected
      );

      // Don't auto-reconnect if user manually disconnected
      if (this.state.manuallyDisconnected && isCurrentlyConnected) {
        console.log(
          "🚫 MetaMask: Ignoring connection check - user manually disconnected"
        );
        return false;
      }

      this.setState({
        isConnected: isCurrentlyConnected,
        account: isCurrentlyConnected ? accounts[0] : null,
        chainId: isCurrentlyConnected ? chainId : null,
        connectionStatus: isCurrentlyConnected ? "connected" : "disconnected",
        error: null,
        manuallyDisconnected: isCurrentlyConnected
          ? false
          : this.state.manuallyDisconnected,
      });

      return isCurrentlyConnected;
    } catch (error) {
      console.log("❌ MetaMask: Connection check failed:", error);
      return false;
    }
  }

  private startPeriodicCheck(): void {
    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval);
    }

    console.log("🔄 MetaMask: Starting periodic connection check");

    this.connectionCheckInterval = setInterval(() => {
      console.log("🔄 MetaMask: Periodic check triggered");
      console.log("📊 MetaMask: Current state:", this.state);

      if (
        this.provider &&
        this.state.isConnected &&
        !this.state.manuallyDisconnected
      ) {
        console.log("✅ MetaMask: Running connection check");
        this.checkConnectionStatus();
      } else {
        console.log("🚫 MetaMask: Skipping connection check because:", {
          hasProvider: !!this.provider,
          isConnected: this.state.isConnected,
          manuallyDisconnected: this.state.manuallyDisconnected,
        });
      }
    }, 10000); // Check every 10 seconds
  }

  private stopPeriodicCheck(): void {
    if (this.connectionCheckInterval) {
      console.log("🔄 MetaMask: Stopping periodic connection check");
      clearInterval(this.connectionCheckInterval);
      this.connectionCheckInterval = null;
      console.log("✅ MetaMask: Periodic connection check stopped");
    } else {
      console.log("ℹ️ MetaMask: No periodic check to stop");
    }
  }

  // Attempt reconnect (only if not manually disconnected)
  async attemptReconnect(): Promise<boolean> {
    if (this.state.manuallyDisconnected) {
      console.log(
        "🚫 MetaMask: Reconnect blocked - user manually disconnected"
      );
      return false;
    }

    if (this.reconnectAttempts >= this.config.maxReconnectAttempts!) {
      this.setState({
        error: "Max reconnection attempts reached. Please refresh the page.",
        connectionStatus: "disconnected",
      });
      return false;
    }

    this.reconnectAttempts += 1;
    this.setState({
      connectionStatus: "reconnecting",
      error: `Reconnecting... Attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts}`,
    });

    try {
      const success = await this.connect();
      if (success) {
        this.reconnectAttempts = 0;
        return true;
      } else {
        // Schedule next reconnection attempt
        this.reconnectTimeout = setTimeout(() => {
          if (!this.state.manuallyDisconnected) {
            this.attemptReconnect();
          }
        }, this.config.reconnectDelay! * Math.pow(2, this.reconnectAttempts - 1)); // Exponential backoff

        return false;
      }
    } catch (error) {
      // Schedule next reconnection attempt
      this.reconnectTimeout = setTimeout(() => {
        if (!this.state.manuallyDisconnected) {
          this.attemptReconnect();
        }
      }, this.config.reconnectDelay! * Math.pow(2, this.reconnectAttempts - 1));

      return false;
    }
  }

  // Reset manual disconnect flag
  resetManualDisconnect(): void {
    console.log("🔄 MetaMask: Resetting manuallyDisconnected flag");
    this.setState({ manuallyDisconnected: false });
  }

  // Cleanup
  destroy(): void {
    this.stopPeriodicCheck();

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.provider) {
      this.provider.removeAllListeners();
    }

    super.destroy();
  }
}
