import React, { useState, useEffect } from 'react'
import ServiceCard from '../common/ServiceCard'
import { servicesData } from '../../data/servicesData'
import { apiRequest } from '../../lib/apiClient'
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2'

function ServicesGrid() {
  const [services, setServices] = useState(servicesData)

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await apiRequest('/services')
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((item, index) => {
            const fallback = servicesData.find(s => s.slug === item.slug) || servicesData[index % servicesData.length]
            return {
              title: item.title,
              description: item.desc || item.description || fallback?.description || '',
              slug: item.slug || fallback?.slug || `service-${item._id}`,
              icon: fallback?.icon || HiOutlineBuildingOffice2
            }
          })
          setServices(mapped)
        }
      } catch (err) {
        // Fallback to static servicesData
      }
    }
    loadServices()
  }, [])

  return (
    <section className='py-12 sm:py-16'>
      <div className='w-full'>
        {/* Responsive Grid: 1 col on mobile, 2 col on tablet, 3 on md/lg, 5 col on xl/2xl */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-5 xl:gap-6 items-stretch'>
          {services.map((service, index) => (
            <ServiceCard
              key={service.slug || index}
              index={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              slug={service.slug}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesGrid
