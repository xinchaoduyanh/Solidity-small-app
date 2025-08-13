import { EventEmitter } from "events";

export interface WalletState {
  isConnected: boolean;
  account: string | null;
  chainId: string | null;
  isConnecting: boolean;
  error: string | null;
  connectionStatus:
    | "disconnected"
    | "connecting"
    | "connected"
    | "reconnecting";
  manuallyDisconnected: boolean;
  provider: any | null;
  isDetected: boolean;
}

export interface WalletEvents {
  stateChanged: (state: WalletState) => void;
  connected: (account: string, chainId: string) => void;
  disconnected: () => void;
  error: (error: string) => void;
  chainChanged: (chainId: string) => void;
}

export class WalletManager extends EventEmitter {
  private state: WalletState;
  private connectionCheckInterval: NodeJS.Timeout | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 3;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor() {
    super();
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

  // Get current state
  getState(): WalletState {
    return { ...this.state };
  }

  // Update state and emit event
  private setState(updates: Partial<WalletState>): void {
    const oldState = { ...this.state };
    this.state = { ...this.state, ...updates };

    // Emit state changed event
    this.emit("stateChanged", this.state);

    // Emit specific events based on changes
    if (
      updates.isConnected !== undefined &&
      updates.isConnected !== oldState.isConnected
    ) {
      if (updates.isConnected) {
        this.emit("connected", this.state.account!, this.state.chainId!);
      } else {
        this.emit("disconnected");
      }
    }

    if (updates.error !== undefined && updates.error !== oldState.error) {
      this.emit("error", updates.error);
    }

    if (updates.chainId !== undefined && updates.chainId !== oldState.chainId) {
      this.emit("chainChanged", updates.chainId);
    }
  }

  // Detect MetaMask provider
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

  // Set up event listeners
  private setupEventListeners(provider: any): void {
    // Remove existing listeners if any
    provider.removeAllListeners();

    // Accounts changed
    provider.on("accountsChanged", (accounts: string[]) => {
      console.log("🔄 Accounts changed event:", accounts);

      if (this.state.manuallyDisconnected) {
        console.log("🚫 Ignoring accountsChanged - user manually disconnected");
        return;
      }

      if (accounts.length === 0) {
        this.setState({
          isConnected: false,
          account: null,
          connectionStatus: "disconnected",
          error: "Wallet disconnected",
        });
      } else {
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
      console.log("🔄 Chain changed event:", chainId);
      this.setState({ chainId });
    });

    // Connect event
    provider.on("connect", () => {
      console.log("🔄 Connect event triggered");

      if (this.state.manuallyDisconnected) {
        console.log("🚫 Ignoring connect event - user manually disconnected");
        return;
      }

      this.setState({
        connectionStatus: "connected",
        error: null,
        manuallyDisconnected: false,
      });
    });

    // Disconnect event
    provider.on("disconnect", () => {
      console.log("🔄 Disconnect event triggered");

      if (this.state.manuallyDisconnected) {
        console.log(
          "🚫 Ignoring disconnect event - user manually disconnected"
        );
        return;
      }

      this.setState({
        isConnected: false,
        account: null,
        connectionStatus: "disconnected",
        error: "Wallet disconnected",
      });
    });
  }

  // Check connection status
  async checkConnectionStatus(provider?: any): Promise<boolean> {
    try {
      const targetProvider = provider || this.state.provider;
      if (!targetProvider) return false;

      console.log("🔄 Checking connection status...");
      console.log(
        "📊 Current state - manuallyDisconnected:",
        this.state.manuallyDisconnected
      );

      const accounts = await targetProvider.request({ method: "eth_accounts" });
      const chainId = await targetProvider.request({ method: "eth_chainId" });

      const isCurrentlyConnected = accounts.length > 0;
      console.log(
        "📊 Connection check result - accounts:",
        accounts,
        "isConnected:",
        isCurrentlyConnected
      );

      // Don't auto-reconnect if user manually disconnected
      if (this.state.manuallyDisconnected && isCurrentlyConnected) {
        console.log(
          "🚫 Ignoring connection check - user manually disconnected"
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
      console.log("❌ Connection check failed:", error);
      return false;
    }
  }

  // Connect wallet
  async connect(): Promise<boolean> {
    try {
      if (!this.state.provider) {
        const detected = await this.detectProvider();
        if (!detected) return false;
      }

      console.log("🔄 User actively trying to connect...");
      console.log(
        "📊 Current state - manuallyDisconnected:",
        this.state.manuallyDisconnected
      );

      // Reset manual disconnect flag when user actively tries to connect
      this.setState({
        manuallyDisconnected: false,
        isConnecting: true,
        error: null,
        connectionStatus: "connecting",
      });

      const accounts = await this.state.provider!.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const chainId = await this.state.provider!.request({
          method: "eth_chainId",
        });

        console.log(
          "✅ Connection successful - accounts:",
          accounts,
          "chainId:",
          chainId
        );

        this.setState({
          isConnected: true,
          account: accounts[0],
          chainId,
          isConnecting: false,
          error: null,
          connectionStatus: "connected",
          manuallyDisconnected: false,
        });

        // Reset reconnect attempts
        this.reconnectAttempts = 0;

        // Start periodic connection check
        this.startPeriodicCheck();

        return true;
      } else {
        throw new Error("No accounts found");
      }
    } catch (error: any) {
      console.log("❌ Connection failed:", error);
      this.setState({
        isConnecting: false,
        error: error.message || "Failed to connect wallet",
        connectionStatus: "disconnected",
      });
      return false;
    }
  }

  // Disconnect wallet
  async disconnect(): Promise<void> {
    try {
      console.log("🔄 Starting disconnect process...");

      // Stop periodic connection check
      this.stopPeriodicCheck();

      // Clear reconnect timeout
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }

      // Reset reconnect attempts
      this.reconnectAttempts = 0;

      // Clear provider and state
      if (this.state.provider) {
        // Remove all event listeners
        this.state.provider.removeAllListeners();
      }

      // Update state to disconnected
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

      console.log("✅ Disconnect completed successfully");
    } catch (error) {
      console.log("❌ Disconnect error:", error);
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

  // Start periodic connection check
  private startPeriodicCheck(): void {
    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval);
    }

    this.connectionCheckInterval = setInterval(() => {
      if (
        this.state.provider &&
        this.state.isConnected &&
        !this.state.manuallyDisconnected
      ) {
        this.checkConnectionStatus();
      }
    }, 10000); // Check every 10 seconds
  }

  // Stop periodic connection check
  private stopPeriodicCheck(): void {
    if (this.connectionCheckInterval) {
      clearInterval(this.connectionCheckInterval);
      this.connectionCheckInterval = null;
    }
  }

  // Attempt reconnect (only if not manually disconnected)
  async attemptReconnect(): Promise<boolean> {
    if (this.state.manuallyDisconnected) {
      console.log("🚫 Reconnect blocked - user manually disconnected");
      return false;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.setState({
        error: "Max reconnection attempts reached. Please refresh the page.",
        connectionStatus: "disconnected",
      });
      return false;
    }

    this.reconnectAttempts += 1;
    this.setState({
      connectionStatus: "reconnecting",
      error: `Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`,
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
        }, 2000 * this.reconnectAttempts); // Exponential backoff

        return false;
      }
    } catch (error) {
      // Schedule next reconnection attempt
      this.reconnectTimeout = setTimeout(() => {
        if (!this.state.manuallyDisconnected) {
          this.attemptReconnect();
        }
      }, 2000 * this.reconnectAttempts);

      return false;
    }
  }

  // Reset manual disconnect flag
  resetManualDisconnect(): void {
    console.log("🔄 Resetting manual disconnect flag");
    this.setState({ manuallyDisconnected: false });
  }

  // Switch network
  async switchNetwork(chainId: string): Promise<boolean> {
    try {
      if (!this.state.provider) return false;

      await this.state.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });

      return true;
    } catch (error) {
      console.log("❌ Failed to switch network:", error);
      return false;
    }
  }

  // Cleanup
  destroy(): void {
    this.stopPeriodicCheck();

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.state.provider) {
      this.state.provider.removeAllListeners();
    }

    this.removeAllListeners();
  }
}
