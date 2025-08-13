"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/ui/button";
import {
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Wifi,
  WifiOff,
} from "lucide-react";

interface ConnectionStatusProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function ConnectionStatus({
  onConnect,
  onDisconnect,
}: ConnectionStatusProps) {
  const {
    isConnected,
    account,
    connectionStatus,
    error,
    connect,
    disconnect,
    connectionManager,
  } = useWallet();

  const isConnecting = connectionStatus === "connecting";
  const attemptReconnect = () => connectionManager?.forceReconnect();
  const checkConnectionStatus = () => connectionManager?.getState();

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<
    "success" | "error" | "info" | "warning"
  >("info");
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Use ref to track timeout and prevent memory leaks
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showNotificationMessage = useCallback(
    (message: string, type: "success" | "error" | "info" | "warning") => {
      setNotificationMessage(message);
      setNotificationType(type);
      setShowNotification(true);

      // Clear existing timeout before setting new one
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Auto-hide after 5 seconds with proper cleanup
      timeoutRef.current = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    },
    []
  );

  // Show notifications for status changes
  useEffect(() => {
    if (connectionStatus === "connected" && isConnected) {
      showNotificationMessage("Wallet connected successfully!", "success");
    } else if (connectionStatus === "disconnected" && !isConnected) {
      showNotificationMessage("Wallet disconnected", "warning");
    } else if (connectionStatus === "reconnecting") {
      showNotificationMessage("Attempting to reconnect...", "info");
    }
  }, [connectionStatus, isConnected, showNotificationMessage]);

  // Show error notifications
  useEffect(() => {
    if (error) {
      showNotificationMessage(error, "error");
    }
  }, [error, showNotificationMessage]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleConnect = async () => {
    if (onConnect) {
      onConnect();
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      if (onDisconnect) {
        await onDisconnect();
      }
    } catch (error) {
      console.error("Disconnect failed:", error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleRefresh = async () => {
    checkConnectionStatus();
    showNotificationMessage("Connection status refreshed", "info");
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "connecting":
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      case "reconnecting":
        return <RefreshCw className="w-5 h-5 text-orange-500 animate-spin" />;
      case "disconnected":
        return <WifiOff className="w-5 h-5 text-red-500" />;
      default:
        return <Wifi className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400";
      case "connecting":
        return "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400";
      case "reconnecting":
        return "bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400";
      case "disconnected":
        return "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-400";
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Connected";
      case "connecting":
        return "Connecting...";
      case "reconnecting":
        return "Reconnecting...";
      case "disconnected":
        return "Disconnected";
      default:
        return "Unknown";
    }
  };

  return (
    <>
      {/* Connection Status Bar */}
      <div
        className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
          showNotification ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm ${getStatusColor()}`}
        >
          {getStatusIcon()}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{notificationMessage}</p>
            <p className="text-xs opacity-75">{getStatusText()}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNotification(false)}
            className="h-6 w-6 p-0 hover:bg-black/10 dark:hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Connection Status Display */}
      <div className="mb-6 p-4 rounded-xl border bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <h3 className="font-medium text-slate-900 dark:text-slate-100">
                Wallet Status: {getStatusText()}
              </h3>
              {account && (
                <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isConnected ? (
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wifi className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </>
                )}
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  size="sm"
                  className="border-slate-300 dark:border-slate-600"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button
                  onClick={handleDisconnect}
                  variant="outline"
                  size="sm"
                  disabled={isDisconnecting}
                  className="border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  {isDisconnecting ? "Disconnecting..." : "Disconnect"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Connection Actions */}
        {connectionStatus === "disconnected" && error && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700 dark:text-red-300">
                {error}
              </span>
            </div>
            <div className="mt-2 flex space-x-2">
              <Button
                onClick={attemptReconnect}
                size="sm"
                variant="outline"
                className="border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Connection
              </Button>
              <Button
                onClick={() => window.location.reload()}
                size="sm"
                variant="outline"
                className="border-slate-300 dark:border-slate-600"
              >
                Refresh Page
              </Button>
            </div>
          </div>
        )}

        {/* Connection Tips */}
        {!isConnected && (
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                Connection Tips:
              </span>
            </div>
            <ul className="mt-2 text-xs text-blue-600 dark:text-blue-400 space-y-1">
              <li>• Make sure MetaMask is installed and unlocked</li>
              <li>• Check if you're on the correct network</li>
              <li>• Try refreshing the page if connection fails</li>
              <li>• Ensure MetaMask has permission to connect</li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
