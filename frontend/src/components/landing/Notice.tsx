"use client";

import { motion } from "framer-motion";
import { Info, Mail } from "lucide-react";

export function Notice() {
  return (
    <section className="py-16 px-6 bg-[#f5f5f7]">
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-[#0071e3] to-[#34aadc]" />

          <div className="p-8 sm:p-10">
            {/* Icon + Title */}
            <div className="flex items-start gap-4 mb-5">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#f0f7ff] flex items-center justify-center">
                <Info className="w-5 h-5 text-[#0071e3]" strokeWidth={1.8} />
              </div>
              <div>
                <h2 className="text-[17px] font-semibold text-[#1d1d1f] leading-snug">
                  Hinweis zur Serviceseite
                </h2>
                <p className="text-sm text-[#6e6e73] mt-0.5">Stand: April 2025</p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#f0f0f0] mb-6" />

            {/* Content */}
            <p className="text-[15px] text-[#3d3d3f] leading-relaxed mb-2">
              Unsere Haupt-Serviceseite befindet sich derzeit in Bearbeitung.
            </p>
            <p className="text-[15px] text-[#6e6e73] leading-relaxed mb-7">
              Reparaturaufträge sowie Fragen zu Reparaturen können Sie gerne per E-Mail stellen:
            </p>

            {/* Email CTA */}
            <a
              href="mailto:handyundpcservice@gmail.com"
              className="group inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-[#f5f5f7] hover:bg-[#e8f0fd] border border-transparent hover:border-[#0071e3]/20 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-[#0071e3] flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-white" strokeWidth={1.8} />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] text-[#6e6e73] font-medium">E-Mail schreiben</span>
                <span className="text-[15px] font-semibold text-[#0071e3] group-hover:underline">
                  handyundpcservice@gmail.com
                </span>
              </div>
              <span className="ml-auto text-[#0071e3] group-hover:translate-x-0.5 transition-transform duration-200">→</span>
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
