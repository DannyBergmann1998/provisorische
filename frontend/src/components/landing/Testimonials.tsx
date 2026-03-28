"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/motion";

const reviews = [
  {
    name:   "Maria K.",
    rating: 5,
    text:   "Mein iPhone-Display war kaputt. Nach 2 Stunden war es wie neu – und der Preis war absolut fair. Klare Empfehlung!",
    device: "iPhone 14 Display-Tausch",
    avatar: "M",
  },
  {
    name:   "Thomas B.",
    rating: 5,
    text:   "PS5 HDMI-Port repariert. Andere hätten das Gerät nicht mal angeschaut, hier hat es super funktioniert. Super Service!",
    device: "PS5 HDMI-Port Reparatur",
    avatar: "T",
  },
  {
    name:   "Sandra M.",
    rating: 5,
    text:   "Laptop hatte Wasserschaden, ich dachte er ist weg. Zwei Tage später lief er wieder problemlos. Unglaublich!",
    device: "Laptop Wasserschaden",
    avatar: "S",
  },
  {
    name:   "Klaus W.",
    rating: 5,
    text:   "Altes Samsung gut verkauft, faire Abwicklung und sofortige Auszahlung. Werde wieder kommen!",
    device: "Samsung Ankauf",
    avatar: "K",
  },
  {
    name:   "Jana L.",
    rating: 5,
    text:   "Akku-Tausch für mein Huawei. Günstig, schnell und der Akku hält jetzt wieder den ganzen Tag. Danke!",
    device: "Huawei Akku-Tausch",
    avatar: "J",
  },
  {
    name:   "Michael R.",
    rating: 5,
    text:   "PC total langsam, Viren überall. Jetzt läuft er wie am ersten Tag. Professionell und preiswert!",
    device: "PC Viren-Entfernung",
    avatar: "M",
  },
];

export function Testimonials() {
  return (
    <section className="section bg-gray-50 dark:bg-[#262626] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Kundenstimmen
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-black dark:text-white mb-4">
            Das sagen unsere Kunden
          </h2>
          <div className="flex items-center justify-center gap-2 text-yellow-400">
            {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
            <span className="text-black dark:text-white font-semibold ml-2">4.9 / 5</span>
            <span className="text-gray-600 dark:text-[#A0A0A0]">(200+ Bewertungen)</span>
          </div>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map(({ name, rating, text, device, avatar }) => (
            <StaggerItem key={name + device}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="card-hover relative"
              >
              <Quote size={24} className="text-gray-200 dark:text-gray-700 absolute top-4 right-4" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center font-bold text-white dark:text-black text-sm">
                  {avatar}
                </div>
                <div>
                  <p className="font-semibold text-black dark:text-white text-sm">{name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{device}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(rating)].map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-400" fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-[#E0E0E0] text-sm leading-relaxed">{text}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
