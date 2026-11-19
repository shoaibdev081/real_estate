import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import TitleBadge from '../common/TitleBadge'
import { HiOutlineArrowSmallRight } from 'react-icons/hi2'
import { fadeInUp, fadeInScale, staggerContainer } from '../../animations/motionVariants'
import { apiRequest, getImageUrl } from '../../lib/apiClient'

function TeamSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch team data from backend
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await apiRequest('/team')
        // Map backend data to frontend format
        const mappedTeam = (response.data || []).map((member, index) => ({
          id: member._id,
          number: String(index + 1).padStart(2, '0'),
          name: member.name,
          position: member.role,
          image: getImageUrl(member.image) || '/images/team-3.jpg'
        }))
        setTeamMembers(mappedTeam)
      } catch (error) {
        console.error('Failed to fetch team data:', error)
        // Fallback to empty array or handle error as needed
      } finally {
        setLoading(false)
      }
    }

    fetchTeamData()
  }, [])

  const activeTeamMember = teamMembers[activeIndex] || teamMembers[0]

  // Show loading state
  if (loading) {
    return (
      <section className='relative py-16 px-4 sm:px-6 md:px-8 lg:px-12 bg-white w-full'>
        <div className='max-w-7xl 2xl:max-w-[1536px] mx-auto text-center'>
          <div className='animate-pulse'>
            <div className='h-8 bg-gray-200 rounded w-48 mx-auto mb-4'></div>
            <div className='h-4 bg-gray-200 rounded w-64 mx-auto mb-8'></div>
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-center'>
              <div className='lg:col-span-4'>
                <div className='h-96 bg-gray-200 rounded-xl'></div>
              </div>
              <div className='lg:col-span-8 space-y-4'>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className='h-16 bg-gray-200 rounded'></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Show empty state if no team members
  if (!teamMembers.length) {
    return (
      <section className='relative py-16 px-4 sm:px-6 md:px-8 lg:px-12 bg-white w-full'>
        <div className='max-w-7xl 2xl:max-w-[1536px] mx-auto text-center'>
          <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold mb-4'>
            Our Interior Design <span className='text-(--brand-camel)'>Experts</span>
          </h2>
          <p className='text-gray-500 text-lg'>No team members available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section className='relative'>
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
                  text={'MEET THE EXPERTS'}
                  className={'text-black z-10'}
                />
              </div>
            </div>
            <motion.div variants={fadeInUp} className='flex-1 w-full text-center lg:text-left'>
              <div className='border-l border-l-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl px-4 sm:px-6 font-bold'>
                <span>Our interior </span>
                <span className='text-(--brand-camel)'>design experts</span>
                <span className='block'>Amazing Team</span>
              </div>
              <div className='pl-4 sm:pl-6 lg:pl-8'>
                <p className='max-w-lg text-gray-500 pt-4 sm:pt-5 text-sm sm:text-base'>
                  Meet our talented team of interior designers and architects dedicated to transforming your spaces with creativity, innovation, and precision.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Interactive Team Section */}
      <div className='py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 lg:px-12 bg-white w-full'>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className='max-w-7xl 2xl:max-w-[1536px] mx-auto'
        >
          {/* Main Grid: Image Left, Team Members Right */}
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8 lg:gap-8 items-center'>
            {/* Left: Image - Increased Width */}
            <motion.div variants={fadeInScale} className='order-2 lg:order-1 lg:col-span-4'>
              <div className='relative w-full rounded-xl overflow-hidden shadow-lg'>
                <motion.img
                  src={activeTeamMember.image}
                  alt={activeTeamMember.name}
                  className='w-full h-50 md:h-62.5 lg:h-100 object-cover transition-all duration-500'
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
            </motion.div>

            {/* Right: Team Members List - Decreased Width */}
            <motion.div variants={fadeInUp} className='order-1 lg:order-2 lg:col-span-8'>
              <div className='space-y-0'>
                {teamMembers.map((member, index) => {
                  const isActive = index === activeIndex

                  return (
                    <motion.div
                      key={member.id}
                      onMouseEnter={() => setActiveIndex(index)}
                      className='group cursor-pointer transition-all duration-300'
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                      <div className='flex items-center justify-between py-6 px-4 lg:px-8 gap-2 sm:gap-4 md:gap-6'>
                        {/* Number - Fixed Width */}
                        <span
                          className={`text-xl md:text-2xl font-bold transition-colors duration-300 min-w-fit
                            ${isActive ? 'text-(--brand-camel)' : 'text-gray-400 group-hover:text-(--brand-camel)'}
                          `}
                        >
                          {member.number}
                        </span>

                        {/* Name - Fixed Width Column */}
                        <h3
                          className={`text-lg md:text-2xl font-bold transition-colors duration-300 min-w-max
                            ${isActive ? 'text-(--brand-camel)' : 'text-gray-800 group-hover:text-(--brand-camel)'}
                          `}
                        >
                          {member.name}
                        </h3>

                        {/* Position - Fixed Width Column */}
                        <span className={`text-xs md:text-sm transition-colors duration-300 uppercase tracking-wider font-semibold min-w-max
                          ${isActive ? 'text-(--brand-camel)' : 'text-gray-500 group-hover:text-(--brand-camel)'}
                        `}>
                          {member.position}
                        </span>

                        {/* Arrow Icon - Right aligned */}
                        <div
                          className={`shrink-0 ml-auto transition-all duration-300 transform
                            ${isActive ? 'translate-x-4' : 'translate-x-0'}
                          `}
                        >
                          <HiOutlineArrowSmallRight
                            className={`-rotate-45 transition-colors duration-300
                              ${isActive ? 'bg-(--brand-camel) text-white' : 'bg-gray-300 text-gray-600 group-hover:bg-(--brand-camel) group-hover:text-white'}
                            `}
                            size={28}
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

export default TeamSection
