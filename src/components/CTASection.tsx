"use client";

import { useState, useCallback } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/lib/i18n";

export default function CTASection() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    guests: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim() || !formData.email.trim()) {
      setError(t('cta.requiredError'));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/send-order.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: formData.date,
          guests: formData.guests,
          message: formData.message,
          items: [],
          total: 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setFormData({ name: "", email: "", phone: "", date: "", guests: "", message: "" });
      } else {
        setError(t('cta.sendError'));
      }
    } catch {
      setError(t('cta.sendError'));
    } finally {
      setSubmitting(false);
    }
  }, [formData, t]);

  return (
    <section
      id="kontakt"
      className="relative overflow-hidden"
      style={{ padding: "clamp(2rem, 4vw, 3rem) 0 var(--section-padding)" }}
    >
      <div className="max-w-[min(1100px,92vw)] mx-auto relative z-10">
        <ScrollReveal type="cta-dramatic">
          <div className="relative rounded-[24px] overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)", background: "#0c0c10" }}>
            {/* Ray beam — strong outside, fades before inputs */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: "-100%",
                right: "-20%",
                width: "600px",
                height: "1000px",
                background: "conic-gradient(from 205deg at 50% 85%, transparent 0deg, rgba(236,72,153,0.25) 7deg, rgba(255,200,230,0.45) 11deg, rgba(255,255,255,0.55) 12deg, rgba(255,200,230,0.45) 13deg, rgba(236,72,153,0.25) 17deg, transparent 24deg)",
                filter: "blur(25px)",
                opacity: 0.7,
                zIndex: 1,
              }}
            />
            {/* Bright edge glow on card border — top + right side */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: -1,
                right: -1,
                width: "55%",
                height: "70%",
                background: "radial-gradient(ellipse 80% 60% at 100% 0%, rgba(236,72,153,0.3) 0%, rgba(236,72,153,0.08) 30%, transparent 60%)",
                zIndex: 1,
              }}
            />
            {/* Soft atmosphere */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: "-40%",
                right: "-10%",
                width: "400px",
                height: "400px",
                background: "radial-gradient(ellipse 50% 60% at 50% 70%, rgba(236,72,153,0.1) 0%, transparent 70%)",
                filter: "blur(40px)",
                zIndex: 1,
              }}
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">
              {/* Left side — text + contact info */}
              <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
                <span className="section-tag" style={{ color: "rgba(255,255,255,0.45)" }}>{t("cta.tag")}</span>
                <h2
                  className="font-[family-name:var(--font-display)] font-semibold"
                  style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", marginBottom: "1rem" }}
                  dangerouslySetInnerHTML={{ __html: t("cta.title") }}
                />
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "rgba(255,255,255,0.45)",
                    lineHeight: 1.7,
                    marginBottom: "2.5rem",
                  }}
                >
                  {t("cta.desc")}
                </p>

                {/* Contact details */}
                <div className="flex flex-col gap-4">
                  <a
                    href="tel:+48537048777"
                    className="group flex items-center gap-3 text-white/60 hover:text-pink-400 transition-colors duration-300"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] group-hover:border-pink-500/30 group-hover:bg-pink-500/10 transition-all duration-300">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">+48 537 048 777</span>
                  </a>
                  <a
                    href="mailto:atrakcjenapanienski@gmail.com"
                    className="group flex items-center gap-3 text-white/60 hover:text-pink-400 transition-colors duration-300"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] group-hover:border-pink-500/30 group-hover:bg-pink-500/10 transition-all duration-300">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">atrakcjenapanienski@gmail.com</span>
                  </a>
                </div>
              </div>

              {/* Right side — form */}
              <div className="relative p-8 sm:p-12 lg:p-16 lg:border-l border-t lg:border-t-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                {submitted ? (
                  <div className="flex flex-col items-center justify-center text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-500/20 flex items-center justify-center">
                      <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <h3 className="font-[family-name:var(--font-display)] text-2xl font-semibold mb-2">
                      {t('cta.successTitle')}
                    </h3>
                    <p className="text-white/45 text-sm mb-6" style={{ fontFamily: "var(--font-body)" }}>
                      {t('cta.successDesc')}
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 rounded-full text-sm font-semibold border border-pink-500 text-pink-400 hover:bg-pink-500/10 transition-colors"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {t('cta.sendAnother')}
                    </button>
                  </div>
                ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {error && (
                    <div className="rounded-xl px-4 py-3 text-sm text-red-400 border border-red-500/20 bg-red-500/5" style={{ fontFamily: "var(--font-body)" }}>
                      {error}
                    </div>
                  )}

                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/30 mb-1.5 font-medium tracking-wide uppercase">{t("cta.labelName")} <span className="text-pink-400">*</span></label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t("cta.placeholderName")}
                        className="w-full bg-transparent border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all duration-300 focus:border-pink-500/40 focus:shadow-[0_0_20px_rgba(236,72,153,0.08)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/30 mb-1.5 font-medium tracking-wide uppercase">{t("cta.labelEmail")} <span className="text-pink-400">*</span></label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t("cta.placeholderEmail")}
                        className="w-full bg-transparent border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all duration-300 focus:border-pink-500/40 focus:shadow-[0_0_20px_rgba(236,72,153,0.08)]"
                      />
                    </div>
                  </div>

                  {/* Phone + Date row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/30 mb-1.5 font-medium tracking-wide uppercase">{t("cta.labelPhone")}</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+48 ..."
                        className="w-full bg-transparent border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all duration-300 focus:border-pink-500/40 focus:shadow-[0_0_20px_rgba(236,72,153,0.08)]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/30 mb-1.5 font-medium tracking-wide uppercase">{t("cta.labelDate")}</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-pink-500/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(236,72,153,0.08)] [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="block text-xs text-white/30 mb-1.5 font-medium tracking-wide uppercase">{t("cta.labelGuests")}</label>
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-pink-500/40 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(236,72,153,0.08)] [color-scheme:dark] appearance-none"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center" }}
                    >
                      <option value="" className="bg-[#0c0c10]">{t("cta.guestsSelect")}</option>
                      <option value="2-5" className="bg-[#0c0c10]">2-5 {t("cta.guestsPeople")}</option>
                      <option value="6-10" className="bg-[#0c0c10]">6-10 {t("cta.guestsPeople")}</option>
                      <option value="11-15" className="bg-[#0c0c10]">11-15 {t("cta.guestsPeople")}</option>
                      <option value="16-20" className="bg-[#0c0c10]">16-20 {t("cta.guestsPeople")}</option>
                      <option value="20+" className="bg-[#0c0c10]">20+ {t("cta.guestsPeople")}</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs text-white/30 mb-1.5 font-medium tracking-wide uppercase">{t("cta.labelMessage")} <span className="text-pink-400">*</span></label>
                    <textarea
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t("cta.placeholderMessage")}
                      rows={4}
                      className="w-full bg-transparent border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all duration-300 focus:border-pink-500/40 focus:shadow-[0_0_20px_rgba(236,72,153,0.08)] resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-2 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{
                      background: "linear-gradient(135deg, #be185d, #ec4899)",
                      fontFamily: "var(--font-body)",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {submitting ? t("cta.submitting") : t("cta.submit")}
                  </button>
                </form>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
