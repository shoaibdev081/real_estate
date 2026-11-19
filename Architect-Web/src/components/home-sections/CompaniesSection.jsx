import React, { useState } from 'react'
import TitleBadge from '../common/TitleBadge'
import { HiOutlineHome, HiBuildingOffice2, HiOutlineSparkles, HiBuildingLibrary, HiOutlineMap } from 'react-icons/hi2'

const companies = [
  {
    id: 1,
    name: 'Architect',
    subtitle: 'Real Estate',
    icon: HiOutlineHome
  },
  {
    id: 2,
    name: 'Trend',
    subtitle: 'Interiors',
    icon: HiBuildingOffice2
  },
  {
    id: 3,
    name: 'Interior',
    subtitle: 'Premium',
    icon: HiOutlineSparkles
  },
  {
    id: 4,
    name: 'Building',
    subtitle: 'Construction',
    icon: HiBuildingLibrary
  },
  {
    id: 5,
    name: 'Real Estate',
    subtitle: 'Tagline Here',
    icon: HiOutlineMap
  }
]

function CompaniesSection() {
  const [hoveredId, setHoveredId] = useState(null)

  return (
    <section className='relative py-16 sm:py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-white'>
      <div className='max-w-7xl 2xl:max-w-[1536px] mx-auto'>
        {/* Header */}
        <div className='mb-16'>
          <h2 className='text-center text-3xl md:text-4xl lg:text-5xl font-bold'>
            Our Website <span className='text-(--brand-camel)'>500+</span> VIP Customer
          </h2>
        </div>

        {/* Companies Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8'>
          {companies.map((company) => {
            const IconComponent = company.icon
            const isHovered = hoveredId === company.id

            return (
              <div
                key={company.id}
                onMouseEnter={() => setHoveredId(company.id)}
                onMouseLeave={() => setHoveredId(null)}
                className='flex items-center gap-4 group cursor-pointer p-4 lg:p-6 rounded-lg transition-all duration-300'
              >
                {/* Icon */}
                <div
                  className={`transition-all duration-300 transform
                    ${isHovered ? 'scale-110' : 'scale-100'}
                  `}
                >
                  <IconComponent
                    className={`transition-all duration-300
                      ${isHovered ? 'text-(--brand-camel)' : 'text-gray-400 group-hover:text-(--brand-camel)'}
                    `}
                    size={40}
                  />
                </div>

                {/* Text: Name + Subtitle */}
                <div className='flex flex-col'>
                  <p
                    className={`font-bold transition-all duration-300 text-sm md:text-base
                      ${isHovered ? 'text-(--brand-camel)' : 'text-gray-800 group-hover:text-(--brand-camel)'}
                    `}
                  >
                    {company.name}
                  </p>
                  <p
                    className={`text-xs md:text-sm transition-all duration-300 uppercase tracking-wide
                      ${isHovered ? 'text-(--brand-camel)' : 'text-gray-500 group-hover:text-(--brand-camel)'}
                    `}
                  >
                    {company.subtitle}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CompaniesSection
