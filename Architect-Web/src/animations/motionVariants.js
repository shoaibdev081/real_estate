import { easeOut } from 'framer-motion'

export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export const fadeInScale = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const hoverScale = {
  rest: { scale: 1 },
  hover: {
    scale: 1.03,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
}

