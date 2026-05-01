"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import pakiety from "@/data/pakiety.json";
import pakietyNaWieczor from "@/data/pakiety-na-wieczor.json";
import atrakcje from "@/data/atrakcje.json";
import { useCart } from "@/lib/cart-context";
import { useCartToast } from "@/components/CartToast";
import { useLanguage } from "@/lib/i18n";
import BookingModal from "@/components/BookingModal";
import QuickContactForm from "@/components/QuickContactForm";

interface Product {
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  price: number;
  priceType: "person" | "pcs" | "hour";
  category: string;
  description?: string;
  description2?: string;
  description3?: string;
  features: string[];
  images: string[];
  name_en?: string;
  subtitle_en?: string;
  description_en?: string;
  description2_en?: string;
  description3_en?: string;
  features_en?: string[];
  minPeople?: number;
  maxPeople?: number;
}

const allPackages: Product[] = [...(pakiety as Product[]), ...(pakietyNaWieczor as Product[])];
const allActivities = atrakcje as Product[];

/* ── Image Carousel ── */
function ImageCarousel({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0); // -1 left, 1 right
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const count = images.length;

  const go = useCallback((to: number, dir: number) => {
    setDirection(dir);
    setActive(to);
  }, []);

  const next = useCallback(() => go((active + 1) % count, 1), [active, count, go]);
  const prev = useCallback(() => go((active - 1 + count) % count, -1), [active, count, go]);

  // Auto-advance every 5s
  useEffect(() => {
    if (count <= 1) return;
    timeoutRef.current = setTimeout(next, 5000);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [active, count, next]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/8 bg-[#0c0c10] group/carousel">
      {/* Main image */}
      <div className="relative aspect-[16/10]">
        {images.map((img, i) => (
          <div
            key={img}
            className="absolute inset-0 transition-all duration-700 ease-out"
            style={{
              opacity: active === i ? 1 : 0,
              transform: active === i
                ? "scale(1) translateX(0)"
                : `scale(1.04) translateX(${direction >= 0 ? "3%" : "-3%"})`,
              zIndex: active === i ? 1 : 0,
            }}
          >
            <Image
              src={img}
              alt={`${name} — ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
              priority={i === 0}
            />
          </div>
        ))}

        {/* Subtle vignette */}
        <div className="absolute inset-0 z-[2] pointer-events-none" style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%)",
        }} />
      </div>

      {/* Navigation arrows */}
      {count > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/70 hover:border-white/20 transition-all opacity-0 group-hover/carousel:opacity-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/70 hover:border-white/20 transition-all opacity-0 group-hover/carousel:opacity-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {count > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i, i > active ? 1 : -1)}
              className={`rounded-full transition-all duration-300 ${
                active === i
                  ? "w-6 h-1.5 bg-pink-400"
                  : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}

      {/* Thumbnails strip */}
      {count > 1 && (
        <div className="absolute bottom-4 right-4 z-10 hidden sm:flex gap-1.5">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => go(i, i > active ? 1 : -1)}
              className={`relative w-12 h-8 rounded-md overflow-hidden border transition-all duration-300 ${
                active === i
                  ? "border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.3)]"
                  : "border-white/10 opacity-50 hover:opacity-90"
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="48px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SuggestedActivityCard({ item, index }: { item: Product; index: number }) {
  const { addItem, removeItem, isInCart } = useCart();
  const { showToast } = useCartToast();
  const { t, lang } = useLanguage();
  const inCart = isInCart(item.id);
  const itemName = lang === "en" && item.name_en ? item.name_en : item.name;

  return (
    <a
      href={`/atrakcje/${item.slug}`}
      className="animated-border-card group cursor-pointer"
      style={{ "--border-delay": `${-(index * 1.3)}s` } as React.CSSProperties}
    >
      <div className="card-inner">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#0c0c10]">
          {item.images[0] && (
            <Image
              src={item.images[0]}
              alt={itemName}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1 transition-all duration-300 group-hover:bg-pink-500/20 group-hover:border-pink-500/30">
            <span className="text-sm font-bold text-pink-400">{item.price}</span>
            <span className="text-xs text-white/60 ml-1">PLN</span>
          </div>
        </div>
        <div className="p-4 flex flex-col flex-1 relative z-[1]">
          <h3 className="font-[family-name:var(--font-display)] text-sm sm:text-base font-semibold leading-snug uppercase mb-3 group-hover:text-pink-300 transition-colors duration-300">
            {itemName}
          </h3>
          <div className="mt-auto flex gap-2">
            <span
              className="flex-1 flex items-center justify-center py-2 rounded-full text-xs font-semibold border transition-all duration-300 text-pink-400 border-pink-500 bg-transparent group-hover:bg-gradient-to-r group-hover:from-pink-700 group-hover:to-pink-500 group-hover:text-white group-hover:border-transparent"
              style={{ fontFamily: "var(--font-body)", letterSpacing: "0.02em" }}
            >
              {t('activities.details')}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault(); e.stopPropagation();
                if (inCart) { removeItem(item.id); showToast(t('cart.removedToast')); }
                else { addItem(item); showToast(t('cart.addedToast')); }
              }}
              className={`group/cart relative flex items-center justify-center rounded-full border transition-colors duration-300 shrink-0 ${
                inCart
                  ? "w-[88px] h-9 gap-1 border-pink-500/40 bg-pink-500/10 text-pink-400 hover:bg-red-500/10 hover:border-red-400/40 hover:text-red-400"
                  : "w-9 h-9 border-pink-500/30 bg-pink-500/10 text-pink-400 hover:bg-pink-500/25 hover:border-pink-500/50"
              }`}
              aria-label={inCart ? "Usuń z koszyka" : "Dodaj do koszyka"}
            >
              {inCart ? (
                <>
                  <svg className="w-3.5 h-3.5 group-hover/cart:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <svg className="w-3.5 h-3.5 hidden group-hover/cart:block" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-[10px] font-medium group-hover/cart:hidden" style={{ fontFamily: "var(--font-body)" }}>{t('packages.inCart')}</span>
                  <span className="text-[10px] font-medium hidden group-hover/cart:inline" style={{ fontFamily: "var(--font-body)" }}>{t('packages.remove')}</span>
                </>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </a>
  );
}

function RelatedPackageCard({ pkg, index }: { pkg: Product; index: number }) {
  const { addItem, removeItem, isInCart } = useCart();
  const { showToast } = useCartToast();
  const { t, lang } = useLanguage();
  const inCart = isInCart(pkg.id);
  const pkgName = lang === "en" && pkg.name_en ? pkg.name_en : pkg.name;
  const pkgSubtitle = lang === "en" && pkg.subtitle_en ? pkg.subtitle_en : pkg.subtitle;

  return (
    <a
      href={`/pakiety/${pkg.slug}`}
      className="animated-border-card group cursor-pointer"
      style={{ "--border-delay": `${-(index * 1.7)}s` } as React.CSSProperties}
    >
      <div className="card-inner relative">
        <div className="absolute inset-x-0 bottom-0 rounded-b-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-[2]"
          style={{ height: "50%", background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(236,72,153,0.07) 0%, transparent 70%)" }}
        />
        <div className="relative aspect-[16/10] overflow-hidden bg-[#0c0c10]">
          {pkg.images[0] && (
            <Image
              src={pkg.images[0]}
              alt={pkgName}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2 transition-all duration-300 group-hover:bg-pink-500/20 group-hover:border-pink-500/30">
            <span className="text-xl font-bold text-pink-400">{pkg.price}</span>
            <span className="text-sm text-white/60 ml-1">PLN</span>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1 relative z-[1]">
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold leading-snug uppercase mb-1 group-hover:text-pink-300 transition-colors duration-300">
            {pkgName}
          </h3>
          {pkgSubtitle && <p className="text-xs text-white/35 mb-3">{pkgSubtitle}</p>}
          <div className="mt-auto flex gap-2">
            <span
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold border transition-all duration-300 text-pink-400 border-pink-500 bg-transparent group-hover:bg-gradient-to-r group-hover:from-pink-700 group-hover:to-pink-500 group-hover:text-white group-hover:border-transparent"
              style={{ fontFamily: "var(--font-body)", letterSpacing: "0.02em" }}
            >
              {t('packages.details')}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault(); e.stopPropagation();
                if (inCart) { removeItem(pkg.id); showToast(t('cart.removedToast')); }
                else { addItem(pkg); showToast(t('cart.addedToast')); }
              }}
              className={`group/cart relative flex items-center justify-center rounded-full border transition-colors duration-300 shrink-0 ${
                inCart
                  ? "w-[100px] h-11 gap-1.5 border-pink-500/40 bg-pink-500/10 text-pink-400 hover:bg-red-500/10 hover:border-red-400/40 hover:text-red-400"
                  : "w-11 h-11 border-pink-500/30 bg-pink-500/10 text-pink-400 hover:bg-pink-500/25 hover:border-pink-500/50"
              }`}
              aria-label={inCart ? "Usuń z koszyka" : "Dodaj do koszyka"}
            >
              {inCart ? (
                <>
                  <svg className="w-4 h-4 group-hover/cart:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <svg className="w-4 h-4 hidden group-hover/cart:block" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-[11px] font-medium group-hover/cart:hidden" style={{ fontFamily: "var(--font-body)" }}>{t('packages.inCart')}</span>
                  <span className="text-[11px] font-medium hidden group-hover/cart:inline" style={{ fontFamily: "var(--font-body)" }}>{t('packages.remove')}</span>
                </>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function PackageDetailClient({ slug }: { slug: string }) {
  const pkg = allPackages.find((p) => p.slug === slug);
  const [bookingOpen, setBookingOpen] = useState(false);
  const { addItem, removeItem, isInCart } = useCart();
  const { showToast } = useCartToast();
  const { t, lang } = useLanguage();

  if (!pkg) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold mb-4">
            {t('detail.packageNotFound')}
          </h1>
          <a href="/pakiety" className="btn-outline">{t('detail.backToPackages')}</a>
        </div>
      </section>
    );
  }

  const inCart = isInCart(pkg.id);

  const name = lang === "en" && pkg.name_en ? pkg.name_en : pkg.name;
  const subtitle = lang === "en" && pkg.subtitle_en ? pkg.subtitle_en : pkg.subtitle;
  const description = lang === "en" && pkg.description_en ? pkg.description_en : pkg.description;
  const description2 = lang === "en" && pkg.description2_en ? pkg.description2_en : pkg.description2;
  const description3 = lang === "en" && pkg.description3_en ? pkg.description3_en : pkg.description3;
  const features = lang === "en" && pkg.features_en ? pkg.features_en : pkg.features;

  return (
    <>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pt-28 sm:pt-32">
        {/* Back */}
        <a
          href="/pakiety"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors mb-6 group"
        >
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          <span className="text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>{t('detail.allPackages')}</span>
        </a>

        {/* Top section: carousel + info */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-start">
          {/* Carousel — 3/5 width */}
          <div className="lg:col-span-3">
            <ImageCarousel images={pkg.images} name={name} />
          </div>

          {/* Info card — 2/5 width */}
          <div className="lg:col-span-2">
            <span
              className="text-[0.65rem] font-bold tracking-[0.25em] uppercase mb-3"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {t('detail.package')}
            </span>
            <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight uppercase mb-2">
              {name}
            </h1>
            {subtitle && (
              <p className="text-white/35 text-sm mb-4" style={{ fontFamily: "var(--font-body)" }}>
                {subtitle}
              </p>
            )}

            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-3xl font-bold text-pink-400">{pkg.price}</span>
              <span className="text-base text-white/50">PLN</span>
              <span className="text-sm text-white/30">
                {pkg.priceType === "person" ? t('price.perPerson') : pkg.priceType === "hour" ? t('price.perHour') : t('price.perPiece')}
              </span>
            </div>

            <div className="space-y-3 mt-6">
              {/* Booking button */}
              <button
                onClick={() => setBookingOpen(true)}
                className="w-full py-3.5 rounded-full font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_24px_rgba(236,72,153,0.3)]"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                  background: "linear-gradient(135deg, #be185d, #ec4899)",
                  letterSpacing: "0.02em",
                }}
              >
                {t('booking.bookNow')}
              </button>

              {/* Add to cart */}
              <button
                onClick={() => {
                  if (inCart) {
                    removeItem(pkg.id);
                    showToast(t('cart.removedToast'));
                  } else {
                    addItem(pkg);
                    showToast(t('cart.addedToast'));
                  }
                }}
                className={`w-full py-3 rounded-full font-semibold text-sm transition-all duration-300 border-2 ${
                  inCart
                    ? "border-pink-500/40 bg-pink-500/10 text-pink-400 hover:bg-red-500/10 hover:border-red-400/40 hover:text-red-400"
                    : "border-pink-500/60 text-pink-400 hover:bg-pink-500/10 hover:border-pink-400"
                }`}
                style={{ fontFamily: "var(--font-body)", letterSpacing: "0.02em" }}
              >
                <span className="inline-flex items-center gap-2">
                  {inCart ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {t('packages.inCart')}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                      </svg>
                      {t('booking.addToCart')}
                    </>
                  )}
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* Description + contact side by side */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-3">
            {description && (
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-semibold mb-4">
                  {t('detail.aboutPackage')}
                </h2>
                <p className="text-white/50 leading-relaxed whitespace-pre-line" style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem" }}>
                  {description}
                </p>
                {description2 && (
                  <p className="text-white/50 leading-relaxed mt-4 whitespace-pre-line" style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem" }}>
                    {description2}
                  </p>
                )}
                {description3 && (
                  <p className="text-white/50 leading-relaxed mt-4 whitespace-pre-line" style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem" }}>
                    {description3}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-white/6 p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
              <p className="text-[0.65rem] text-white/25 uppercase tracking-widest font-semibold mb-4" style={{ fontFamily: "var(--font-body)" }}>
                {t('contact.questions')}
              </p>
              <div className="space-y-3">
                <a href="tel:+48537048777" className="flex items-center gap-2.5 text-white/40 hover:text-pink-400 transition-colors text-sm" style={{ fontFamily: "var(--font-body)" }}>
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  +48 537 048 777
                </a>
                <a href="mailto:atrakcjenapanienski@gmail.com" className="flex items-center gap-2.5 text-white/40 hover:text-pink-400 transition-colors text-sm" style={{ fontFamily: "var(--font-body)" }}>
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  atrakcjenapanienski@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Features — full width, 2 columns */}
        {features.length > 0 && (
          <div className="mt-10">
            <h2 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-semibold mb-5">
              {t('detail.packageIncludes')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl border border-white/6 bg-white/[0.02] hover:border-pink-500/20 hover:bg-pink-500/[0.03] transition-all duration-300"
                >
                  <div className="shrink-0 w-6 h-6 rounded-full bg-pink-500/15 flex items-center justify-center mt-0.5">
                    <svg className="w-3.5 h-3.5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <span className="text-white/65 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested activities — exclude ones matching package features */}
        {(() => {
          const featureWords = pkg.features.map(f => f.toLowerCase());
          const suggested = allActivities.filter(a => {
            const name = a.name.toLowerCase();
            // Exclude if any feature keyword strongly matches the activity name
            return !featureWords.some(f =>
              name.split(/\s+/).some(w => w.length > 4 && f.includes(w)) ||
              f.split(/\s+/).some(w => w.length > 4 && name.includes(w))
            );
          }).slice(0, 4);

          return suggested.length > 0 ? (
            <div className="mt-16 pt-12 border-t border-white/6">
              <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-semibold mb-3">
                <span dangerouslySetInnerHTML={{ __html: t('detail.complementTitle') }} />
              </h2>
              <p className="text-white/35 text-sm mb-8" style={{ fontFamily: "var(--font-body)" }}>
                {t('detail.complementSubtitle')}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {suggested.map((a, i) => (
                  <SuggestedActivityCard key={a.id} item={a} index={i} />
                ))}
              </div>
            </div>
          ) : null;
        })()}

        {/* Other packages */}
        <div className="mt-20 pt-12 border-t border-white/6 pb-16">
          <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-semibold mb-8">
            <span dangerouslySetInnerHTML={{ __html: t('detail.otherPackages') }} />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPackages
              .filter((p) => p.id !== pkg.id)
              .slice(0, 3)
              .map((p, i) => (
                <RelatedPackageCard key={p.id} pkg={p} index={i} />
              ))}
          </div>
        </div>

        <QuickContactForm />
      </div>

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        productName={name}
        price={pkg.price}
        priceType={pkg.priceType}
        minPeople={pkg.minPeople}
        maxPeople={pkg.maxPeople}
      />
    </>
  );
}
