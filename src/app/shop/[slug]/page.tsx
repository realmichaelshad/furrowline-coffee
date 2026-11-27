import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS, getProduct, isCoffee } from "@/content/products";
import { ProductDetail } from "@/components/pdp/ProductDetail";

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  const roasted = isCoffee(product) ? product.facts.find((f) => f.label === "Roasted")?.value.replace("&", "and") : undefined;
  const detail = isCoffee(product) ? `${product.originLabel}, ${product.processLabel.toLowerCase()}, roasted ${roasted ?? "twice a week"}.` : null;
  return {
    title: product.name,
    description: detail ? `${product.tagline} ${detail}` : product.tagline,
    alternates: { canonical: `/shop/${product.slug}` },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
