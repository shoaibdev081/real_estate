import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import TitleBadge from '../common/TitleBadge'
import { HiOutlineArrowSmallRight } from 'react-icons/hi2'

import { fadeInUp, fadeInScale, staggerContainer, hoverScale } from '../../animations/motionVariants'
import { apiRequest, getImageUrl } from '../../lib/apiClient'
import { servicesData } from '../../data/servicesData'

function mapServiceData(item) {
  return {
    id: item._id,
    title: item.title,
    detailId: item.slug || item._id,
    description: item.desc,
    image: getImageUrl(item.image),
  }
}


function ServiceSection() {
  const navigate = useNavigate()
  const defaultServices = (servicesData || []).map(mapServiceData)
  const [services, setServices] = useState(defaultServices)
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true)
        const res = await apiRequest('/services')
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setServices(res.data.map(mapServiceData))
        }
      } catch (err) {
        console.warn('Could not fetch services from API, using default services:', err?.message || err)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  const activeService = services[activeIndex] || {}

  if (loading) {
    return <div className="py-20 text-center text-xl">Loading services...</div>
  }
  if (!services.length) {
    return <div className="py-20 text-center text-xl">No services found.</div>
  }

  return (
    <section className='relative'>
      {/* Top Header Section - Responsive like Intro */}
      <div className='relative py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-white w-full'>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className='max-w-7xl mx-auto'
        >
          <div className='flex flex-col lg:flex-row items-start gap-6 lg:gap-8'>
            <div className='flex'>
              <div className='flex py-5'>
                <TitleBadge
                  text={'OUR SERVICES'}
                  className={'text-black z-10'}
                />
              </div>
            </div>
            <motion.div variants={fadeInUp} className='flex-1 w-full'>
              <div className='border-l border-l-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl px-4 sm:px-6 font-bold'>
                <span>Explore our </span>
                <span className='text-(--brand-camel)'>comprehensive interior</span>
                <span className='block'>design services</span>
              </div>
              <div className='pl-4 sm:pl-6 lg:pl-8'>
                <p className='max-w-lg text-gray-500 pt-4 sm:pt-5 text-sm sm:text-base'>
                  We specialize in transforming visions into reality.
                  Explore our portfolio of innovative architectural and interior design projects crafted with precision.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Interactive Services Section */}
      <div className='py-12 px-6 lg:px-15 bg-gray-50'>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className='max-w-7xl mx-auto'
        >
          {/* Main Grid: Image Left, Services Right */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center'>
            {/* Left: Image with Description */}
            <motion.div variants={fadeInScale} className='order-2 lg:order-1'>
              <motion.div
                variants={hoverScale}
                initial="rest"
                whileHover="hover"
                className='relative w-full rounded-xl overflow-hidden shadow-lg'
              >
                {/* Image */}
                <motion.img
                  src={activeService.image || '/images/service-1.jpg'}
                  alt={activeService.title}
                  className='w-full h-70 md:h-87.5 lg:h-112.5 object-cover transition-all duration-500'
                  variants={fadeInScale}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/service-1.jpg';
                  }}
                />

                {/* Description with Glassy Background */}
                <div className='absolute bottom-6 left-6 right-6 bg-gray-700/70 backdrop-blur-md px-6 lg:px-8 py-5 lg:py-6 rounded-lg'>
                  <p className='text-white text-sm lg:text-base leading-relaxed'>
                    {activeService.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Services List */}
            <motion.div variants={fadeInUp} className='order-1 lg:order-2'>
              <div className={`space-y-0 ${services.length > 6 ? 'max-h-96 overflow-y-auto scrollbar-hidden' : ''}`}>
                {services.map((service, index) => {
                  const isActive = index === activeIndex

                  return (
                    <motion.div
                      key={service.id}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => navigate(`/services/${service.detailId}`)}
                      className='group cursor-pointer transition-all duration-300'
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      <div className='flex items-center justify-between py-5 px-4 lg:px-6'>
                        {/* Title */}
                        <h3
                          className={`text-lg md:text-2xl lg:text-2xl font-bold capitalize flex-1 transition-colors duration-300
                            ${isActive ? 'text-(--brand-camel)' : 'text-gray-800 group-hover:text-(--brand-camel)'}
                          `}
                        >
                          {service.title}
                        </h3>

                        {/* Arrow Icon - Top Right with Transition */}
                        <div
                          className={`shrink-0 ml-4 transition-all duration-300 transform
                            ${isActive ? 'translate-x-6' : 'translate-x-0'}
                          `}
                        >
                          <HiOutlineArrowSmallRight
                            className={`-rotate-45 transition-colors duration-300
                              ${isActive ? 'bg-(--brand-camel) text-white' : 'bg-gray-300 text-gray-600 group-hover:bg-(--brand-camel) group-hover:text-white'}
                            `}
                            size={30}
                            style={{ padding: '4px', borderRadius: '50%' }}
                          />
                        </div>
                      </div>
                      {/* Bottom Border Line */}
                      <div className={`h-px transition-all duration-300
                        ${isActive ? 'bg-(--brand-camel)' : 'bg-gray-200 group-hover:bg-(--brand-camel)'}
                      `} />
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ServiceSection