import { Metadata } from "next";
import { Navbar }           from "@/components/ui/Navbar";
import { Hero }             from "@/components/landing/Hero";
import { TrustBar }         from "@/components/landing/TrustBar";
import { Services }         from "@/components/landing/Services";
import { RepairShopSplit }  from "@/components/landing/RepairShopSplit";
import { ProblemSection }   from "@/components/landing/ProblemSection";
import { HowItWorks }       from "@/components/landing/HowItWorks";
import { AboutSection }     from "@/components/sections/AboutSection";
import { Testimonials }     from "@/components/landing/Testimonials";
import { CTASection }       from "@/components/landing/CTASection";
import { Contact }          from "@/components/landing/Contact";
import { Footer }           from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Handy & PC Service – Reparatur, Ankauf & Online-Shop",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Services />
        <RepairShopSplit />
        <ProblemSection />
        <HowItWorks />
        <AboutSection />
        <Testimonials />
        <CTASection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
