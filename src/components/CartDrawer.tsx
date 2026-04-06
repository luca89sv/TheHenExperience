"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/i18n";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateGuests, getTotal } =
    useCart();
  const { t } = useLanguage();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setIsOpen]);

  const total = getTotal();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[950] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 z-[960] h-full w-full max-w-md flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background: "#0c0c10",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h2
            className="text-lg font-semibold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t('cart.title')}{" "}
            <span className="text-white/40 text-base font-normal">
              ({items.length})
            </span>
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 transition-all duration-300"
            aria-label="Zamknij koszyk"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <svg
              className="w-16 h-16 text-white/15"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
            <p
              className="text-white/30 text-sm"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {t('cart.empty')}
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 cart-scroll">
            {items.map((item) => {
              const subtotal =
                item.product.priceType === "person"
                  ? item.product.price * item.guests
                  : item.product.price;

              return (
                <div
                  key={item.product.id}
                  className="rounded-2xl p-4"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#0c0c10]">
                      {item.product.images[0] && (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs text-white/30 uppercase tracking-wider mb-0.5"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {item.product.category}
                      </p>
                      <h3
                        className="text-sm font-semibold text-white leading-snug truncate"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-pink-400 mt-0.5">
                        {item.product.price} PLN
                        {item.product.priceType === "person" ? t('price.perPerson') : ""}
                      </p>
                    </div>
                  </div>

                  {/* Guest stepper for per-person items */}
                  {item.product.priceType === "person" && (
                    <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <span
                        className="text-xs text-white/45"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {t('cart.guests')}
                      </span>
                      <div className="flex items-center gap-0">
                        <button
                          onClick={() =>
                            updateGuests(item.product.id, item.guests - 1)
                          }
                          disabled={item.guests <= 1}
                          className="w-8 h-8 flex items-center justify-center rounded-l-xl border border-white/[0.08] bg-transparent text-white/60 hover:text-white hover:border-pink-500/40 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                          </svg>
                        </button>
                        <span
                          className="w-10 h-8 flex items-center justify-center border-y border-white/[0.08] text-sm text-white bg-transparent"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {item.guests}
                        </span>
                        <button
                          onClick={() =>
                            updateGuests(item.product.id, item.guests + 1)
                          }
                          disabled={item.guests >= 99}
                          className="w-8 h-8 flex items-center justify-center rounded-r-xl border border-white/[0.08] bg-transparent text-white/60 hover:text-white hover:border-pink-500/40 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m-7-7h14" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Subtotal + remove */}
                  <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-xs text-white/30 hover:text-pink-400 transition-colors duration-300 flex items-center gap-1"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                      {t('cart.remove')}
                    </button>
                    <span className="text-sm font-semibold text-white">
                      {subtotal} PLN
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="shrink-0 px-6 py-5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <span
                className="text-sm text-white/45"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {t('cart.total')}
              </span>
              <span
                className="text-xl font-bold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {total} PLN
              </span>
            </div>
            <a
              href="/zamowienie"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #be185d, #ec4899)",
                fontFamily: "var(--font-body)",
                letterSpacing: "0.02em",
              }}
            >
              {t('cart.checkout')}
            </a>
          </div>
        )}
      </div>

      {/* Custom scrollbar style */}
      <style jsx global>{`
        .cart-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .cart-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .cart-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 4px;
        }
        .cart-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </>
  );
}
