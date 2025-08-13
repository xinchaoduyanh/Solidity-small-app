export interface WalletAdapter {
  // Core wallet operations
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  getAccount(): string | null;
  getChainId(): string | null;
  getProvider(): any | null;

  // Network operations
  switchNetwork(chainId: string): Promise<boolean>;
  getNetworkId(): Promise<number>;

  // State management
  getState(): any;
  onStateChange(callback: (state: any) => void): () => void;

  // Event handling
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;

  // Cleanup
  destroy(): void;
}

export interface WalletAdapterConfig {
  autoConnect?: boolean;
  autoReconnect?: boolean;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
  networkId?: number;
  chainId?: string;
}

export abstract class BaseWalletAdapter implements WalletAdapter {
  protected config: WalletAdapterConfig;
  protected state: any = {};
  protected eventListeners: Map<string, Function[]> = new Map();

  constructor(config: WalletAdapterConfig = {}) {
    this.config = {
      autoConnect: false,
      autoReconnect: true,
      maxReconnectAttempts: 3,
      reconnectDelay: 2000,
      ...config,
    };
  }

  // Abstract methods that must be implemented by concrete adapters
  abstract connect(): Promise<boolean>;
  abstract disconnect(): Promise<void>;
  abstract isConnected(): boolean;
  abstract getAccount(): string | null;
  abstract getChainId(): string | null;
  abstract getProvider(): any | null;
  abstract switchNetwork(chainId: string): Promise<boolean>;
  abstract getNetworkId(): Promise<number>;

  // Default state management implementation
  getState(): any {
    return { ...this.state };
  }

  protected setState(updates: any): void {
    const oldState = { ...this.state };
    this.state = { ...this.state, ...updates };

    // Thêm log này để debug
    console.log(
      " BaseWalletAdapter: State updated, about to emit stateChanged event"
    );
    console.log(" BaseWalletAdapter: New state:", this.state);

    // Emit state change event
    this.emit("stateChanged", this.state);

    // Thêm log này để debug
    console.log(" BaseWalletAdapter: stateChanged event emitted");

    // Emit specific events based on changes
    if (
      updates.isConnected !== undefined &&
      updates.isConnected !== oldState.isConnected
    ) {
      if (updates.isConnected) {
        console.log(" BaseWalletAdapter: Emitting connected event");
        this.emit("connected", this.state.account, this.state.chainId);
      } else {
        console.log(" BaseWalletAdapter: Emitting disconnected event");
        this.emit("disconnected");
      }
    }

    if (updates.error !== undefined && updates.error !== oldState.error) {
      console.log(" BaseWalletAdapter: Emitting error event");
      this.emit("error", updates.error);
    }

    if (updates.chainId !== undefined && updates.chainId !== oldState.chainId) {
      console.log(" BaseWalletAdapter: Emitting chainChanged event");
      this.emit("chainChanged", updates.chainId);
    }
  }

  // Event handling implementation
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  protected emit(event: string, ...args: any[]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // State change subscription
  onStateChange(callback: (state: any) => void): () => void {
    this.on("stateChanged", callback);
    return () => this.off("stateChanged", callback);
  }

  // Cleanup
  destroy(): void {
    this.eventListeners.clear();
  }

  // Utility methods
  protected isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  protected isValidChainId(chainId: string): boolean {
    return /^0x[a-fA-F0-9]+$/.test(chainId);
  }

  protected formatAddress(address: string): string {
    if (!this.isValidAddress(address)) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  protected parseChainId(chainId: string): number {
    if (this.isValidChainId(chainId)) {
      return parseInt(chainId, 16);
    }
    return 0;
  }
}
