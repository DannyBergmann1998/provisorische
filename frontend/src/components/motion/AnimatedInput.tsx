"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * Input field with focus glow effect
 * Shows subtle error shake on validation error
 */
export function AnimatedInput({
  label,
  error,
  className = "",
  ...props
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      animate={error ? { x: [0, -2, 2, -2, 2, 0] } : {}}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {label && (
        <label className="block text-sm text-gray-700 dark:text-[#E0E0E0] mb-2 font-medium">
          {label}
        </label>
      )}
      <motion.input
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        animate={
          isFocused
            ? {
                boxShadow:
                  "0 0 0 3px rgba(37, 99, 235, 0.1), 0 0 0 1px rgba(37, 99, 235, 0.5)",
              }
            : {
                boxShadow: "0 0 0 0 rgba(37, 99, 235, 0)",
              }
        }
        transition={{ duration: 0.2 }}
        className={`input-field transition-shadow ${className}`}
        {...props}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-600 dark:text-red-400 text-sm mt-1"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}
