"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hoverLift?: boolean;
}

/**
 * Card with fade-in + slide-up animation on load
 * Optional hover lift effect
 */
export function AnimatedCard({
  children,
  className = "",
  delay = 0,
  hoverLift = true,
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
        delay: delay * 0.08,
      }}
      whileHover={hoverLift ? { y: -4 } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
}
