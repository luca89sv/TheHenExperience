"use client";

import { useState } from "react";
import Image from "next/image";
import pakiety from "@/data/pakiety.json";
import pakietyNaWieczor from "@/data/pakiety-na-wieczor.json";
import { useCart } from "@/lib/cart-context";
import { useCartToast } from "@/components/CartToast";
import { useLanguage } from "@/lib/i18n";
import QuickContactForm from "@/components/QuickContactForm";

interface Product {
  id: string;
  name: string;
  name_en?: string;
  slug: string;
  subtitle?: string;
  subtitle_en?: string;
  price: number;
  priceType: "person" | "pcs";
  category: string;
  description?: string;
  description_en?: string;
  features: string[];
  images: string[];
}

const allPackages: Product[] = [...(pakiety as Product[]), ...(pakietyNaWieczor as Product[])];

function formatName(name: string) {
  const parts = name.split(/\s*\+\s*/);
  if (parts.length <= 1) return <>{name}</>;
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {i > 0 && <span className="inline-block mx-1.5 text-pink-400 font-light opacity-70">&bull;</span>}
          {part}
        </span>
      ))}
    </>
  );
}

function PackageCard({ pkg, index }: { pkg: Product; index: number }) {
  const { addItem, removeItem, isInCart } = useCart();
  const { showToast } = useCartToast();
  const { t, lang } = useLanguage();
  const inCart = isInCart(pkg.id);
  const name = lang === "en" && pkg.name_en ? pkg.name_en : pkg.name;
  const subtitle = lang === "en" && pkg.subtitle_en ? pkg.subtitle_en : pkg.subtitle;
  const description = lang === "en" && pkg.description_en ? pkg.description_en : pkg.description;

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
              alt={pkg.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2 transition-all duration-300 group-hover:bg-pink-500/20 group-hover:border-pink-500/30 group-hover:scale-105">
            <span className="text-xl font-bold text-pink-400 transition-colors duration-300 group-hover:text-pink-300">{pkg.price}</span>
            <span className="text-sm text-white/60 ml-1">PLN</span>
            <span className="text-xs text-white/40 ml-0.5">
              {pkg.priceType === "person" ? t('price.perPerson') : t('price.perPiece')}
            </span>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1 relative z-[1]">
          <h3 className="font-[family-name:var(--font-display)] text-base sm:text-lg font-semibold leading-snug mb-1 group-hover:text-pink-300 transition-colors duration-300">
            {formatName(name)}
          </h3>
          {subtitle && <p className="text-xs text-white/35 mb-4">{subtitle}</p>}
          {description && (
            <p className="text-xs text-white/40 leading-relaxed mb-4 line-clamp-2 group-hover:text-white/55 transition-colors duration-300">
              {description}
            </p>
          )}
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

export default function PakietyPage() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden pt-32 pb-[var(--section-padding)]">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-12">
          <span className="section-tag" style={{ color: "rgba(255,255,255,0.45)" }}>{t('listing.allPackagesTag')}</span>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-semibold">
            <span dangerouslySetInnerHTML={{ __html: t('listing.allPackagesTitle') }} />
          </h2>
          <p className="mt-3 text-white/45 max-w-lg mx-auto">
            {t('listing.allPackagesSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPackages.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} index={i} />
          ))}
        </div>

        <QuickContactForm />
      </div>
    </section>
  );
}
