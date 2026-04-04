import Image from "next/image";
import Link from "next/link";
import atrakcje from "@/data/atrakcje.json";
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

const displayItems = (atrakcje as Product[]).slice(0, 12);

function ActivityCard({ item }: { item: Product }) {
  return (
    <Link
      href={`/atrakcje/${item.slug}`}
      className="glass-card overflow-hidden group flex flex-col"
    >
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {/* Price badge */}
        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1">
          <span className="text-sm font-bold text-pink-400">{item.price}</span>
          <span className="text-xs text-white/50 ml-0.5">
            PLN/{item.priceType === "person" ? "os." : "szt."}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-[family-name:var(--font-display)] text-base font-semibold leading-snug mb-1 group-hover:text-pink-400 transition-colors">
          {item.name}
        </h3>
        {item.subtitle && (
          <p className="text-xs text-white/40">{item.subtitle}</p>
        )}
      </div>
    </Link>
  );
}

export default function ActivitiesSection() {
  return (
    <section id="atrakcje" className="relative overflow-hidden py-[var(--section-padding)]">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-tag">POJEDYNCZE ATRAKCJE</span>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-semibold">
            Dopasuj sw&oacute;j <em>wiecz&oacute;r</em>
          </h2>
          <p className="mt-3 text-white/45 max-w-lg mx-auto">
            Wybierz pojedyncze atrakcje i stw&oacute;rz w&#322;asny, niepowtarzalny plan wieczoru panie&#324;skiego.
          </p>
        </div>

        {/* Grid */}
        <ScrollReveal type="activity-stagger">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayItems.map((item) => (
              <ActivityCard key={item.id} item={item} />
            ))}
          </div>
        </ScrollReveal>

        {/* See all button */}
        <div className="text-center mt-10">
          <Link href="/atrakcje" className="btn-outline">
            Zobacz wszystkie atrakcje
          </Link>
        </div>
      </div>
    </section>
  );
}
