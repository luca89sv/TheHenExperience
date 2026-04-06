"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { useCartToast } from "@/components/CartToast";
import { useLanguage } from "@/lib/i18n";
import pakiety from "@/data/pakiety.json";
import atrakcje from "@/data/atrakcje.json";

interface Product {
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  price: number;
  priceType: "person" | "pcs";
  category: string;
  description?: string;
  features: string[];
  images: string[];
}

const allData = [...(pakiety as Product[]), ...(atrakcje as Product[])];

const FEATURED_IDS = [
  "fotograf-limuzyna-tancerz-klub",
  "rozowa-limuzyna",
  "limuzyna-hummer",
  "party-bus",
  "limuzyna-z-jet-door",
];

const featured = FEATURED_IDS.map((id) => allData.find((x) => x.id === id)!);
const heroItem = featured[0];
const sideItems = featured.slice(1);

function FeaturedHeader() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ctx: any;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      }, el);
    })();
    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <div ref={ref} className="text-center mb-14">
      {/* Prominent badge */}
      <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full mb-6"
        style={{
          background: "linear-gradient(135deg, rgba(190,24,93,0.25), rgba(236,72,153,0.12))",
          border: "1px solid rgba(236,72,153,0.3)",
          boxShadow: "0 0 25px rgba(236,72,153,0.1)",
        }}
      >
        <svg className="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
        </svg>
        <span
          className="text-sm font-bold tracking-[0.2em] uppercase text-pink-400"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {t('featured.badge')}
        </span>
        <svg className="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
        </svg>
      </div>
      <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-semibold">
        <span dangerouslySetInnerHTML={{ __html: t('featured.title') }} />
      </h2>
      <p
        className="mt-3 text-white/40 max-w-md mx-auto text-sm"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {t('featured.subtitle')}
      </p>
    </div>
  );
}

function CartButton({ item, size = "sm" }: { item: Product; size?: "sm" | "lg" }) {
  const { t } = useLanguage();
  const { addItem, removeItem, isInCart } = useCart();
  const { showToast } = useCartToast();
  const inCart = isInCart(item.id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (inCart) {
          removeItem(item.id);
          showToast(t('cart.removedToast'));
        } else {
          addItem(item);
          showToast(t('cart.addedToast'));
        }
      }}
      className={`group/cart relative flex items-center justify-center rounded-full border transition-all duration-300 shrink-0 ${
        inCart
          ? size === "lg"
            ? "w-[110px] h-11 gap-1.5 border-pink-400/50 bg-pink-500/20 text-pink-300 hover:bg-red-500/15 hover:border-red-400/40 hover:text-red-300"
            : "w-[88px] h-9 gap-1 border-pink-400/50 bg-pink-500/20 text-pink-300 hover:bg-red-500/15 hover:border-red-400/40 hover:text-red-300"
          : size === "lg"
            ? "w-11 h-11 border-white/20 bg-black/50 text-white hover:bg-pink-500/30 hover:border-pink-500/40 hover:text-pink-300"
            : "w-9 h-9 border-white/20 bg-black/50 text-white hover:bg-pink-500/30 hover:border-pink-500/40 hover:text-pink-300"
      }`}
      style={{ backdropFilter: "blur(12px)" }}
      aria-label={inCart ? "Usuń z koszyka" : "Dodaj do koszyka"}
    >
      {inCart ? (
        <>
          <svg className={`${size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5"} group-hover/cart:hidden`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <svg className={`${size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5"} hidden group-hover/cart:block`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className={`${size === "lg" ? "text-[11px]" : "text-[10px]"} font-medium group-hover/cart:hidden`} style={{ fontFamily: "var(--font-body)" }}>{t('packages.inCart')}</span>
          <span className={`${size === "lg" ? "text-[11px]" : "text-[10px]"} font-medium hidden group-hover/cart:inline`} style={{ fontFamily: "var(--font-body)" }}>{t('packages.remove')}</span>
        </>
      ) : (
        <svg className={size === "lg" ? "w-5 h-5" : "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
      )}
    </button>
  );
}

const HERO_IMAGE = "/media/fotograf-1-cover.jpg";

function HeroCard({ item }: { item: Product }) {
  const { t } = useLanguage();
  const href = item.category === "pakiety" ? `/pakiety/${item.slug}` : `/atrakcje/${item.slug}`;

  return (
    <div className="featured-hero-border relative h-full rounded-[22px] overflow-hidden">
      {/* Spinning gradient — prominent */}
      <div className="featured-hero-spin absolute z-0" />

      {/* Solid hover overlay */}
      <div className="featured-hero-hover absolute inset-0 z-0 rounded-[22px] opacity-0" />

      {/* Inner card */}
      <a
        href={href}
        className="group relative block h-full rounded-[18px] overflow-hidden cursor-pointer z-[1]"
        style={{ margin: "3px" }}
      >
        {/* Image */}
        <Image
          src={HERO_IMAGE}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(236,72,153,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Badge */}
        <div className="absolute top-4 left-4 z-20">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-[0.12em] uppercase"
            style={{
              background: "linear-gradient(135deg, rgba(190,24,93,0.95), rgba(236,72,153,0.95))",
              backdropFilter: "blur(8px)",
              color: "white",
              fontFamily: "var(--font-body)",
              boxShadow: "0 4px 20px rgba(236,72,153,0.4)",
            }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            {t('featured.bestseller')}
          </div>
        </div>

        {/* Cart button */}
        <div className="absolute top-4 right-4 z-20">
          <CartButton item={item} size="lg" />
        </div>

        {/* Content — bottom */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-7">
          <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl lg:text-3xl font-semibold uppercase leading-tight mb-2 group-hover:text-pink-200 transition-colors duration-300">
            {t('featured.heroTitle')}
          </h3>
          <p className="text-white/50 text-xs sm:text-sm mb-4 max-w-sm" style={{ fontFamily: "var(--font-body)" }}>
            {t('featured.heroDesc')}
          </p>
          <div className="flex items-center gap-4">
            <span
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(236,72,153,0.3)] group-hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #be185d, #ec4899)",
                fontFamily: "var(--font-body)",
                letterSpacing: "0.03em",
              }}
            >
              {t('featured.viewDetails')}
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-bold text-white">{item.price}</span>
              <span className="text-sm text-white/50">PLN</span>
              <span className="text-xs text-white/35">{t('price.perPerson')}</span>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

function SideCard({ item, index }: { item: Product; index: number }) {
  const { t } = useLanguage();
  const href = item.category === "pakiety" ? `/pakiety/${item.slug}` : `/atrakcje/${item.slug}`;

  return (
    <a href={href} className="featured-side-card group relative block h-full rounded-[16px] overflow-hidden cursor-pointer">
      {/* Image */}
      <Image
        src={item.images[0]}
        alt={item.name}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 768px) 50vw, 25vw"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(236,72,153,0.1) 0%, transparent 70%)",
        }}
      />

      {/* Hot badge for first item */}
      {index === 0 && (
        <div className="absolute top-3 left-3 z-20">
          <div
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-[0.12em] uppercase"
            style={{
              background: "linear-gradient(135deg, rgba(190,24,93,0.95), rgba(236,72,153,0.9))",
              backdropFilter: "blur(8px)",
              color: "white",
              fontFamily: "var(--font-body)",
              boxShadow: "0 4px 15px rgba(236,72,153,0.35)",
            }}
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            {t('featured.hot')}
          </div>
        </div>
      )}

      {/* Cart button */}
      <div className="absolute top-3 right-3 z-20">
        <CartButton item={item} size="sm" />
      </div>

      {/* Content — bottom */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4">
        <h3 className="font-[family-name:var(--font-display)] text-sm sm:text-base font-semibold uppercase leading-tight mb-1 group-hover:text-pink-200 transition-colors duration-300">
          {item.name}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-lg sm:text-xl font-bold text-pink-400 group-hover:text-pink-300 transition-colors duration-300">{item.price}</span>
            <span className="text-xs text-white/50">PLN</span>
            <span className="text-[10px] text-white/30">
              {item.priceType === "person" ? t('price.perPerson') : t('price.perPiece')}
            </span>
          </div>
          <span
            className="text-[10px] font-semibold text-white/40 uppercase tracking-wider group-hover:text-pink-400/60 transition-colors duration-300"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {t('activities.details')} →
          </span>
        </div>
      </div>

      {/* Border */}
      <div
        className="absolute inset-0 rounded-[16px] pointer-events-none z-30 transition-all duration-500"
        style={{
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      />
      <div
        className="absolute inset-0 rounded-[16px] pointer-events-none z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          border: "1px solid rgba(236,72,153,0.3)",
        }}
      />
    </a>
  );
}

export default function FeaturedSection() {
  return (
    <section className="relative py-[var(--section-padding)]" style={{ position: "relative", zIndex: 4 }}>
      {/* Subtle background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(236,72,153,0.03) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="max-w-[1200px] mx-auto px-4 relative z-10">
        <FeaturedHeader />

        {/* Bento grid — hero perfectly aligned with 2 rows of side cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:grid-rows-2">
          {/* Hero card — spans 2 cols and 2 rows on desktop */}
          <div className="col-span-2 lg:row-span-2 aspect-[4/3] lg:aspect-auto min-h-[300px]">
            <HeroCard item={heroItem} />
          </div>

          {/* Side cards — 4 smaller cards, same aspect ratio ensures alignment */}
          {sideItems.map((item, i) => (
            <div key={item.id} className="aspect-[3/2]">
              <SideCard item={item} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
