import React, { useState } from 'react'
import TitleBadge from '../common/TitleBadge'
import { awardsData as defaultAwards } from '../../data/awardsData'
import { getImageUrl } from '../../lib/apiClient'

export default function AwardsSection({ data }) {
  const [activeIndex, setActiveIndex] = useState(0)

  const badge = data?.badge || 'AWARD & ACHIEVEMENT'
  const title = data?.title || 'Design that speaks our industry awards'
  const description = data?.description || 'Our commitment to excellence has been recognized with numerous prestigious awards and accolades from around the industry.'
  const awardsList = (data?.items && data.items.length > 0) ? data.items : defaultAwards

  const safeIndex = Math.min(activeIndex, awardsList.length - 1)
  const activeAward = awardsList[safeIndex >= 0 ? safeIndex : 0] || {}

  return (
    <section className='relative'>
      {/* Top Header Section */}
      <div className='relative py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-white w-full'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex flex-col lg:flex-row items-start gap-6 lg:gap-8'>
            <div className='flex'>
              <div className='flex py-5'>
                <TitleBadge
                  text={badge}
                  className={'text-black z-10'}
                />
              </div>
            </div>
            <div className='flex-1 w-full'>
              <div className='border-l border-l-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl px-4 sm:px-6 font-bold'>
                <span>Design that speaks </span>
                <span className='text-(--brand-camel)'>our industry</span>
                <span className='block'>awards</span>
              </div>
              <div className='pl-4 sm:pl-6 lg:pl-8'>
                <p className='max-w-lg text-gray-500 pt-4 sm:pt-5 text-sm sm:text-base'>
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Awards Section */}
      <div className='py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 lg:px-12 bg-white w-full'>
        <div className='max-w-7xl mx-auto'>
          {/* Main Grid: Image Left (Reduced), Awards List Right (Increased) */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center'>
            {/* Left: Image - Reduced Width */}
            <div className='order-2 lg:order-1 lg:col-span-1'>
              <div className='relative w-full rounded-xl overflow-hidden shadow-lg bg-black/5'>
                {activeAward?.image ? (
                  <img
                    src={getImageUrl(activeAward.image)}
                    alt={activeAward.title || 'Award'}
                    className='w-full h-64 md:h-80 lg:h-96 object-cover transition-all duration-500'
                  />
                ) : (
                  <div className='w-full h-64 md:h-80 lg:h-96 flex items-center justify-center text-gray-400'>
                    No Image
                  </div>
                )}
              </div>
            </div>

            {/* Right: Awards List - Increased Width */}
            <div className='order-1 lg:order-2 lg:col-span-2'>
              <div className='space-y-3 sm:space-y-4'>
                {awardsList.map((award, index) => {
                  const isActive = index === (safeIndex >= 0 ? safeIndex : 0)

                  return (
                    <div
                      key={award._id || award.id || index}
                      onMouseEnter={() => setActiveIndex(index)}
                      className='group cursor-pointer transition-all duration-300'
                    >
                      <div className='flex items-center gap-6 sm:gap-8 md:gap-10 py-5 px-4 lg:px-6'>
                        {/* Year - First Column */}
                        <span
                          className={`text-lg md:text-2xl font-bold min-w-fit transition-colors duration-300
                            ${isActive ? 'text-(--brand-camel)' : 'text-gray-800 group-hover:text-(--brand-camel)'}
                          `}
                        >
                          {award.year}
                        </span>

                        {/* Title - Middle Column */}
                        <h3
                          className={`text-lg md:text-2xl font-bold flex-1 transition-colors duration-300
                            ${isActive ? 'text-(--brand-camel)' : 'text-gray-800 group-hover:text-(--brand-camel)'}
                          `}
                        >
                          {award.title}
                        </h3>

                        {/* Category - Last Column */}
                        <span className={`text-sm md:text-base min-w-max transition-colors duration-300
                          ${isActive ? 'text-(--brand-camel)' : 'text-gray-500 group-hover:text-(--brand-camel)'}
                        `}>
                          {award.category}
                        </span>
                      </div>
                      {/* Bottom Border Line */}
                      <div className={`h-px transition-all duration-300
                        ${isActive ? 'bg-(--brand-camel)' : 'bg-gray-200 group-hover:bg-(--brand-camel)'}
                      `} />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
