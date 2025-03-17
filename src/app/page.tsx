import HeroSection from "@/components/myComponents/hero";
import CTA from "@/components/myComponents/heroSubComp/cta";
import FaqsSection from "@/components/myComponents/heroSubComp/faqSection";
import Features from "@/components/myComponents/heroSubComp/features";
import HowItWorks from "@/components/myComponents/heroSubComp/howItWork";
import IndustriesStat from "@/components/myComponents/heroSubComp/IndustriesStat";
import Testimonials from "@/components/myComponents/heroSubComp/testimonials";


export default function Home() {
  return (
    <>
      <div className="grid-background"> </div>

      <div>
        <HeroSection />
      </div>

      {/* Features Page */}
      <Features/>

      {/* Industries Stat */}
      <IndustriesStat/>

      {/* How It Works Section */}
      <HowItWorks/>


      {/* testimonials */}
      <Testimonials/>

     {/* Faqs */}
     <FaqsSection/>

     {/* CTA */}
     <CTA/>

    </>
  );
}
