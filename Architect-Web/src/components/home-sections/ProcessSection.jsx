import React from 'react'
import { motion } from 'framer-motion'
import TitleBadge from '../common/TitleBadge'
import { useNavigate } from 'react-router-dom'
import { fadeInUp, fadeInScale, staggerContainer } from '../../animations/motionVariants'

const processes = [
  {
    id: 1,
    number: '01',
    title: 'Initial Consultation',
    description: 'We begin by understanding your vision, goals, and needs, followed by Monda brothers.',
    image: '/images/gallery-1.jpg'
  },
  {
    id: 2,
    number: '02',
    title: 'Design & Planning',
    description: 'Our team creates detailed designs that reflect your requirements.',
    image: '/images/gallery-3.jpg'
  },
  {
    id: 3,
    number: '03',
    title: 'Implementation',
    description: 'With carefully selected contractors, we manage every phase.',
    image: '/images/gallery-4.jpg'
  },
  {
    id: 4,
    number: '04',
    title: 'Project Handover',
    description: 'Upon completion, we conduct a thorough review, making sure all details.',
    image: '/images/gallery-6.jpg'
  }
]

function ProcessSection() {
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate('/contact')
  }

  return (
    <section className='relative py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-cover bg-center bg-no-repeat' style={{ backgroundImage: "url(/images/intro-bg.avif)" }}>
      <div className='absolute inset-0 bg-white/90' />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className='relative z-10 max-w-7xl 2xl:max-w-[1536px] mx-auto flex flex-col gap-16'
      >

        {/* Row 1: Only Image */}
        <div className='flex justify-center'>
          <motion.div
            variants={fadeInScale}
            className='w-75 md:w-125 lg:w-175 rounded-2xl overflow-hidden'
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <img src='/images/h1-banner02.png' alt='floor plan' className='w-full h-full object-cover' />
          </motion.div>
        </div>

        {/* Row 2: Text content */}
        <div className='flex flex-col lg:flex-row items-start gap-6 lg:gap-8'>
          <div className='flex'>
            <div className='flex py-5'>
              <TitleBadge
                text={'HOW WE WORK'}
                className={'text-black z-10'}
              />
            </div>
          </div>
          <motion.div variants={fadeInUp} className='flex-1 w-full'>
            <div className='border-l border-l-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl px-4 sm:px-6 font-bold'>
              <span>Our </span>
              <span className='text-(--brand-camel)'>Step-by-Step</span>
              <span className='block'>Process</span>
            </div>
            <div className='pl-4 sm:pl-6 lg:pl-8'>
              <p className='max-w-lg text-gray-500 pt-4 sm:pt-5 text-sm sm:text-base'>
                We carefully plan, design, and execute every project. Each stage ensures quality, creativity, and efficiency for our clients. Our process is adaptive and transparent so that you always know what's happening at every step.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Row 3: Staggered Cards */}
        <div className='flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8'>
          {processes.map((process, index) => {
            const offsets = ['lg:mt-0', 'lg:mt-0', 'lg:mt-8', 'lg:mt-14']
            const offsetClass = offsets[index] ?? 'lg:mt-0'
            return (
              <motion.div
                key={process.id}
                variants={fadeInUp}
                className={`${offsetClass} flex-1`}
              >
                <motion.div
                  onClick={handleCardClick}
                  className='group cursor-pointer bg-gray-100 rounded-2xl shadow-lg overflow-visible p-3 transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl relative'
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {/* Card Image */}
                  <div className='overflow-hidden rounded-lg'>
                    <motion.img
                      src={process.image}
                      alt={process.title}
                      className='w-full h-44 md:h-48 lg:h-48 object-cover block'
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  </div>

                  {/* Card Text */}
                  <div className='px-4 pb-6 pt-4'>
                    <h3 className='text-lg md:text-xl font-bold text-gray-800'>{process.title}</h3>
                    <p className='text-gray-600 text-sm mt-2'>{process.description}</p>
                  </div>

                  {/* Shadowed Number */}
                  <span className='absolute bottom-3 right-4 text-6xl md:text-7xl lg:text-5xl font-bold text-gray-500 opacity-40 pointer-events-none'>
                    {process.number}
                  </span>
                </motion.div>
              </motion.div>
            )
          })}
        </div>

      </motion.div>
    </section>
  )
}

export default ProcessSection
