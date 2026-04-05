"use client";

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";

interface ToastData {
  id: number;
  message: string;
  type: "success" | "error";
}

interface CartToastContextValue {
  showToast: (message: string, type?: "success" | "error") => void;
}

const CartToastContext = createContext<CartToastContextValue | null>(null);

export function useCartToast() {
  const ctx = useContext(CartToastContext);
  if (!ctx) throw new Error("useCartToast must be used within CartToastProvider");
  return ctx;
}

let toastId = 0;

export function CartToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  return (
    <CartToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-28 right-4 z-[1100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto animate-[slideInRight_0.3s_ease-out]"
            style={{
              background: "rgba(12, 12, 16, 0.95)",
              backdropFilter: "blur(20px)",
              border: `1px solid ${toast.type === "success" ? "rgba(236,72,153,0.3)" : "rgba(239,68,68,0.3)"}`,
              borderRadius: "12px",
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: toast.type === "success"
                ? "0 4px 20px rgba(236,72,153,0.15)"
                : "0 4px 20px rgba(239,68,68,0.15)",
            }}
          >
            {toast.type === "success" ? (
              <svg className="w-4 h-4 text-pink-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="text-sm text-white/80 font-medium" style={{ fontFamily: "var(--font-body)" }}>
              {toast.message}
            </span>
          </div>
        ))}
      </div>
    </CartToastContext.Provider>
  );
}
