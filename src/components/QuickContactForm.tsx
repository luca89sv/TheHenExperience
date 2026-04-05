"use client";

import { useState, useCallback } from "react";
import { useCartToast } from "@/components/CartToast";

export default function QuickContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useCartToast();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/send-order.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items: [], total: 0 }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Wiadomość wysłana!");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        showToast("Błąd wysyłania", "error");
      }
    } catch {
      showToast("Błąd połączenia", "error");
    } finally {
      setSubmitting(false);
    }
  }, [form, showToast]);

  return (
    <div className="relative mt-20 mb-8">
      <div
        className="relative rounded-[20px] overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.08)", background: "#0c0c10" }}
      >
        {/* Decorative glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-60%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "500px",
            height: "500px",
            background: "radial-gradient(ellipse 50% 40% at 50% 100%, rgba(236,72,153,0.12) 0%, transparent 70%)",
            filter: "blur(40px)",
            zIndex: 1,
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: -1,
            left: "50%",
            transform: "translateX(-50%)",
            width: "60%",
            height: "2px",
            background: "linear-gradient(90deg, transparent 0%, rgba(236,72,153,0.4) 30%, rgba(244,114,182,0.6) 50%, rgba(236,72,153,0.4) 70%, transparent 100%)",
            zIndex: 2,
          }}
        />

        <div className="relative z-10 px-6 sm:px-10 lg:px-16 py-10 sm:py-14">
          {/* Header */}
          <div className="text-center mb-8">
            <span
              className="inline-block text-[0.65rem] font-bold tracking-[0.25em] uppercase mb-3"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              KONTAKT
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl lg:text-4xl font-semibold">
              Masz pytania? <em>Pisz</em>
            </h2>
            <p className="mt-2 text-white/35 text-sm max-w-md mx-auto" style={{ fontFamily: "var(--font-body)" }}>
              Odpowiadamy szybko. Napisz do nas, a pomo&#380;emy zaplanowa&#263; Tw&oacute;j idealny wiecz&oacute;r.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Imię"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all duration-300 focus:border-pink-500/40 focus:shadow-[0_0_15px_rgba(236,72,153,0.08)]"
                style={{ fontFamily: "var(--font-body)" }}
              />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all duration-300 focus:border-pink-500/40 focus:shadow-[0_0_15px_rgba(236,72,153,0.08)]"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Telefon"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all duration-300 focus:border-pink-500/40 focus:shadow-[0_0_15px_rgba(236,72,153,0.08)] mb-3"
              style={{ fontFamily: "var(--font-body)" }}
            />
            <textarea
              required
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Twoje pytanie..."
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all duration-300 focus:border-pink-500/40 focus:shadow-[0_0_15px_rgba(236,72,153,0.08)] resize-none mb-4"
              style={{ fontFamily: "var(--font-body)" }}
            />
            <div className="text-center">
              <button
                type="submit"
                disabled={submitting}
                className="px-10 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #be185d, #ec4899)",
                  fontFamily: "var(--font-body)",
                  letterSpacing: "0.03em",
                }}
              >
                {submitting ? "Wysyłanie..." : "Wyślij wiadomość"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
