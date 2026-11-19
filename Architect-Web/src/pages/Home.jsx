import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar/Navbar'
import Hero from '../components/home-sections/Hero'
import Intro from '../components/home-sections/Intro'
import History from '../components/home-sections/History'
import ServiceSection from '../components/home-sections/ServiceSection'
import TeamSection from '../components/home-sections/TeamSection'
import CompaniesSection from '../components/home-sections/CompaniesSection'
import TestimonialSection from '../components/home-sections/TestimonialSection'
import ProcessSection from '../components/home-sections/ProcessSection'
import StatsSection from '../components/home-sections/StatsSection'
import NewsletterSection from '../components/home-sections/NewsletterSection'
import OurProjects from '../components/home-sections/OurProjects'
import MainAreasSection from '../components/home-sections/MainAreasSection'
import PanoramaSection from '../components/home-sections/PanoramaSection'
import VideoShowcaseSection from '../components/home-sections/VideoShowcaseSection'
import GallerySection from '../components/home-sections/GallerySection'
import { apiRequest, getImageUrl } from '../lib/apiClient'

const defaultBgImages = [
  '/images/hero-bg.webp',
  '/images/hero-bg2.webp',
  '/images/hero-bg-3.webp'
]

function Home() {
  const [homeData, setHomeData] = useState(null)
  const [currentBgIndex, setCurrentBgIndex] = useState(0)

  useEffect(() => {
    async function fetchHome() {
      try {
        const res = await apiRequest('/home')
        if (res && res.success && res.data) {
          setHomeData(res.data)
        }
      } catch (err) {
        console.error('Failed to fetch home content', err)
      }
    }
    fetchHome()
  }, [])

  const slides = homeData?.hero?.slides
  const backgroundImages = slides && slides.length > 0
    ? slides.map(s => getImageUrl(s.bgImage) || '/images/hero-bg.webp')
    : defaultBgImages

  const bgIdx = currentBgIndex < backgroundImages.length ? currentBgIndex : 0
  const activeBg = backgroundImages[bgIdx] || defaultBgImages[0]

  const handleHeadingChange = (index) => {
    setCurrentBgIndex(index)
  }

  return (
    <>
      <section
        className="relative min-h-96 sm:min-h-screen 2xl:min-h-[50vh] bg-cover bg-center bg-no-repeat transition-all duration-700 w-full"
        style={{ backgroundImage: `url('${activeBg}')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
      >
        <div className="absolute inset-0 bg-black/30" />

        <Navbar isHome={true} />

        <div className="relative w-full pt-20">
          <Hero onHeadingChange={handleHeadingChange} heroData={homeData?.hero} />
        </div>
      </section>

      <Intro introData={homeData?.intro} />
      <History historyData={homeData?.history} />

      <ServiceSection />
      <TeamSection />
      <CompaniesSection />
      <TestimonialSection />
      <ProcessSection />
      <StatsSection statsData={homeData?.stats} />
      <OurProjects />
      <MainAreasSection />
      <PanoramaSection panoramaData={homeData?.panorama} />
      <VideoShowcaseSection videoData={homeData?.videoShowcase} />
      <GallerySection />
      <NewsletterSection />
    </>
  )
}

export default Home