import HeroSection from "@/components/HeroSection";
import TransitionBeam from "@/components/TransitionBeam";
import PackagesSection from "@/components/PackagesSection";
import FeaturedSection from "@/components/FeaturedSection";
import ActivitiesSection from "@/components/ActivitiesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import PageLoader from "@/components/PageLoader";

export default function Home() {
  return (
    <>
      <PageLoader />
      <HeroSection />
      <FeaturedSection />
      <PackagesSection />
      <ActivitiesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
