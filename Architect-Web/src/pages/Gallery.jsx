import React, { useEffect, useState } from 'react'
import PageHeader from '../components/common/PageHeader'
import GalleryGrid from '../components/gallery/GalleryGrid'
import NewsletterSection from '../components/home-sections/NewsletterSection'
import { apiRequest } from '../lib/apiClient'

function Gallery() {
  const [galleryItems, setGalleryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await apiRequest('/gallery')
        setGalleryItems(res.data)
      } catch (err) {
        setError('Failed to load gallery')
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center"><p>{error}</p></div>
  }

  return (
    <>
      <PageHeader title='Gallery' breadcrumb={['HOME', 'GALLERY']} />
      {/* Gallery Cards Section */}
      <section className='py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 bg-gray-50 w-full'>
        <div className='max-w-7xl mx-auto'>
          {/* Gallery Cards Grid */}
          <GalleryGrid items={galleryItems || []} />
        </div>
      </section>
      {/* Newsletter Section */}
      <NewsletterSection />
    </>
  )
}

export default Gallery
