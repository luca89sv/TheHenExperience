import atrakcje from "@/data/atrakcje.json";
import ActivityDetailClient from "./ActivityDetailClient";

export function generateStaticParams() {
  return atrakcje.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = atrakcje.find((a) => a.slug === slug);
  if (!item) return { title: "Atrakcja nie znaleziona" };
  return {
    title: `${item.name} — Atrakcja na Wieczór Panieński | The Hen Experience`,
    description: item.description
      ? item.description.slice(0, 160)
      : `${item.name} — atrakcja na wieczór panieński w Warszawie. Sprawdź szczegóły i zarezerwuj.`,
    openGraph: {
      title: `${item.name} — The Hen Experience`,
      description: item.description?.slice(0, 160) || `${item.name} w Warszawie`,
      images: item.images[0] ? [{ url: item.images[0] }] : [],
    },
  };
}

export default async function ActivityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ActivityDetailClient slug={slug} />;
}
