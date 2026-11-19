import React, { useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { getImageUrl } from '../../lib/apiClient'

export default function VideoShowcaseSection({ videoData }) {
  const [showVideo, setShowVideo] = useState(false)

  const bgUrl = getImageUrl(videoData?.bgImage) || '/images/gallery-6.jpg'
  const videoUrl = getImageUrl(videoData?.videoUrl) || '/videos/Sample.mp4'
  const title = videoData?.title || 'Unlock Your Dream Home Today!'
  const subtitle = videoData?.subtitle || 'We encourage clients to actively participate in discussions, share their ideas, preferences, and feedback.'

  return (
    <>
      {/* Full Screen Video Section */}
      <section className='relative w-full min-h-96 sm:min-h-[600px] md:min-h-[700px] lg:min-h-screen xl:min-h-[85vh] 2xl:min-h-[65vh] overflow-hidden flex items-center justify-center'>
        {/* Background Image */}
        <div className='absolute inset-0 w-full h-full'>
          <img
            src={bgUrl}
            alt='Video Showcase'
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-black/40' />
        </div>

        {/* Content */}
        <div className='relative z-10 flex flex-col items-center justify-center text-center gap-6 sm:gap-8 px-4 sm:px-6'>
          
          {/* Text Content */}
          <div className='flex flex-col gap-3 sm:gap-4 max-w-2xl'>
            <h2 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight'>
              {title}
            </h2>
            <p className='text-sm sm:text-base md:text-lg text-gray-200 leading-relaxed'>
              {subtitle}
            </p>
          </div>

          {/* Video Button with Wave Animation */}
          <div className='relative flex items-center justify-center mt-6 sm:mt-8'>
            <button
              onClick={() => setShowVideo(true)}
              className='relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-white/20 backdrop-blur-md border-2 border-white flex items-center justify-center hover:bg-white/30 transition-colors duration-300 z-20 cursor-pointer'
              aria-label="Play video showcase"
            >
              <svg
                className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 text-white ml-1'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M8 5v14l11-7z' />
              </svg>
            </button>

            {/* Wave Ripple Animation */}
            <div className='absolute w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-2 border-white/60 animate-pulse-ring' />
            <div className='absolute w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-2 border-white/40 animate-pulse-ring-delay' />
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideo && (
        <div className='fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6'>
          <div className='relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden'>
            <video
              className='w-full h-full object-contain'
              controls
              autoPlay
            >
              <source src={videoUrl} type='video/mp4' />
              Your browser does not support the video tag.
            </video>

            {/* Close Button */}
            <button
              onClick={() => setShowVideo(false)}
              className='absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white transition-colors duration-300 z-10 cursor-pointer'
            >
              <AiOutlineClose size={24} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
