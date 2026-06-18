import HeroSection from "@/components/HeroSection";
import TransitionBeam from "@/components/TransitionBeam";
import PackagesSection from "@/components/PackagesSection";
import FeaturedSection from "@/components/FeaturedSection";
import ActivitiesSection from "@/components/ActivitiesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <>
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
