import pakiety from "@/data/pakiety.json";
import pakietyNaWieczor from "@/data/pakiety-na-wieczor.json";
import PackageDetailClient from "./PackageDetailClient";

export function generateStaticParams() {
  const all = [...pakiety, ...pakietyNaWieczor];
  return all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = [...pakiety, ...pakietyNaWieczor];
  const pkg = all.find((p) => p.slug === slug);
  if (!pkg) return { title: "Pakiet nie znaleziony" };
  return {
    title: `${pkg.name} — Wieczór Panieński Warszawa | The Hen Experience`,
    description: pkg.description
      ? pkg.description.slice(0, 160)
      : `Pakiet ${pkg.name} — ekskluzywny wieczór panieński w Warszawie. Sprawdź szczegóły i zarezerwuj online.`,
    openGraph: {
      title: `${pkg.name} — The Hen Experience`,
      description: pkg.description?.slice(0, 160) || `Pakiet ${pkg.name} w Warszawie`,
      images: pkg.images[0] ? [{ url: pkg.images[0] }] : [],
    },
  };
}

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PackageDetailClient slug={slug} />;
}
