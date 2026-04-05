"use client";

import { useState, useCallback } from "react";
import { useCart } from "@/lib/cart-context";
import Toast from "@/components/Toast";

interface ToastState {
  message: string;
  type: "success" | "error";
}

export default function CheckoutPage() {
  const { items, removeItem, getTotal, clearCart, hydrated } = useCart();
  const total = getTotal();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!form.name || !form.phone || !form.email) {
        setToast({
          message: "Proszę wypełnić wymagane pola: imię, telefon i email.",
          type: "error",
        });
        return;
      }

      if (items.length === 0) {
        setToast({ message: "Twój koszyk jest pusty.", type: "error" });
        return;
      }

      setSubmitting(true);

      try {
        const payload = {
          name: form.name,
          phone: form.phone,
          email: form.email,
          date: form.date,
          message: form.message,
          items: items.map((item) => ({
            name: item.product.name,
            price: item.product.price,
            priceType: item.product.priceType,
            guests: item.guests,
            subtotal:
              item.product.priceType === "person"
                ? item.product.price * item.guests
                : item.product.price,
          })),
          total,
        };

        const res = await fetch("/api/send-order.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (data.success) {
          setToast({
            message:
              "Zamówienie zostało wysłane! Skontaktujemy się z Tobą wkrótce.",
            type: "success",
          });
          clearCart();
          setForm({ name: "", phone: "", email: "", date: "", message: "" });
        } else {
          setToast({
            message: data.error || "Wystąpił błąd. Spróbuj ponownie.",
            type: "error",
          });
        }
      } catch {
        setToast({
          message: "Nie udało się wysłać zamówienia. Sprawdź połączenie.",
          type: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [form, items, total, clearCart]
  );

  const inputClassName =
    "w-full bg-transparent border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all duration-300 focus:border-pink-500/40 focus:shadow-[0_0_20px_rgba(236,72,153,0.08)] [color-scheme:dark]";
  const labelClassName =
    "block text-xs text-white/30 mb-1.5 font-medium tracking-wide uppercase";

  return (
    <main
      className="min-h-screen pt-32 pb-24 px-4"
      style={{ background: "#0c0c10" }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-[1100px] mx-auto">
        {/* Page header */}
        <div className="mb-12">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-pink-400 transition-colors duration-300 mb-6"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 12H5m0 0l7 7m-7-7l7-7"
              />
            </svg>
            Wróć do strony
          </a>
          <h1
            className="font-[family-name:var(--font-display)] text-white font-semibold"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
          >
            Podsumowanie zamówienia
          </h1>
        </div>

        {!hydrated ? (
          <div className="text-center py-20 text-white/20 text-sm">Ładowanie...</div>
        ) : items.length === 0 ? (
          /* Empty state */
          <div
            className="rounded-2xl p-12 text-center"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <svg
              className="w-20 h-20 mx-auto mb-6 text-white/10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
            <h2
              className="font-[family-name:var(--font-display)] text-white text-xl font-semibold mb-3"
            >
              Twój koszyk jest pusty
            </h2>
            <p
              className="text-white/30 text-sm mb-8"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Dodaj atrakcje do koszyka, aby złożyć zamówienie.
            </p>
            <a
              href="/"
              className="inline-block px-8 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #be185d, #ec4899)",
                fontFamily: "var(--font-body)",
                letterSpacing: "0.02em",
              }}
            >
              Przeglądaj atrakcje
            </a>
          </div>
        ) : (
          /* Two column layout */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column — Cart summary */}
            <div>
              <h2
                className="font-[family-name:var(--font-display)] text-white text-lg font-semibold mb-6"
              >
                Twoje zamówienie
              </h2>

              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {items.map((item, index) => {
                  const subtotal =
                    item.product.priceType === "person"
                      ? item.product.price * item.guests
                      : item.product.price;

                  return (
                    <div
                      key={item.product.id}
                      className="px-6 py-5"
                      style={{
                        borderBottom:
                          index < items.length - 1
                            ? "1px solid rgba(255,255,255,0.06)"
                            : "none",
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          {/* Number */}
                          <span
                            className="text-xs text-white/20 font-medium mt-1 shrink-0"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h3
                              className="font-[family-name:var(--font-display)] text-white text-sm font-semibold leading-snug"
                            >
                              {item.product.name}
                            </h3>
                            <p
                              className="text-xs text-white/30 mt-1"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              {item.product.priceType === "person"
                                ? `${item.guests} osób \u00D7 ${item.product.price} PLN/os.`
                                : `${item.product.price} PLN`}
                            </p>
                          </div>
                        </div>

                        {/* Right side: subtotal + remove */}
                        <div className="flex items-center gap-4 shrink-0">
                          <span
                            className="text-sm text-white font-semibold"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {subtotal} PLN
                          </span>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-white/20 hover:text-pink-400 transition-colors duration-300"
                            aria-label={`Usuń ${item.product.name}`}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              <div
                className="mt-6 rounded-2xl px-6 py-5"
                style={{
                  background: "linear-gradient(135deg, rgba(190,24,93,0.08), rgba(236,72,153,0.04))",
                  border: "1px solid rgba(236,72,153,0.15)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-pink-400/60" style={{ fontFamily: "var(--font-body)" }}>
                    Łączna cena
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-pink-400">
                    {total}{" "}
                    <span className="text-base text-pink-400/50 font-normal">PLN</span>
                  </span>
                </div>
              </div>

              {/* Info box */}
              <div
                className="mt-6 rounded-2xl px-6 py-5"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <svg
                    className="w-4 h-4 text-pink-400 shrink-0 mt-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                  <h4
                    className="text-xs text-white/40 font-medium uppercase tracking-wide"
                  >
                    Ważne informacje
                  </h4>
                </div>
                <ul
                  className="space-y-2 text-xs text-white/30 leading-relaxed"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500/50 mt-0.5">&#8226;</span>
                    Wszystkie wstępne rezerwacje są niezobowiązujące.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500/50 mt-0.5">&#8226;</span>
                    Możesz zmienić datę, liczbę osób oraz dodawać lub usuwać
                    atrakcje.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500/50 mt-0.5">&#8226;</span>
                    Prosimy o dokonywanie zmian minimum 7 dni przed wydarzeniem.
                  </li>
                </ul>
              </div>
            </div>

            {/* Right column — Form */}
            <div>
              {/* Form */}
              <div
                className="rounded-2xl px-6 py-6"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <h3
                  className="font-[family-name:var(--font-display)] text-white text-base font-semibold mb-5"
                >
                  Dane kontaktowe
                </h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Name */}
                  <div>
                    <label className={labelClassName}>
                      Imię <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Twoje imię"
                      required
                      className={inputClassName}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className={labelClassName}>
                      Telefon <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+48 ..."
                      required
                      className={inputClassName}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className={labelClassName}>
                      Email <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="twoj@email.pl"
                      required
                      className={inputClassName}
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className={labelClassName}>Data wieczoru</label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      className={`${inputClassName} bg-white/[0.04]`}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className={labelClassName}>Wiadomość</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Dodatkowe informacje, pytania..."
                      rows={4}
                      className={`${inputClassName} resize-none`}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-2 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{
                      background: "linear-gradient(135deg, #be185d, #ec4899)",
                      fontFamily: "var(--font-body)",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {submitting ? "Wysyłanie..." : "Zarezerwuj teraz"}
                  </button>

                  {/* Consent note */}
                  <p
                    className="text-[11px] text-white/20 text-center leading-relaxed mt-1"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Wysyłając formularz, wyrażasz zgodę na kontakt w sprawie
                    rezerwacji.
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
