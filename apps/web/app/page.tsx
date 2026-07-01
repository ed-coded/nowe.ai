import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturedListings from "@/components/landing/FeaturedListings";
import TrustSection from "@/components/landing/TrustSection";
import AgentCTASection from "@/components/landing/AgentCTASection";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <FeaturedListings />
      <TrustSection />
      <AgentCTASection />
      <Footer />
    </main>
  );
}
