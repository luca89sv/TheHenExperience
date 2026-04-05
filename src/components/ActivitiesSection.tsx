"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import atrakcje from "@/data/atrakcje.json";
import { useCart } from "@/lib/cart-context";
import { useCartToast } from "@/components/CartToast";

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

const allActivities = atrakcje as Product[];

/** Each activity can belong to multiple categories */
const categoryMap: Record<string, string[]> = {
  "tancerz-na-panienski":      ["Sexy", "Nocne", "Polecane"],
  "prywatny-fotograf":         ["Dzienne", "Polecane"],
  "rozowa-limuzyna":           ["Limuzyny", "Polecane"],
  "wieczor-w-klubie":          ["Nocne", "Rozrywka", "Polecane"],
  "rejs-gondola":              ["Plenerowe", "Dzienne"],
  "sexy-spa":                  ["Sexy", "Dzienne", "Polecane"],
  "kregle":                    ["Rozrywka", "Dzienne"],
  "limuzyna-bmw":              ["Limuzyny"],
  "party-bus":                 ["Party busy", "Nocne", "Polecane"],
  "kolacja-w-restauracji":     ["Posiłki", "Nocne"],
  "billard":                   ["Rozrywka", "Dzienne"],
  "wieczor-karaoke":           ["Nocne", "Rozrywka"],
  "limuzyna-hummer":           ["Limuzyny", "Polecane"],
  "wieczor-w-kasynie":         ["Nocne", "Rozrywka"],
  "piknik-nad-wisla":          ["Plenerowe", "Dzienne", "Posiłki"],
  "limuzyna-chrysler-prestige":["Limuzyny"],
  "nauka-tanca":               ["Sexy", "Dzienne", "Rozrywka"],
  "kurs-makijazu":             ["Dzienne"],
  "limuzyna-do-15-osob":       ["Limuzyny", "Party busy"],
  "paintball":                 ["Rozrywka", "Dzienne", "Plenerowe"],
  "limuzyna-lincoln":          ["Limuzyny"],
  "quady":                     ["Rozrywka", "Dzienne", "Plenerowe"],
  "wizyta-na-strzelnicy":      ["Rozrywka", "Dzienne"],
  "limuzyna-z-jet-door":       ["Limuzyny", "Polecane"],
  "laserowy-paintball":        ["Rozrywka", "Dzienne"],
  "emocje-w-monster-trucku":   ["Rozrywka", "Dzienne"],
  "park-trampolin":            ["Rozrywka", "Dzienne"],
  "nauka-tanca-na-rurze":      ["Sexy", "Dzienne", "Polecane"],
  "szalenstwo-na-gokartach":   ["Rozrywka", "Dzienne"],
  "rejs-statkiem-po-wisle":    ["Plenerowe", "Dzienne"],
  "ognisko":                   ["Plenerowe", "Dzienne", "Posiłki"],
  "przejazd-limuzyna-chrysler":["Limuzyny", "Transfery"],
  "transfer-busem":            ["Transfery"],
  "czerwony-dywan":            ["Dzienne"],
  "rozowe-kapelusze":          ["Dzienne"],
};

const CATEGORIES = [
  "Wszystko", "Polecane", "Dzienne", "Nocne", "Limuzyny", "Party busy",
  "Sexy", "Posiłki", "Rozrywka", "Plenerowe", "Transfery",
];

function getCategories(id: string): string[] {
  return categoryMap[id] || [];
}

function ActivityCard({ item, index }: { item: Product; index: number }) {
  const { addItem, removeItem, isInCart } = useCart();
  const { showToast } = useCartToast();
  const inCart = isInCart(item.id);

  return (
    <Link
      href={`/atrakcje/${item.slug}`}
      className="animated-border-card group cursor-pointer"
      style={{ "--border-delay": `${-(index * 1.3)}s` } as React.CSSProperties}
    >
      <div className="card-inner">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#0c0c10]">
          {item.images[0] && (
            <Image
              src={item.images[0]}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Price badge */}
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 transition-all duration-300 group-hover:bg-pink-500/20 group-hover:border-pink-500/30 group-hover:scale-105">
            <span className="text-base font-bold text-pink-400 transition-colors duration-300 group-hover:text-pink-300">{item.price}</span>
            <span className="text-xs text-white/60 ml-1">PLN</span>
            <span className="text-xs text-white/40 ml-0.5">
              /{item.priceType === "person" ? "os." : "szt."}
            </span>
          </div>
        </div>

        {/* Subtle radial glow on hover */}
        <div className="absolute inset-x-0 bottom-0 rounded-b-[16px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-[2]"
          style={{
            height: "50%",
            background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(236,72,153,0.07) 0%, transparent 70%)",
          }}
        />

        <div className="p-4 flex flex-col flex-1 relative z-[1]">
          <h3 className="font-[family-name:var(--font-display)] text-base font-semibold leading-snug mb-1 uppercase group-hover:text-pink-300 transition-colors duration-300">
            {item.name}
          </h3>
          {item.subtitle && (
            <p className="text-xs text-white/35 mb-3">{item.subtitle}</p>
          )}

          {/* Buttons */}
          <div className="mt-auto flex gap-2">
            <span
              className="flex-1 flex items-center justify-center py-2 rounded-full text-xs font-semibold border transition-all duration-300
                text-pink-400 border-pink-500 bg-transparent
                group-hover:bg-gradient-to-r group-hover:from-pink-700 group-hover:to-pink-500 group-hover:text-white group-hover:border-transparent"
              style={{ fontFamily: "var(--font-body)", letterSpacing: "0.02em" }}
            >
              Szczegóły
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (inCart) {
                  removeItem(item.id);
                  showToast("Usunięto z koszyka");
                } else {
                  addItem(item);
                  showToast("Dodano do koszyka");
                }
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
                  <span className="text-[10px] font-medium hidden sm:inline group-hover/cart:!hidden" style={{ fontFamily: "var(--font-body)" }}>W koszyku</span>
                  <span className="text-[10px] font-medium hidden sm:!hidden sm:group-hover/cart:!inline" style={{ fontFamily: "var(--font-body)" }}>Usuń</span>
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
    </Link>
  );
}

export default function ActivitiesSection() {
  const [activeCategory, setActiveCategory] = useState("Polecane");

  const filtered = activeCategory === "Wszystko"
    ? allActivities
    : allActivities.filter((a) => getCategories(a.id).includes(activeCategory));

  const displayItems = filtered.slice(0, 8);

  return (
    <section id="atrakcje" className="relative overflow-hidden pt-12 pb-12">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="section-tag" style={{ color: "rgba(255,255,255,0.45)" }}>POJEDYNCZE ATRAKCJE</span>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-semibold">
            Dopasuj sw&oacute;j <em>wiecz&oacute;r</em>
          </h2>
          <p className="mt-3 text-white/45 max-w-lg mx-auto">
            Wybierz pojedyncze atrakcje i stw&oacute;rz w&#322;asny, niepowtarzalny plan wieczoru panie&#324;skiego.
          </p>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                activeCategory === cat
                  ? "bg-pink-500/20 border-pink-500/50 text-pink-300"
                  : "bg-transparent border-white/10 text-white/45 hover:border-pink-500/30 hover:text-white/70"
              }`}
              style={{ fontFamily: "var(--font-body)" }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayItems.map((item, i) => (
            <ActivityCard key={item.id} item={item} index={i} />
          ))}
        </div>

        {/* See all button */}
        {filtered.length > 8 && (
          <div className="text-center mt-16">
            <a href="/atrakcje" className="btn-outline btn-lg group/btn">
              Zobacz wszystkie atrakcje
              <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
