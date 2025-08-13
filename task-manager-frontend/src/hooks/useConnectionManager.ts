"use client";

import { useEffect, useRef, useCallback } from "react";
import { useWallet } from "@/contexts/WalletContext";

interface ConnectionManagerOptions {
  autoReconnect?: boolean;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
  showNotifications?: boolean;
}

export function useConnectionManager(options: ConnectionManagerOptions = {}) {
  const {
    autoReconnect = true,
    maxReconnectAttempts = 3,
    reconnectDelay = 2000,
    showNotifications = true,
  } = options;

  const {
    isConnected,
    connectionStatus,
    error,
    forceReconnect,
    connectionManager,
  } = useWallet();

  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const lastConnectionStateRef = useRef(connectionStatus);

  // Auto-reconnect logic
  const handleAutoReconnect = useCallback(async () => {
    if (
      !autoReconnect ||
      reconnectAttemptsRef.current >= maxReconnectAttempts
    ) {
      return;
    }

    reconnectAttemptsRef.current += 1;

    if (showNotifications) {
      console.log(
        `🔄 Auto-reconnecting... Attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`
      );
    }

    try {
      await forceReconnect();
    } catch (error) {
      // Schedule next reconnection attempt with exponential backoff
      const delay =
        reconnectDelay * Math.pow(2, reconnectAttemptsRef.current - 1);

      reconnectTimeoutRef.current = setTimeout(() => {
        if (connectionStatus === "disconnected") {
          handleAutoReconnect();
        }
      }, delay);
    }
  }, [
    autoReconnect,
    maxReconnectAttempts,
    reconnectDelay,
    forceReconnect,
    connectionStatus,
    showNotifications,
  ]);

  // Handle connection state changes
  useEffect(() => {
    const previousStatus = lastConnectionStateRef.current;
    const currentStatus = connectionStatus;

    // Connection lost
    if (previousStatus === "connected" && currentStatus === "disconnected") {
      if (showNotifications) {
        console.log("🔴 Wallet disconnected");
      }

      // Reset reconnect attempts when manually disconnected
      reconnectAttemptsRef.current = 0;

      // Start auto-reconnect if enabled
      if (autoReconnect) {
        handleAutoReconnect();
      }
    }

    // Connection restored
    if (previousStatus === "disconnected" && currentStatus === "connected") {
      if (showNotifications) {
        console.log("🟢 Wallet reconnected successfully!");
      }

      // Reset reconnect attempts on successful connection
      reconnectAttemptsRef.current = 0;

      // Clear any pending reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    }

    // Reconnecting
    if (currentStatus === "reconnecting") {
      if (showNotifications) {
        console.log("🟡 Attempting to reconnect...");
      }
    }

    // Update last known state
    lastConnectionStateRef.current = currentStatus;
  }, [connectionStatus, autoReconnect, handleAutoReconnect, showNotifications]);

  // Handle errors
  useEffect(() => {
    if (error && showNotifications) {
      console.log("❌ Connection error:", error);
    }
  }, [error, showNotifications]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  // Manual connection management functions
  const refreshConnection = useCallback(async () => {
    await forceReconnect();
    if (showNotifications) {
      console.log("🔄 Connection status refreshed");
    }
  }, [forceReconnect, showNotifications]);

  return {
    // Connection state
    isConnected,
    connectionStatus,
    error,

    // Reconnection info
    reconnectAttempts: reconnectAttemptsRef.current,
    maxReconnectAttempts,
    isReconnecting: connectionStatus === "reconnecting",

    // Actions
    forceReconnect,
    refreshConnection,

    // Auto-reconnect settings
    autoReconnect,
    reconnectDelay,
  };
}
