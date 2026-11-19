import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import TitleBadge from '../common/TitleBadge'
import PrimaryButton from '../common/Button/PrimaryButton'
import { fadeInUp, fadeInScale, staggerContainer } from '../../animations/motionVariants'
import { getImageUrl } from '../../lib/apiClient'

function Hero({ onHeadingChange, heroData }) {
  const defaultHeadings = [
    { top: "Find Your Inspired", bottom: "Interior Design" },
    { top: "Build Your Dream", bottom: "Spaces" },
    { top: "Design For Life", bottom: "Excellence" }
  ]

  const defaultImages = [
    '/images/hero-bg.webp',
    '/images/hero-bg2.webp',
    '/images/hero-bg-3.webp'
  ]

  const defaultStats = [
    { number: "360 +", text: "Successful Projects And Counting" },
    { number: "260 +", text: "Completed Designs And Projects" },
    { number: "400 +", text: "Satisfied Clients Worldwide" }
  ]

  const slides = heroData?.slides && heroData.slides.length > 0 ? heroData.slides : null

  const heroHeadings = slides
    ? slides.map(s => ({ top: s.topHeading, bottom: s.bottomHeading }))
    : defaultHeadings

  const heroImages = slides
    ? slides.map(s => getImageUrl(s.thumbImage || s.bgImage))
    : defaultImages

  const heroStats = slides
    ? slides.map(s => ({ number: s.statNumber, text: s.statText }))
    : defaultStats

  const badgeText = heroData?.badge || "Fast and Reliable"
  const subtitle = heroData?.description || "Whether it's your home, office, or a commercial project, we are always dedicated to bringing your vision to life."
  const buttonText = heroData?.buttonText || "Take Counsel"
  const buttonLink = heroData?.buttonLink || "/contact"
  const features = heroData?.features && heroData.features.length > 0
    ? heroData.features
    : ["Tech Specifications", "Design Project", "3D Visualization"]

  const [currentHeading, setCurrentHeading] = useState(0)

  useEffect(() => {
    const headingInterval = setInterval(() => {
      setCurrentHeading(prev => {
        const next = (prev + 1) % heroHeadings.length
        return next
      })
    }, 3000)

    return () => {
      clearInterval(headingInterval)
    }
  }, [heroHeadings.length])

  useEffect(() => {
    onHeadingChange && onHeadingChange(currentHeading)
  }, [currentHeading, onHeadingChange])

  // Safeguard if currentHeading exceeds bounds
  const headingIdx = currentHeading < heroHeadings.length ? currentHeading : 0

  return (
    <div className="text-white w-full">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-4 sm:pt-8 md:pt-12 lg:pt-20 flex flex-col lg:flex-row min-h-96 sm:min-h-[600px] md:min-h-[700px] lg:min-h-screen xl:min-h-[85vh] 2xl:min-h-[50vh] justify-center lg:justify-between items-center lg:items-start"
      >
        <motion.div
          variants={fadeInUp}
          className='shrink-0 w-full lg:w-auto text-center lg:text-left'
        >
          <div className='flex justify-center lg:justify-start'>
            <TitleBadge
              text={badgeText}
              className={'bg-black/30'}
            />
          </div>
          <motion.div
            key={headingIdx}
            variants={fadeInUp}
            className='font-bold text-2xl sm:text-3xl md:text-4xl lg:text-6xl transition-opacity duration-700 leading-tight max-w-full break-words'
          >
            {heroHeadings[headingIdx]?.top}
            <span className='block'>{heroHeadings[headingIdx]?.bottom}</span>
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className='pl-4 sm:pl-6 md:pl-8 pt-4 sm:pt-5 flex flex-col gap-3 lg:items-start items-center'
          >
            <p className='max-w-md text-sm sm:text-base font-semibold'>
              {subtitle}
            </p>
            <PrimaryButton
              text={buttonText}
              href={buttonLink}
              className={'self-center lg:self-start'}
            />
          </motion.div>
        </motion.div>
        <motion.div
          variants={fadeInScale}
          className='pt-8 sm:pt-10 lg:pt-32 flex gap-4 justify-end hidden lg:flex'
        >
          <div className='w-52 h-52 flex flex-col gap-2 border border-white/20 p-3 rounded-xl bg-gray-500/30 backdrop-blur-md min-w-52 max-w-sm justify-center transition-opacity duration-700'>
            <span className='font-bold text-xl'>{heroStats[headingIdx]?.number}</span>
            <span className='block text-sm'>{heroStats[headingIdx]?.text}</span>
            <div className='font-semibold text-xs pt-1'>
              {features.map((feat, i) => (
                <span key={i} className='block'>{feat}</span>
              ))}
            </div>
          </div>
          <motion.div
            variants={fadeInScale}
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className='shrink-0'
          >
            <img
              src={heroImages[headingIdx] || '/images/hero-bg.webp'}
              className='w-52 h-52 object-cover rounded-2xl transition-all duration-700'
              alt='hero thumbnail'
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Hero