import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest, getImageUrl } from '../../lib/apiClient'

const DEFAULT_GALLERY_IMAGES = [
  {
    id: 'default-1',
    galleryId: 'default',
    src: '/images/gallery-1.jpg',
    title: 'Modern Minimalist Living Room',
    category: 'Living Room',
    width: 'w-56 md:w-72 lg:w-80'
  },
  {
    id: 'default-2',
    galleryId: 'default',
    src: '/images/gallery-6.jpg',
    title: 'Luxury Executive Kitchen Suite',
    category: 'Kitchen',
    width: 'w-48 md:w-64 lg:w-72'
  },
  {
    id: 'default-3',
    galleryId: 'default',
    src: '/images/gallery-11.jpg',
    title: 'Contemporary Master Bedroom',
    category: 'Bedroom',
    width: 'w-52 md:w-64 lg:w-80'
  },
  {
    id: 'default-4',
    galleryId: 'default',
    src: '/images/gallery-9.jpg',
    title: 'Spa-Inspired Marble Bathroom',
    category: 'Bathroom',
    width: 'w-48 md:w-64 lg:w-72'
  },
  {
    id: 'default-5',
    galleryId: 'default',
    src: '/images/gallery-3.jpg',
    title: 'Elegant Dining & Lounge Space',
    category: 'Living Room',
    width: 'w-56 md:w-72 lg:w-80'
  },
  {
    id: 'default-6',
    galleryId: 'default',
    src: '/images/gallery-4.jpg',
    title: 'Bespoke Architectural Millwork',
    category: 'Living Room',
    width: 'w-44 md:w-60 lg:w-72'
  }
]

export default function GallerySection() {
  const [scrollY, setScrollY] = useState(0)
  const [galleryImages, setGalleryImages] = useState(DEFAULT_GALLERY_IMAGES)
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)
  const navigate = useNavigate()

  // Handle image click to navigate to gallery detail
  const handleImageClick = (galleryItem) => {
    const targetId = galleryItem.galleryId || String(galleryItem.id || '').split('-')[0]
    if (targetId && targetId !== 'default') {
      navigate(`/gallery/${targetId}`)
    } else {
      navigate('/gallery')
    }
  }

  // Fetch gallery data from backend
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const response = await apiRequest('/gallery')
        if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
          const mappedImages = response.data.map((item, index) => {
            const allImages = [item.mainImage, ...(item.otherImages || [])].filter(Boolean)
            return allImages.map((image, imgIndex) => ({
              id: `${item._id}-${imgIndex}`,
              galleryId: item._id,
              src: image,
              title: item.title,
              category: item.category,
              width: ['w-48 md:w-64 lg:w-72', 'w-56 md:w-72 lg:w-80', 'w-40 md:w-56 lg:w-64', 'w-48 md:w-64 lg:w-72', 'w-52 md:w-64 lg:w-80', 'w-44 md:w-60 lg:w-72'][(index * 6 + imgIndex) % 6]
            }))
          }).flat()

          if (mappedImages.length > 0) {
            setGalleryImages(mappedImages)
          }
        }
      } catch (error) {
        console.error('Failed to fetch gallery data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGalleryData()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const elementScrollY = window.scrollY - (rect.top + window.scrollY)
        setScrollY(elementScrollY)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const calculateRow1Offset = () => -(scrollY * 0.3)
  const calculateRow2Offset = () => scrollY * 0.3

  if (loading && (!galleryImages || galleryImages.length === 0)) {
    return (
      <section className='w-full py-16 lg:py-24 px-6 lg:px-8 bg-gray-50 overflow-hidden'>
        <div className='max-w-7xl 2xl:max-w-[1536px] mx-auto flex flex-col gap-12'>
          <div className='animate-pulse'>
            <div className='h-8 bg-gray-200 rounded w-48 mb-4'></div>
            <div className='h-4 bg-gray-200 rounded w-64 mb-8'></div>
            <div className='flex flex-col gap-8'>
              <div className='flex gap-6'>
                {[1, 2, 3].map((i) => (
                  <div key={i} className='w-48 h-32 bg-gray-200 rounded-2xl'></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const row1Images = galleryImages.slice(0, Math.ceil(galleryImages.length / 2))
  const row2Images = galleryImages.slice(Math.ceil(galleryImages.length / 2))

  return (
    <section ref={containerRef} className='w-full py-16 lg:py-24 px-6 lg:px-8 bg-gray-50 overflow-hidden'>
      <div className='max-w-7xl 2xl:max-w-[1536px] mx-auto flex flex-col gap-12'>
        {/* Header Badge */}
        <div className='flex flex-col items-center text-center'>
          <span className='px-4 py-1.5 rounded-full bg-(--brand-camel)/10 text-(--brand-camel-dark) text-xs font-bold uppercase tracking-wider mb-3'>
            Featured Portfolio
          </span>
          <h2 className='text-3xl sm:text-4xl font-extrabold text-gray-900'>
            Crafted Spaces & Interiors
          </h2>
        </div>

        {/* Gallery Animated Grid */}
        <div className='flex flex-col gap-8'>
          {/* Row 1 - Move Right to Left */}
          <div className='relative overflow-hidden py-4 w-full'>
            <div
              className='flex gap-6'
              style={{
                transform: `translateX(${calculateRow1Offset()}px)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              {[...row1Images, ...row1Images].map((img, idx) => (
                <div
                  key={`row1-${img.id}-${idx}`}
                  className={`${img.width} h-40 md:h-48 lg:h-56 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl shrink-0 relative group cursor-pointer border border-gray-100 transition-all duration-300`}
                  onClick={() => handleImageClick(img)}
                >
                  <img
                    src={getImageUrl(img.src)}
                    alt={img.title || `Gallery ${idx}`}
                    className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                    onError={(e) => {
                      e.target.src = '/images/gallery-1.jpg'
                    }}
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4'>
                    <div className='text-white text-xs sm:text-sm font-semibold truncate'>
                      {img.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 - Move Left to Right */}
          <div className='relative overflow-hidden py-4 w-full'>
            <div
              className='flex gap-6'
              style={{
                transform: `translateX(${calculateRow2Offset()}px)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              {[...row2Images, ...row2Images].map((img, idx) => (
                <div
                  key={`row2-${img.id}-${idx}`}
                  className={`${img.width} h-40 md:h-48 lg:h-56 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl shrink-0 relative group cursor-pointer border border-gray-100 transition-all duration-300`}
                  onClick={() => handleImageClick(img)}
                >
                  <img
                    src={getImageUrl(img.src)}
                    alt={img.title || `Gallery ${idx}`}
                    className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                    onError={(e) => {
                      e.target.src = '/images/gallery-6.jpg'
                    }}
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4'>
                    <div className='text-white text-xs sm:text-sm font-semibold truncate'>
                      {img.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
