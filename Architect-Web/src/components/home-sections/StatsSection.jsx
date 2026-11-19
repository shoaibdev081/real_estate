import React from 'react'

const defaultStats = [
  {
    id: 1,
    number: '30+',
    label: 'Years Experience',
    description: 'Improving homes with expert craftsmanship for years'
  },
  {
    id: 2,
    number: '190+',
    label: 'Projects Completed',
    description: 'Over 250 successful projects delivered with quality and care'
  },
  {
    id: 3,
    number: '260+',
    label: 'Skilled Tradespeople',
    description: 'Our team of 30 experts ensures top-quality results'
  },
  {
    id: 4,
    number: '328+',
    label: 'Client Satisfaction',
    description: 'All of our clients are satisfied with our work and service'
  }
]

function StatsSection({ statsData }) {
  const statsList = statsData && statsData.length > 0 ? statsData : defaultStats

  return (
    <section className='py-16 md:py-24 lg:py-32 px-6 lg:px-15 bg-white'>
      <div className='max-w-7xl mx-auto'>
        {/* Grid for Stats */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6'>
          {statsList.map((stat, idx) => (
            <div key={stat.id || stat._id || idx} className='text-center lg:text-left'>
              {/* Big Number */}
              <h2 className='text-5xl md:text-6xl lg:text-7xl font-bold mb-2 text-(--brand-camel)'>
                {stat.number}
              </h2>

              {/* Label */}
              <h3 className='text-xl md:text-2xl font-bold mb-4 capitalize'>
                {stat.label}
              </h3>

              {/* Description */}
              <p className='text-gray-600 text-sm md:text-base leading-relaxed'>
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection
