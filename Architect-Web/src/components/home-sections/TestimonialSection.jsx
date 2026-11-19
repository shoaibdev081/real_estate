import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TitleBadge from '../common/TitleBadge'
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { fadeInUp, fadeInScale, staggerContainer } from '../../animations/motionVariants'
import { apiRequest, getImageUrl } from '../../lib/apiClient'

const DEFAULT_TESTIMONIALS = [
  {
    _id: 'default-1',
    name: 'Sarah Jenkins',
    role: 'CEO, Horizon Ventures',
    feedback: 'Monda Brothers completely revolutionized our corporate headquarters. Their attention to spatial harmony, lighting, and premium finishes exceeded every expectation. An absolute pleasure to partner with.',
    rating: 5.0,
    image: '/images/team-3.jpg'
  },
  {
    _id: 'default-2',
    name: 'David Sterling',
    role: 'Managing Director, Sterling Capital',
    feedback: 'From initial architectural sketches to the final turnkey handover, their team exhibited unparalleled professionalism and creativity. Our luxury villa project was delivered ahead of schedule and within budget.',
    rating: 5.0,
    image: '/images/team-4.jpg'
  },
  {
    _id: 'default-3',
    name: 'Elena Rostova',
    role: 'Lead Architect & Designer',
    feedback: 'As an architect myself, I hold extremely high standards for design detailing and material integrity. Monda Brothers delivered immaculate millwork and structural craftsmanship that truly impressed me.',
    rating: 4.9,
    image: '/images/team-5.jpg'
  },
  {
    _id: 'default-4',
    name: 'Michael Chen',
    role: 'Private Estate Owner',
    feedback: 'The interior layout and modern aesthetics created for our residence are breathtaking. They listened carefully to all our family needs and translated them into an inspiring living sanctuary.',
    rating: 5.0,
    image: '/images/team-6.jpg'
  }
]

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        setLoading(true)
        const res = await apiRequest('/client-reviews')
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setTestimonials(res.data)
        }
      } catch (err) {
        // Fallback to default testimonials
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  // Auto-rotate testimonials every 5 seconds (pauses on hover)
  useEffect(() => {
    if (!testimonials.length || isPaused) return
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length, isPaused])

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const renderStars = (rating) => {
    const numRating = Number(rating) || 5
    return (
      <div className='flex items-center gap-1'>
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            size={14}
            className={i < Math.round(numRating) ? 'text-amber-400' : 'text-gray-300'}
          />
        ))}
      </div>
    )
  }

  const activeTestimonial = testimonials[activeIndex] || DEFAULT_TESTIMONIALS[0]

  return (
    <section className='relative bg-white'>
      {/* Top Header Section */}
      <div className='relative py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-white w-full'>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className='max-w-7xl 2xl:max-w-[1536px] mx-auto'
        >
          <div className='flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8'>
            <div className='flex justify-center lg:justify-start'>
              <div className='flex py-5'>
                <TitleBadge
                  text={'WHAT OUR CLIENTS SAY'}
                  className={'text-black z-10'}
                />
              </div>
            </div>
            <motion.div variants={fadeInUp} className='flex-1 w-full text-center lg:text-left'>
              <div className='border-l border-l-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl px-4 sm:px-6 font-bold'>
                <span>Testimonials from </span>
                <span className='text-(--brand-camel)'>satisfied clients</span>
                <span className='block'>around the world</span>
              </div>
              <div className='pl-4 sm:pl-6 lg:pl-8'>
                <p className='max-w-lg text-gray-500 pt-4 sm:pt-5 text-sm sm:text-base'>
                  Read what our clients have to say about their experience working with us and how we transformed their spaces.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Testimonial Section */}
      <div className='py-8 sm:py-12 px-4 sm:px-6 md:px-8 lg:px-12 bg-gray-50 w-full'>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className='max-w-7xl 2xl:max-w-[1536px] mx-auto'
        >
          {/* Main Grid: Image Left, Review Right */}
          <div
            className='grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center'
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Left: Featured Architectural Image */}
            <motion.div variants={fadeInScale} className='order-2 lg:order-1'>
              <div className='relative w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100'>
                <motion.img
                  src='/images/gallery-1.jpg'
                  alt='testimonial background'
                  className='w-full h-56 sm:h-72 md:h-88 lg:h-100 object-cover'
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = '/images/service-1.jpg'
                  }}
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none' />
                <div className='absolute bottom-4 left-4 right-4 text-white text-xs sm:text-sm font-medium bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl inline-flex items-center gap-2'>
                  <span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse' />
                  Verified Client Projects & Interiors
                </div>
              </div>
            </motion.div>

            {/* Right: Review Content with Smooth AnimatePresence */}
            <motion.div variants={fadeInUp} className='order-1 lg:order-2'>
              <div className='space-y-6'>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTestimonial._id || activeIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className='space-y-6'
                  >
                    {/* Rating Section */}
                    <div className='flex items-center gap-4 sm:gap-6'>
                      <div className='shrink-0'>
                        <p className='text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900'>
                          {Number(activeTestimonial.rating || 5).toFixed(1)}
                        </p>
                      </div>

                      <div className='flex-1'>
                        <div className='inline-flex items-center gap-2 bg-gray-900 text-white rounded-full px-4 py-1.5 shadow-sm'>
                          {renderStars(activeTestimonial.rating)}
                          <span className='text-xs font-semibold text-amber-400'>
                            {Number(activeTestimonial.rating || 5).toFixed(1)} / 5.0
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Feedback Text */}
                    <div className='relative'>
                      <span className='text-5xl sm:text-6xl text-(--brand-camel)/30 font-serif absolute -top-5 -left-3 select-none pointer-events-none'>
                        “
                      </span>
                      <p className='text-base sm:text-lg md:text-xl text-gray-800 leading-relaxed font-medium pt-2 pl-3'>
                        {activeTestimonial.feedback}
                      </p>
                    </div>

                    {/* Client Info */}
                    <div className='flex items-center gap-4 pt-4 border-t border-gray-200'>
                      <div className='w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shrink-0 shadow-md border-2 border-(--brand-camel)/40 bg-gray-100 flex items-center justify-center'>
                        {activeTestimonial.image ? (
                          <img
                            src={getImageUrl(activeTestimonial.image)}
                            alt={activeTestimonial.name}
                            className='w-full h-full object-cover'
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = '/images/team-3.jpg'
                            }}
                          />
                        ) : (
                          <span className='text-xl sm:text-2xl font-bold text-gray-700'>
                            {activeTestimonial.name?.[0] || '?'}
                          </span>
                        )}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h3 className='text-base sm:text-lg font-bold text-gray-900 truncate'>
                          {activeTestimonial.name}
                        </h3>
                        <p className='text-gray-500 text-xs sm:text-sm truncate'>
                          {activeTestimonial.role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Controls: Pagination Dots + Prev/Next Buttons */}
                {testimonials.length > 1 && (
                  <div className='flex items-center justify-between pt-2'>
                    {/* Dots */}
                    <div className='flex items-center gap-2'>
                      {testimonials.map((_, i) => (
                        <button
                          key={i}
                          type='button'
                          onClick={() => setActiveIndex(i)}
                          className={`h-2.5 rounded-full transition-all duration-300 ${
                            i === activeIndex
                              ? 'w-8 bg-(--brand-camel)'
                              : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                          }`}
                          aria-label={`Go to slide ${i + 1}`}
                        />
                      ))}
                    </div>

                    {/* Arrows */}
                    <div className='flex items-center gap-2'>
                      <button
                        type='button'
                        onClick={handlePrev}
                        className='w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors shadow-sm'
                        aria-label='Previous testimonial'
                      >
                        <FaChevronLeft size={12} />
                      </button>
                      <button
                        type='button'
                        onClick={handleNext}
                        className='w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors shadow-sm'
                        aria-label='Next testimonial'
                      >
                        <FaChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
