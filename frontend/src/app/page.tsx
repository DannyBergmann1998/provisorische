import { Metadata } from "next";
import { Navbar }   from "@/components/ui/Navbar";
import { Hero }     from "@/sections/Hero";
import { Notice }   from "@/sections/Notice";
import { Services } from "@/sections/Services";
import { Download } from "@/sections/Download";
import { Trust }    from "@/sections/Trust";
import { Footer }   from "@/sections/Footer";

export const metadata: Metadata = {
  title: "Handy & PC Service – Schnelle Reparaturen. Faire Preise.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Notice />
        <Services />
        <Download />
        <Trust />
      </main>
      <Footer />
    </>
  );
}
