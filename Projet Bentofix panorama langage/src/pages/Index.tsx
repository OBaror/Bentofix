import { PublicHeader } from "@/components/PublicHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { BentoGrid } from "@/components/landing/BentoGrid";
import { PricingSection } from "@/components/landing/PricingSection";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <HeroSection />
      <BentoGrid />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Index;
