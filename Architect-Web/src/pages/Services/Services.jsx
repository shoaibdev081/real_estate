import React, { useState, useEffect } from 'react'
import PageHeader from '../../components/common/PageHeader'
import ServiceSection from '../../components/home-sections/ServiceSection'
import ThisSection from '../../components/services-sections/ThisSection'
import ServicesProgress from '../../components/services-sections/ServicesProgress'
import NewsletterSection from '../../components/home-sections/NewsletterSection'
import { apiRequest } from '../../lib/apiClient'

function Services() {
  const [homeData, setHomeData] = useState(null)

  useEffect(() => {
    async function fetchHome() {
      try {
        const res = await apiRequest('/home')
        if (res && res.success && res.data) {
          setHomeData(res.data)
        }
      } catch (err) {
        console.error('Failed to load services overview', err)
      }
    }
    fetchHome()
  }, [])

  return (
    <>
      <PageHeader title='Our Services' breadcrumb={['HOME', 'SERVICES']} />
      <section className='py-16 lg:py-24'>
        <div className=''>
          <ServiceSection />
          <div className='mt-10'>
            <ThisSection />
          </div>
          <ServicesProgress overviewData={homeData?.servicesOverview} />
          <div className='mt-12'>
            <NewsletterSection />
          </div>
        </div>
      </section>
    </>
  )
}

export default Services