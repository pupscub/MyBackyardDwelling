
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
// import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        {/* TestimonialsSection commented out */}
        {/* Add just the CTA button instead */}
        <section id="cta-section" className="py-20 bg-white relative overflow-hidden">
          <div className="absolute top-1/3 right-0 w-64 h-64 bg-brand-100 rounded-full opacity-50 blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/70 rounded-full opacity-50 blur-3xl -z-10" />
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center">
              <a 
                href="/contact#get-in-touch" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-500 text-white font-medium transition-standard hover:bg-brand-600 hover:shadow-md"
              >
                Start Your ADU Journey Today
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
