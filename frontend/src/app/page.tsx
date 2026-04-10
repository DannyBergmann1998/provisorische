import { Metadata }  from "next";
import { Navbar }    from "@/components/ui/Navbar";
import { Hero }      from "@/sections/Hero";
import { Services }  from "@/sections/Services";
import { Pricing }   from "@/sections/Pricing";
import { Trust }     from "@/sections/Trust";
import { CTA }       from "@/sections/CTA";
import { Notice }    from "@/sections/Notice";
import { Download }  from "@/sections/Download";
import { Footer }    from "@/sections/Footer";

export const metadata: Metadata = {
  title: "Handy & PC Service – Professionelle Reparaturen",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Pricing />
        <Trust />
        <CTA />
        <Notice />
        <Download />
      </main>
      <Footer />
    </>
  );
}
