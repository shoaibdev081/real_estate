import React, { useState, useEffect } from 'react'
import PageHeader from '../components/common/PageHeader'
import TitleBadge from '../components/common/TitleBadge'
import SecondaryButton from '../components/common/Button/SecondaryButton'
import Timeline from '../components/aboutus-sections/Timeline'
import GalleryCarousel from '../components/aboutus-sections/GalleryCarousel'
import AwardsSection from '../components/aboutus-sections/AwardsSection'
import ProcessSection from '../components/home-sections/ProcessSection'
import TestimonialSection from '../components/home-sections/TestimonialSection'
import CompaniesSection from '../components/home-sections/CompaniesSection'
import NewsletterSection from '../components/home-sections/NewsletterSection'
import { apiRequest, getImageUrl } from '../lib/apiClient'

function About() {
  const [aboutData, setAboutData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiRequest('/about')
      .then((res) => {
        if (res?.success && res.data) {
          setAboutData(res.data)
        }
      })
      .catch((err) => {
        console.error('Failed to fetch about data:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const hero = aboutData?.hero || {
    badge: 'STARTED IN 1989',
    heading: 'We Shape Interior Designs, Crafting Timeless And Inspiring Spaces',
    experienceYears: '26',
    experienceTitle: 'Years Of',
    experienceSubtitle: 'Experience',
    featureImage: '/images/gallery-11.jpg',
    heroImage: '/images/hero-bg-3.webp',
    description: 'We believe that every space has the power to inspire, and that great design brings that inspiration to life. Our mission is to craft environments that stir creativity, evoke emotion, and reflect the essence of those who inhabit them.',
    buttonText: 'Learn More',
    buttonLink: '/team'
  }

  const video = aboutData?.video || {
    videoUrl: '/videos/Sample.mp4',
    title: 'Design In Motion'
  }

  return (
    <>
      <PageHeader title='About Us' breadcrumb={['HOME', 'ABOUT']} />

      {/* Hero Section */}
      <section className='py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-white'>
        <div className='mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-stretch'>
            {/* Left Column */}
            <div className='flex flex-col gap-4 sm:gap-6'>
              <div>
                <TitleBadge text={hero.badge || 'STARTED IN 1989'} className={'text-black inline-flex items-center gap-1'} />
              </div>

              <div>
                <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight max-w-none text-gray-900'>
                  {hero.heading || 'We Shape Interior Designs, Crafting Timeless And Inspiring Spaces'}
                </h2>
              </div>

              <div className='flex flex-col sm:flex-row items-start gap-4 sm:gap-6'>
                <div className='shrink-0 text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem] font-extrabold text-(--brand-camel) leading-none'>
                  {hero.experienceYears || '26'}
                </div>

                <div className='pt-0 sm:pt-32 md:pt-40'>
                  <div className='text-xs sm:text-sm font-semibold text-gray-500 uppercase'>
                    {hero.experienceTitle || 'Years Of'}
                  </div>
                  <div className='text-lg sm:text-xl md:text-2xl font-bold text-gray-900'>
                    {hero.experienceSubtitle || 'Experience'}
                  </div>
                </div>

                {hero.featureImage && (
                  <div className='hidden sm:block ml-auto w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-60 lg:h-60 rounded-lg overflow-hidden shadow-md'>
                    <img
                      src={getImageUrl(hero.featureImage)}
                      alt='Feature'
                      className='w-full h-full object-cover rounded-lg'
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className='flex flex-col justify-between items-stretch sm:items-end h-full gap-4 sm:gap-6'>
              {hero.heroImage && (
                <div className='w-full sm:w-120 rounded-lg sm:rounded-2xl overflow-hidden shadow-md'>
                  <img
                    src={getImageUrl(hero.heroImage)}
                    alt='Hero'
                    className='w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 object-cover rounded-lg sm:rounded-2xl'
                  />
                </div>
              )}

              <div className='flex-1 flex flex-col gap-3 sm:gap-4 px-0 sm:px-6 md:px-8 lg:px-12'>
                <p className='text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed'>
                  {hero.description}
                </p>
                <div className='w-full inline-flex'>
                  <SecondaryButton
                    href={hero.buttonLink || '/team'}
                    text={hero.buttonText || 'Learn More'}
                    className='w-full sm:w-auto'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      {video.videoUrl && (
        <section className='w-full bg-black'>
          <video
            key={video.videoUrl}
            className='w-full h-100 md:h-130 lg:h-200 object-cover'
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={getImageUrl(video.videoUrl)} type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        </section>
      )}

      {/* Legacy Timeline Section */}
      <Timeline items={aboutData?.timeline} />

      {/* Process Section */}
      <ProcessSection />

      {/* Awards Section */}
      <AwardsSection data={aboutData?.awards} />

      {/* Gallery Carousel */}
      <GalleryCarousel />

      {/* Testimonials */}
      <TestimonialSection />

      {/* Partner Companies */}
      <CompaniesSection />

      {/* Newsletter */}
      <NewsletterSection />
    </>
  )
}

export default About