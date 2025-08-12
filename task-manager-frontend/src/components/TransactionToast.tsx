"use client";

import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/ui/alert";

interface TransactionState {
  hash?: string;
  status: "pending" | "success" | "error";
  message: string;
}

export default function TransactionToast() {
  const [transaction, setTransaction] = useState<TransactionState | null>(null);

  useEffect(() => {
    const handleTransactionUpdate = (event: CustomEvent<TransactionState>) => {
      setTransaction(event.detail);

      if (event.detail.status !== "pending") {
        setTimeout(() => setTransaction(null), 5000);
      }
    };

    window.addEventListener(
      "transaction-update",
      handleTransactionUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        "transaction-update",
        handleTransactionUpdate as EventListener
      );
    };
  }, []);

  if (!transaction) return null;

  const getAlertVariant = () => {
    switch (transaction.status) {
      case "success":
        return "default";
      case "error":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Alert variant={getAlertVariant()}>
        <AlertDescription>
          <div className="space-y-1">
            <p className="font-medium">{transaction.message}</p>
            {transaction.hash && (
              <p className="text-xs opacity-75">
                Tx: {transaction.hash.slice(0, 10)}...
                {transaction.hash.slice(-8)}
              </p>
            )}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
