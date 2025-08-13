import { EventEmitter } from "events";
import { WalletAdapter } from "./WalletAdapter";
import { MetaMaskAdapter } from "./adapters/MetaMaskAdapter";

export interface ConnectionManagerConfig {
  autoConnect?: boolean;
  autoReconnect?: boolean;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
  showNotifications?: boolean;
}

export interface ConnectionState {
  isConnected: boolean;
  account: string | null;
  chainId: string | null;
  connectionStatus:
    | "disconnected"
    | "connecting"
    | "connected"
    | "reconnecting";
  error: string | null;
  walletType: string | null;
  manuallyDisconnected: boolean; // ADD THIS FIELD
}

export class ConnectionManager extends EventEmitter {
  private walletAdapter: WalletAdapter | null = null;
  private config: ConnectionManagerConfig;
  private state: ConnectionState;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private reconnectAttempts: number = 0;

  constructor(config: ConnectionManagerConfig = {}) {
    super();

    console.log(
      "🔄 ConnectionManager: Constructor called, EventEmitter methods available:",
      {
        hasEmit: typeof this.emit === "function",
        hasOn: typeof this.on === "function",
        hasOff: typeof this.off === "function",
        hasRemoveAllListeners: typeof this.removeAllListeners === "function",
      }
    );

    this.config = {
      autoConnect: false,
      autoReconnect: false, // TẮT HOÀN TOÀN AUTO-RECONNECT
      maxReconnectAttempts: 0, // SET VỀ 0
      reconnectDelay: 0,
      showNotifications: true,
      ...config,
    };

    console.log("🔄 ConnectionManager: Config set to:", this.config);

    this.state = {
      isConnected: false,
      account: null,
      chainId: null,
      connectionStatus: "disconnected",
      error: null,
      walletType: null,
      manuallyDisconnected: false, // ADD THIS FIELD
    };
  }

  // Initialize wallet adapter
  async initializeWallet(
    walletType: "metamask" | "walletconnect" | "coinbase" = "metamask"
  ): Promise<boolean> {
    try {
      console.log(`🔄 ConnectionManager: Initializing ${walletType} wallet...`);

      // Clean up existing adapter
      if (this.walletAdapter) {
        this.walletAdapter.destroy();
      }

      // Create new adapter based on type
      switch (walletType) {
        case "metamask":
          this.walletAdapter = new MetaMaskAdapter({
            autoConnect: this.config.autoConnect,
            autoReconnect: this.config.autoReconnect,
            maxReconnectAttempts: this.config.maxReconnectAttempts,
            reconnectDelay: this.config.reconnectDelay,
          });
          break;

        case "walletconnect":
          // TODO: Implement WalletConnect adapter
          throw new Error("WalletConnect adapter not implemented yet");

        case "coinbase":
          // TODO: Implement Coinbase adapter
          throw new Error("Coinbase adapter not implemented yet");

        default:
          throw new Error(`Unsupported wallet type: ${walletType}`);
      }

      // Set up event listeners
      this.setupWalletEventListeners();

      // Update state
      this.setState({
        walletType,
        error: null,
      });

      // Auto-connect if enabled
      if (this.config.autoConnect) {
        await this.connect();
      }

      console.log(
        `✅ ConnectionManager: ${walletType} wallet initialized successfully`
      );
      return true;
    } catch (error: any) {
      console.error(
        `❌ ConnectionManager: Failed to initialize ${walletType} wallet:`,
        error
      );
      this.setState({
        error: `Failed to initialize ${walletType} wallet: ${error.message}`,
        walletType: null,
      });
      return false;
    }
  }

  // Set up wallet event listeners
  private setupWalletEventListeners(): void {
    if (!this.walletAdapter) return;

    // State change events
    this.walletAdapter.onStateChange((state: any) => {
      console.log(
        "🟢 ConnectionManager: Received stateChanged event from adapter:",
        state
      );

      // CRITICAL: Don't update state if manually disconnected
      if (state.manuallyDisconnected) {
        console.log(
          "🟢 ConnectionManager: BLOCKING state update - user manually disconnected"
        );
        return;
      }

      this.setState({
        isConnected: state.isConnected,
        account: state.account,
        chainId: state.chainId,
        connectionStatus: state.connectionStatus,
        error: state.error,
      });

      console.log(
        "🟢 ConnectionManager: State updated, about to emit stateChanged event"
      );
    });

    // Specific events
    this.walletAdapter.on("connected", (account: string, chainId: string) => {
      console.log(
        "�� ConnectionManager: Received connected event from adapter:",
        account,
        chainId
      );

      // CRITICAL: Don't process connect if manually disconnected
      if (this.state.manuallyDisconnected) {
        console.log(
          "🟢 ConnectionManager: BLOCKING connect event - user manually disconnected"
        );
        return;
      }

      console.log("🟢 ConnectionManager: Wallet connected:", account, chainId);
      this.emit("connected", account, chainId);

      // Reset reconnect attempts on successful connection
      this.reconnectAttempts = 0;

      // Clear any pending reconnect timeout
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    });

    this.walletAdapter.on("disconnected", () => {
      console.log("🔴 ConnectionManager: Wallet disconnected");

      // CRITICAL: Don't start auto-reconnect if manually disconnected
      if (this.state.manuallyDisconnected) {
        console.log(
          "🔴 ConnectionManager: BLOCKING auto-reconnect - user manually disconnected"
        );
        return;
      }

      this.emit("disconnected");

      // Start auto-reconnect if enabled
      if (this.config.autoReconnect) {
        this.handleAutoReconnect();
      }
    });

    this.walletAdapter.on("error", (error: string) => {
      console.log("❌ ConnectionManager: Wallet error:", error);
      this.emit("error", error);
    });

    this.walletAdapter.on("chainChanged", (chainId: string) => {
      console.log("🔄 ConnectionManager: Chain changed:", chainId);
      this.emit("chainChanged", chainId);
    });
  }

  // Connect wallet
  async connect(): Promise<boolean> {
    try {
      if (!this.walletAdapter) {
        throw new Error("No wallet adapter initialized");
      }

      console.log(" ConnectionManager: Connect method called");
      console.log(
        " ConnectionManager: Current manuallyDisconnected state:",
        this.state.manuallyDisconnected
      );

      // CRITICAL: Reset manuallyDisconnected flag when user actively tries to connect
      if (this.state.manuallyDisconnected) {
        console.log(
          " ConnectionManager: Resetting manuallyDisconnected flag for user-initiated connect"
        );
        this.setState({
          manuallyDisconnected: false,
        });
      }

      console.log(" ConnectionManager: Connecting wallet...");
      this.setState({ connectionStatus: "connecting", error: null });

      const success = await this.walletAdapter.connect();

      if (success) {
        console.log("✅ ConnectionManager: Wallet connected successfully");
        return true;
      } else {
        throw new Error("Connection failed");
      }
    } catch (error: any) {
      console.error("❌ ConnectionManager: Connection failed:", error);
      this.setState({
        connectionStatus: "disconnected",
        error: error.message || "Failed to connect wallet",
      });
      return false;
    }
  }

  // Disconnect wallet
  async disconnect(): Promise<void> {
    try {
      if (!this.walletAdapter) {
        console.log("⚠️ ConnectionManager: No wallet adapter to disconnect");
        return;
      }

      console.log("🔄 ConnectionManager: Disconnecting wallet...");
      console.log(
        "🔄 ConnectionManager: Current state before disconnect:",
        this.state
      );

      // Clear any pending reconnect timeout
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
        console.log("✅ ConnectionManager: Reconnect timeout cleared");
      }

      // Reset reconnect attempts
      this.reconnectAttempts = 0;
      console.log("✅ ConnectionManager: Reconnect attempts reset");

      // Disconnect wallet
      await this.walletAdapter.disconnect();
      console.log("✅ ConnectionManager: Wallet adapter disconnected");

      // CRITICAL: Set manuallyDisconnected flag
      this.setState({
        isConnected: false,
        account: null,
        chainId: null,
        connectionStatus: "disconnected",
        error: null,
        manuallyDisconnected: true, // ADD THIS FLAG
      });

      console.log("✅ ConnectionManager: Wallet disconnected successfully");
    } catch (error) {
      console.error("❌ ConnectionManager: Disconnect failed:", error);
      // Even if disconnect fails, update the state
      this.setState({
        isConnected: false,
        account: null,
        chainId: null,
        connectionStatus: "disconnected",
        error: null,
        manuallyDisconnected: true, // ADD THIS FLAG
      });
    }
  }

  // Switch network
  async switchNetwork(chainId: string): Promise<boolean> {
    try {
      if (!this.walletAdapter) {
        throw new Error("No wallet adapter initialized");
      }

      console.log(`🔄 ConnectionManager: Switching to network ${chainId}...`);

      const success = await this.walletAdapter.switchNetwork(chainId);

      if (success) {
        console.log(
          `✅ ConnectionManager: Successfully switched to network ${chainId}`
        );
        return true;
      } else {
        throw new Error("Network switch failed");
      }
    } catch (error: any) {
      console.error("❌ ConnectionManager: Network switch failed:", error);
      this.setState({ error: `Failed to switch network: ${error.message}` });
      return false;
    }
  }

  // Handle auto-reconnect
  private handleAutoReconnect(): void {
    // CRITICAL: Don't auto-reconnect if manually disconnected
    if (this.state.manuallyDisconnected) {
      console.log(
        "🚫 ConnectionManager: BLOCKING auto-reconnect - user manually disconnected"
      );
      return;
    }

    if (!this.config.autoReconnect || !this.walletAdapter) {
      return;
    }

    if (this.reconnectAttempts >= this.config.maxReconnectAttempts!) {
      console.log("🚫 ConnectionManager: Max reconnection attempts reached");
      this.setState({
        error: "Max reconnection attempts reached. Please refresh the page.",
        connectionStatus: "disconnected",
      });
      return;
    }

    this.reconnectAttempts += 1;
    console.log(
      `🔄 ConnectionManager: Auto-reconnecting... Attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts}`
    );

    // Schedule reconnection with exponential backoff
    const delay =
      this.config.reconnectDelay! * Math.pow(2, this.reconnectAttempts - 1);

    this.reconnectTimeout = setTimeout(async () => {
      try {
        await this.connect();
      } catch (error) {
        console.error("❌ ConnectionManager: Auto-reconnect failed:", error);
        // Try again if not at max attempts
        if (this.reconnectAttempts < this.config.maxReconnectAttempts!) {
          this.handleAutoReconnect();
        }
      }
    }, delay);
  }

  // Force reconnect
  async forceReconnect(): Promise<boolean> {
    console.log("🔄 ConnectionManager: Force reconnecting...");

    // Clear any pending reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    // Reset reconnect attempts
    this.reconnectAttempts = 0;

    // Attempt connection
    return await this.connect();
  }

  // Cancel auto-reconnect
  cancelReconnect(): void {
    console.log("🚫 ConnectionManager: Cancelling auto-reconnect...");

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.reconnectAttempts = 0;
  }

  // Get current state
  getState(): ConnectionState {
    return { ...this.state };
  }

  // Get wallet adapter
  getWalletAdapter(): WalletAdapter | null {
    return this.walletAdapter;
  }

  // Check if wallet is connected
  isConnected(): boolean {
    return this.state.isConnected;
  }

  // Get account
  getAccount(): string | null {
    return this.state.account;
  }

  // Get chain ID
  getChainId(): string | null {
    return this.state.chainId;
  }

  // Get connection status
  getConnectionStatus(): string {
    return this.state.connectionStatus;
  }

  // Get error
  getError(): string | null {
    return this.state.error;
  }

  // Get wallet type
  getWalletType(): string | null {
    return this.state.walletType;
  }

  // Update state and emit event
  private setState(updates: Partial<ConnectionState>): void {
    const oldState = { ...this.state };
    this.state = { ...this.state, ...updates };

    console.log(
      "🟢 ConnectionManager: About to emit stateChanged event with state:",
      this.state
    );

    // Emit state changed event
    this.emit("stateChanged", this.state);

    console.log(
      "✅ ConnectionManager: stateChanged event emitted successfully"
    );

    // Emit specific events based on changes
    if (
      updates.isConnected !== undefined &&
      updates.isConnected !== oldState.isConnected
    ) {
      if (updates.isConnected) {
        console.log("🟢 ConnectionManager: About to emit connected event");
        this.emit("connected", this.state.account!, this.state.chainId!);
        console.log("✅ ConnectionManager: connected event emitted");
      } else {
        console.log("🔴 ConnectionManager: About to emit disconnected event");
        this.emit("disconnected");
        console.log("✅ ConnectionManager: disconnected event emitted");
      }
    }

    if (updates.error !== undefined && updates.error !== oldState.error) {
      console.log("❌ ConnectionManager: About to emit error event");
      this.emit("error", updates.error);
      console.log("✅ ConnectionManager: error event emitted");
    }

    if (updates.chainId !== undefined && updates.chainId !== oldState.chainId) {
      console.log("🔄 ConnectionManager: About to emit chainChanged event");
      this.emit("chainChanged", updates.chainId);
      console.log("✅ ConnectionManager: chainChanged event emitted");
    }
  }

  // Reset manual disconnect flag
  resetManualDisconnect(): void {
    console.log("🟢 ConnectionManager: Resetting manuallyDisconnected flag");
    this.setState({
      manuallyDisconnected: false,
    });
  }

  // Add to public API
  getManuallyDisconnected(): boolean {
    return this.state.manuallyDisconnected;
  }

  // Cleanup
  destroy(): void {
    console.log("🧹 ConnectionManager: Cleaning up...");

    // Clear reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    // Destroy wallet adapter
    if (this.walletAdapter) {
      this.walletAdapter.destroy();
    }

    // Remove all event listeners
    this.removeAllListeners();
  }
}
