"use client";

import { useState, useEffect } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

export default function TransactionToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  };

  // Example: Listen for transaction events (you can customize this)
  useEffect(() => {
    const handleTransactionEvent = (event: CustomEvent) => {
      addToast({
        message: event.detail.message,
        type: event.detail.type || "info",
        duration: event.detail.duration || 5000,
      });
    };

    window.addEventListener("transaction-toast" as any, handleTransactionEvent);
    return () => {
      window.removeEventListener(
        "transaction-toast" as any,
        handleTransactionEvent
      );
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 max-w-sm">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className={`w-full bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/30 p-5 transform transition-all duration-500 ease-out animate-in slide-in-from-right-full ${
            toast.type === "success"
              ? "border-l-4 border-l-emerald-500 shadow-emerald-500/20"
              : toast.type === "error"
              ? "border-l-4 border-l-red-500 shadow-red-500/20"
              : toast.type === "warning"
              ? "border-l-4 border-l-amber-500 shadow-amber-500/20"
              : "border-l-4 border-l-blue-500 shadow-blue-500/20"
          }`}
          style={{
            animationDelay: `${index * 100}ms`,
            animationFillMode: "both",
          }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === "success" && (
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
              {toast.type === "error" && (
                <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              )}
              {toast.type === "warning" && (
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
              )}
              {toast.type === "info" && (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => removeToast(toast.id)}
                className="inline-flex items-center justify-center w-7 h-7 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/*  Thêm progress bar để hiển thị thời gian còn lại */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-100 ease-linear ${
                toast.type === "success"
                  ? "bg-emerald-500"
                  : toast.type === "error"
                  ? "bg-red-500"
                  : toast.type === "warning"
                  ? "bg-amber-500"
                  : "bg-blue-500"
              }`}
              style={{
                animation: `shrink ${toast.duration || 5000}ms linear forwards`,
              }}
            />
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
