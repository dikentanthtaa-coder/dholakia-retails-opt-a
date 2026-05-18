import { Suspense } from "react";
import Hero from "@/components/home/Hero";
import IntroStatement from "@/components/home/IntroStatement";
import GuidingPrinciples from "@/components/home/GuidingPrinciples";
import CorporateSnapshot from "@/components/home/CorporateSnapshot";
import PortfolioPreview from "@/components/home/PortfolioPreview";
import BrandFilm from "@/components/home/BrandFilm";
import SustainabilityTeaser from "@/components/home/SustainabilityTeaser";
import NewsPreview from "@/components/home/NewsPreview";
import NewsPreviewSkeleton from "@/components/home/NewsPreviewSkeleton";
import FinalCTA from "@/components/home/FinalCTA";

// Allow the page to be served from the data cache for 5 minutes (NewsPreview
// uses 60s ISR internally; this enables the rest of the page to be cached as
// a single static unit between Sanity reads).
export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      <Hero />
      <IntroStatement />
      <GuidingPrinciples />
      <CorporateSnapshot />
      <PortfolioPreview />
      <BrandFilm />
      <SustainabilityTeaser />
      <Suspense fallback={<NewsPreviewSkeleton />}>
        <NewsPreview />
      </Suspense>
      <FinalCTA />
    </>
  );
}
