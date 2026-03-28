"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  href?: string;
}

/**
 * Button with subtle hover scale and press effect
 * Uses GPU-optimized transform instead of size changes
 */
export function AnimatedButton({
  children,
  className = "",
  onClick,
  disabled = false,
  type = "button",
  href,
}: AnimatedButtonProps) {
  const commonProps = {
    whileHover: disabled ? undefined : { scale: 1.03 },
    whileTap: disabled ? undefined : { scale: 0.97 },
    transition: { duration: 0.2, ease: "easeOut" },
    className,
    onClick,
    disabled,
  };

  if (href) {
    return (
      <motion.a href={href} {...commonProps}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} {...commonProps}>
      {children}
    </motion.button>
  );
}
