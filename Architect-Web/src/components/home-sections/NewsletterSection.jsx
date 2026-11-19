import React, { useState } from 'react'
import { motion } from 'framer-motion'
import TitleBadge from '../common/TitleBadge'
import { HiOutlineArrowSmallRight } from 'react-icons/hi2'
import { fadeInUp, fadeInScale, staggerContainer } from '../../animations/motionVariants'
import { apiRequest } from '../../lib/apiClient'

function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError('')

    try {
      const response = await apiRequest('/newsletter/subscribe', {
        method: 'POST',
        body: { email }
      })

      console.log('Newsletter subscription response:', response);

      if (response.success) {
        setSubmitted(true)
        setEmail('')
        setTimeout(() => setSubmitted(false), 3000)
      } else {
        setError(response.message || 'Failed to subscribe')
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      })
      setError('Failed to subscribe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      className='relative py-20 md:py-28 lg:py-32 px-4 sm:px-6 md:px-8 lg:px-12 bg-cover bg-center bg-no-repeat'
      style={{ backgroundImage: "url(/images/intro-bg.avif)" }}
    >
      {/* Overlay */}
      <div className='absolute inset-0 bg-white/85' />

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className='relative z-10 max-w-4xl 2xl:max-w-5xl mx-auto text-center'
      >
        {/* Badge */}
        <div className='flex justify-center mb-8'>
          <TitleBadge
            text={'SUBSCRIBE TO THE NEWSLETTER'}
            className={'text-black'}
          />
        </div>

        {/* Heading */}
        <motion.h2
          variants={fadeInUp}
          className='text-4xl md:text-5xl lg:text-6xl font-bold mb-6'
        >
          <span>Join </span>
          <span className='text-(--brand-camel)'>Our Newsletter</span>
          <br />
          <span className='text-(--brand-camel)'>Stay</span>
          <span> Up To Date</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={fadeInUp}
          className='text-gray-600 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed'
        >
          Join our newsletter. Learn something new, gain access to exclusive content, and stay informed with the latest updates in the industry.
        </motion.p>

        {/* Email Form */}
        <motion.form
          variants={fadeInUp}
          onSubmit={handleSubmit}
          className='flex flex-row items-center justify-center gap-2 sm:gap-4'
        >
          {/* Email Input */}
          <input
            type='email'
            placeholder='Email address..'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='flex-1 px-4 sm:px-6 py-3 sm:py-4 text-gray-700 placeholder-gray-500 bg-transparent border-b-2 border-gray-400 focus:border-b-2 focus:border-(--brand-camel) outline-none transition-colors duration-300 text-sm sm:text-base'
          />

          {/* Arrow Button */}
          <motion.button
            type='submit'
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className='shrink-0 bg-(--brand-camel) hover:bg-opacity-80 transition-all duration-300 rounded-full p-2 sm:p-3 flex items-center justify-center disabled:opacity-50'
          >
            {loading ? (
              <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent'></div>
            ) : (
              <HiOutlineArrowSmallRight
                className='-rotate-45 text-white'
                size={20}
              />
            )}
          </motion.button>
        </motion.form>

        {/* Success Message */}
        {submitted && (
          <p className='text-(--brand-camel) font-semibold mt-4 text-sm md:text-base'>
            ✓ Thank you for subscribing!
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p className='text-red-600 font-semibold mt-4 text-sm md:text-base'>
            ⚠ {error}
          </p>
        )}
      </motion.div>
    </section>
  )
}

export default NewsletterSection
