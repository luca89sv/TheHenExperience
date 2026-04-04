"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import pakiety from "@/data/pakiety.json";
import pakietyNaWieczor from "@/data/pakiety-na-wieczor.json";
import ScrollReveal from "@/components/ScrollReveal";

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

const allPackages: Product[] = [...(pakiety as Product[]), ...(pakietyNaWieczor as Product[])];

function SquigglyLine() {
  const pathRef = useRef<SVGPathElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (pathRef.current) {
      observer.observe(pathRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      viewBox="0 0 300 30"
      fill="none"
      className="w-48 sm:w-64 h-8 mx-auto mb-2"
      preserveAspectRatio="none"
    >
      <path
        ref={pathRef}
        d="M0 15 Q25 0 50 15 T100 15 T150 15 T200 15 T250 15 T300 15"
        stroke="#ec4899"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        className={`squiggly-line ${animate ? "animate" : ""}`}
      />
    </svg>
  );
}

function PackageCard({ pkg }: { pkg: Product }) {
  const maxFeatures = 5;
  const displayFeatures = pkg.features.slice(0, maxFeatures);

  return (
    <div className="glass-card overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0c0c10]">
        {pkg.images[0] && (
          <Image
            src={pkg.images[0]}
            alt={pkg.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold leading-snug mb-1">
          {pkg.name}
        </h3>
        {pkg.subtitle && (
          <p className="text-xs text-white/40 mb-3">{pkg.subtitle}</p>
        )}

        {/* Price */}
        <div className="mb-4">
          <span className="text-2xl font-bold text-pink-400">{pkg.price}</span>
          <span className="text-sm text-white/50 ml-1">PLN</span>
          <span className="text-xs text-white/30 ml-1">
            /{pkg.priceType === "person" ? "os." : "szt."}
          </span>
        </div>

        {/* Features */}
        <ul className="flex-1 space-y-1.5 mb-4">
          {displayFeatures.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-white/60">
              <svg className="w-3.5 h-3.5 mt-0.5 text-pink-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {feature}
            </li>
          ))}
          {pkg.features.length > maxFeatures && (
            <li className="text-xs text-white/30 pl-5">
              +{pkg.features.length - maxFeatures} wi&#281;cej
            </li>
          )}
        </ul>

        {/* CTA */}
        <Link
          href="/#kontakt"
          className="btn-primary w-full justify-center text-sm !py-2.5"
        >
          Zarezerwuj
        </Link>
      </div>
    </div>
  );
}

export default function PackagesSection() {
  return (
    <section id="pakiety" className="relative overflow-hidden py-[var(--section-padding)]">
      <div className="glow-orb absolute -top-40 -right-40" />

      <div className="max-w-[1200px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-tag">GOTOWE PAKIETY</span>
          <SquigglyLine />
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-semibold">
            Wybierz sw&oacute;j <em>pakiet</em>
          </h2>
          <p className="mt-3 text-white/45 max-w-lg mx-auto">
            Gotowe pakiety na niezapomniany wiecz&oacute;r panie&#324;ski. Ka&#380;dy szczeg&oacute;&#322; dopracowany do perfekcji.
          </p>
        </div>

        {/* Grid */}
        <ScrollReveal type="pricing">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
