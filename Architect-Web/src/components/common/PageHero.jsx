import React from 'react'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '../../animations/motionVariants'

export default function PageHero({ title, breadcrumb = [] }) {
  return (
    <div className="relative z-10 min-h-[350px] md:min-h-[420px] lg:min-h-[480px] flex items-center justify-center">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="text-center flex flex-col gap-6 px-6"
      >
        <motion.h1
          variants={fadeInUp}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
        >
          {title}
        </motion.h1>

        {breadcrumb.length > 0 && (
          <motion.div
            variants={fadeInUp}
            className="flex justify-center items-center gap-2 text-white text-sm md:text-base"
          >
            {breadcrumb.map((item, idx) => (
              <React.Fragment key={idx}>
                <span className="uppercase font-semibold">{item}</span>
                {idx < breadcrumb.length - 1 && (
                  <span className="text-gray-300">›</span>
                )}
              </React.Fragment>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
