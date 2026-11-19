import React from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '../../animations/motionVariants'

function TitleBadge({ text, className }) {
    return (
        <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            className={`px-4 py-1.5 text-xs font-bold uppercase rounded-2xl border border-gray-300 ${className}`}
        >
             <span className="inline-block w-1.5 h-1.5 bg-(--brand-camel) rounded-full mx-1 mb-0.5"></span>
            {text}
        </motion.div>
    )
}

export default TitleBadge