import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import TitleBadge from '../components/common/TitleBadge'
import GalleryLightbox from '../components/gallery/GalleryLightbox'
import { HiOutlineArrowSmallRight } from 'react-icons/hi2'
import NewsletterSection from '../components/home-sections/NewsletterSection'
import SecondaryButton from '../components/common/Button/SecondaryButton'
import { apiRequest, getImageUrl } from '../lib/apiClient'


function GalleryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lightboxImage, setLightboxImage] = useState(null)
  const [visibleBlocks, setVisibleBlocks] = useState(2)
  const [gallery, setGallery] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true)
      try {
        const res = await apiRequest(`/gallery/${id}`)
        // Compose images array: mainImage + otherImages[]
        const images = [res.data.mainImage, ...(Array.isArray(res.data.otherImages) ? res.data.otherImages : [])].filter(Boolean).map(getImageUrl)
        setGallery({ ...res.data, images })
      } catch (err) {
        setError('Gallery Not Found')
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [id])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>
  }
  if (error || !gallery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{error || 'Gallery Not Found'}</h1>
          <SecondaryButton onClick={() => navigate('/gallery')} text='Back to Gallery' className='px-8 py-3 bg-(--brand-camel) text-white rounded-lg hover:opacity-90 transition' />
        </div>
      </div>
    )
  }

  return (
    <>
      <PageHeader title={gallery.title} breadcrumb={['HOME', 'GALLERY', gallery.title?.toUpperCase()]} />


     

      {/* Gallery Images Section */}
      <section className='py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 bg-gray-50 w-full'>
        <div className='max-w-7xl mx-auto'>
          {/* Images Grid: render in alternating blocks of 5 images (1 large + 4 small). */}
          <div className='space-y-8'>
            {/** chunk images into blocks of 5 **/}
            {(() => {
              const blocks = []
              for (let i = 0; i < gallery.images.length; i += 5) {
                blocks.push(gallery.images.slice(i, i + 5))
              }
              return blocks.slice(0, visibleBlocks).map((block, bIndex) => {
                const isPatternA = bIndex % 2 === 0
                const large = block[0]
                const smalls = block.slice(1)
                return (
                  <div key={bIndex} className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch'>
                    {isPatternA ? (
                      <>
                        {/* Large on left */}
                        <div className='lg:col-span-2 rounded-2xl overflow-hidden shadow-lg cursor-pointer' onClick={() => large && setLightboxImage(large)}>
                          {large ? (
                            <div className='w-full h-96 sm:h-130 overflow-hidden relative group'>
                              <img src={large} alt={`${gallery.title} large-${bIndex}`} className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105' />
                              <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                                <span className='text-white text-5xl font-light'>+</span>
                              </div>
                            </div>
                          ) : (
                            <div className='w-full h-96 sm:h-130 bg-gray-100 rounded-2xl' />
                          )}
                        </div>
                        {/* 4 small on right (2x2) */}
                        <div className='lg:col-span-1 grid grid-cols-2 grid-rows-2 gap-4 h-full'>
                          {Array.from({ length: 4 }).map((_, si) => {
                            const src = smalls[si]
                            return (
                              <div key={si} className='h-full rounded-2xl overflow-hidden shadow-lg cursor-pointer' onClick={() => src && setLightboxImage(src)}>
                                {src ? (
                                  <div className='relative group w-full h-full overflow-hidden'>
                                    <img src={src} alt={`${gallery.title} small-${bIndex}-${si}`} className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105' />
                                    <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                                      <span className='text-white text-3xl font-light'>+</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className='w-full h-full bg-gray-100' />
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* 4 small on left, large on right */}
                        <div className='lg:col-span-1 grid grid-cols-2 grid-rows-2 gap-4 h-full'>
                          {Array.from({ length: 4 }).map((_, si) => {
                            const src = smalls[si]
                            return (
                              <div key={si} className='h-full rounded-2xl overflow-hidden shadow-lg cursor-pointer' onClick={() => src && setLightboxImage(src)}>
                                {src ? (
                                  <div className='relative group w-full h-full overflow-hidden'>
                                    <img src={src} alt={`${gallery.title} small-${bIndex}-${si}`} className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105' />
                                    <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                                      <span className='text-white text-3xl font-light'>+</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className='w-full h-full bg-gray-100' />
                                )}
                              </div>
                            )
                          })}
                        </div>
                        <div className='lg:col-span-2 rounded-2xl overflow-hidden shadow-lg cursor-pointer' onClick={() => large && setLightboxImage(large)}>
                          {large ? (
                            <div className='w-full h-96 sm:h-130 overflow-hidden relative group'>
                              <img src={large} alt={`${gallery.title} large-${bIndex}`} className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105' />
                              <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                                <span className='text-white text-5xl font-light'>+</span>
                              </div>
                            </div>
                          ) : (
                            <div className='w-full h-96 sm:h-130 bg-gray-100 rounded-2xl' />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })
            })()}

            {/* Load more arrow */}
            {(() => {
              const totalBlocks = Math.ceil(gallery.images.length / 5)
              if (visibleBlocks >= totalBlocks) return null
              return (
                <div className='flex justify-center'>
                  <button
                    onClick={() => setVisibleBlocks((v) => v + 1)}
                    className='w-12 h-12 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform'
                    aria-label='Load more images'
                  >
                    <HiOutlineArrowSmallRight className='w-6 h-6 rotate-90' />
                  </button>
                </div>
              )
            })()}
          </div>
        </div>
      </section>

      {/* Back to Gallery */}
      <section className='py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-white w-full'>
        <div className='max-w-7xl mx-auto flex flex-col items-center justify-center gap-6'>
          <SecondaryButton onClick={() => navigate('/gallery')} text='Back to Gallery' className='px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-sm' />

          {/* Newsletter section inserted below the button */}
          <div className='w-full max-w-3xl'>
            <NewsletterSection />
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <GalleryLightbox
          image={{ detailImage: lightboxImage }}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </>
  )
}

export default GalleryDetail
