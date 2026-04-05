"use client";

import { useState, useEffect, useCallback } from "react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  price: number;
  priceType: "person" | "pcs";
}

export default function BookingModal({ isOpen, onClose, productName, price, priceType }: BookingModalProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    guests: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/send-order.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: [{ name: productName, price, priceType, guests: parseInt(form.guests) || 1 }],
          total: priceType === "person" ? price * (parseInt(form.guests) || 1) : price,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      }
    } catch {
      // silently handle
    } finally {
      setSubmitting(false);
    }
  }, [form, productName, price, priceType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10"
        style={{
          background: "linear-gradient(145deg, rgba(12,12,16,0.98) 0%, rgba(20,20,28,0.98) 100%)",
          animation: "modalIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <style>{`
          @keyframes modalIn {
            0% { opacity: 0; transform: scale(0.95) translateY(10px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all z-10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold mb-2">
                Rezerwacja wys&lstrok;ana!
              </h3>
              <p className="text-white/45 text-sm mb-6">
                Skontaktujemy si&#281; z Tob&#261; wkr&oacute;tce, aby potwierdzi&#263; szczeg&oacute;&#322;y.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full text-sm font-semibold border border-pink-500 text-pink-400 hover:bg-pink-500/10 transition-colors"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Zamknij
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-6">
                <span
                  className="inline-block text-[0.65rem] font-bold tracking-[0.25em] uppercase mb-2"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  REZERWACJA
                </span>
                <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-semibold leading-tight">
                  {productName}
                </h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-pink-400">{price}</span>
                  <span className="text-sm text-white/50">PLN</span>
                  <span className="text-xs text-white/35">
                    /{priceType === "person" ? "os." : "szt."}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/6 mb-6" />

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/35 mb-1.5 font-medium" style={{ fontFamily: "var(--font-body)" }}>
                      Imi&#281; i nazwisko *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/8 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/40 transition-colors"
                      style={{ fontFamily: "var(--font-body)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/35 mb-1.5 font-medium" style={{ fontFamily: "var(--font-body)" }}>
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/8 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/40 transition-colors"
                      style={{ fontFamily: "var(--font-body)" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-white/35 mb-1.5 font-medium" style={{ fontFamily: "var(--font-body)" }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/8 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/40 transition-colors"
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/35 mb-1.5 font-medium" style={{ fontFamily: "var(--font-body)" }}>
                      Data imprezy *
                    </label>
                    <input
                      type="date"
                      required
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full bg-white/5 border border-white/8 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/40 transition-colors"
                      style={{ fontFamily: "var(--font-body)", colorScheme: "dark" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/35 mb-1.5 font-medium" style={{ fontFamily: "var(--font-body)" }}>
                      Liczba os&oacute;b
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={form.guests}
                      onChange={(e) => setForm({ ...form, guests: e.target.value })}
                      placeholder="np. 8"
                      className="w-full bg-white/5 border border-white/8 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/40 transition-colors"
                      style={{ fontFamily: "var(--font-body)" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-white/35 mb-1.5 font-medium" style={{ fontFamily: "var(--font-body)" }}>
                    Wiadomo&#347;&#263;
                  </label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/8 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-pink-500/40 transition-colors resize-none"
                    style={{ fontFamily: "var(--font-body)" }}
                    placeholder="Dodatkowe informacje, pytania..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 w-full py-3 rounded-full font-semibold text-white transition-all duration-300 disabled:opacity-50"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9rem",
                    background: "linear-gradient(135deg, #be185d, #ec4899)",
                    boxShadow: "0 4px 20px rgba(236, 72, 153, 0.25)",
                  }}
                >
                  {submitting ? "Wysy\u0142anie..." : "Wy\u015Blij rezerwacj\u0119"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
