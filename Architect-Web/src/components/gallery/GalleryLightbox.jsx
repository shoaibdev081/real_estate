import React, { useEffect } from 'react'
import { IoClose } from 'react-icons/io5'
import { getImageUrl } from '../../lib/apiClient'

export default function GalleryLightbox({ image, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Handle both string and object image formats
  const imageUrl = getImageUrl(typeof image === 'string' ? image : (image?.detailImage || image?.image))

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <img
          src={imageUrl}
          alt="Gallery"
          className="w-full h-full object-contain rounded-lg"
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white text-gray-900 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl z-10"
          aria-label="Close lightbox"
        >
          <IoClose className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>
    </div>
  )
}
