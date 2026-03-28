/**
 * Reusable animation presets following Apple/Stripe design principles
 * All durations: 150-300ms, easing: ease-out/ease-in-out
 */

export const animationPresets = {
  // Fade in animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: "easeOut" },
  },

  // Fade in + slide up (common hero animation)
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.4, ease: "easeOut" },
  },

  // Fade in + slide down (for top elements)
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: "easeOut" },
  },

  // Staggered container (for lists/grids)
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  },

  // Individual stagger item
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" },
  },

  // Hover lift effect (for cards)
  hoverLift: {
    whileHover: { y: -4 },
    transition: { duration: 0.2, ease: "easeOut" },
  },

  // Scale hover (for interactive elements)
  hoverScale: {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.97 },
    transition: { duration: 0.2, ease: "easeOut" },
  },

  // Button press effect
  pressEffect: {
    whileTap: { scale: 0.96 },
    transition: { duration: 0.15, ease: "easeOut" },
  },

  // Image zoom on hover
  imageZoom: {
    whileHover: { scale: 1.05 },
    transition: { duration: 0.3, ease: "easeOut" },
  },

  // Shake animation (for errors - very subtle)
  shake: {
    animate: {
      x: [0, -2, 2, -2, 2, 0],
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
  },

  // Page transition fade + slide
  pageTransition: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3, ease: "easeOut" },
  },

  // Glow effect on focus (for inputs)
  focusGlow: {
    boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.1), 0 0 0 1px rgba(37, 99, 235, 0.2)",
  },
};

/**
 * Stagger configuration for multiple items
 * Use with variants prop on Motion component
 */
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/**
 * Easing presets
 */
export const easings = {
  smooth: "easeOut",
  natural: "easeInOut",
  snappy: "easeOut",
};

/**
 * Duration presets (in seconds)
 */
export const durations = {
  instant: 0.15,
  fast: 0.2,
  normal: 0.3,
  slow: 0.4,
};
