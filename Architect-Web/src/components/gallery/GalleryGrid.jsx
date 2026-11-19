import React from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineArrowSmallRight } from 'react-icons/hi2'
import { getImageUrl } from '../../lib/apiClient'

export default function GalleryGrid({ items }) {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 xl:gap-6">
      {items.map((item) => (
        <div
          key={item._id || item.id}
          onClick={() => navigate(`/gallery/${item._id || item.id}`)}
          className="group cursor-pointer transition-all duration-300"
        >
          {/* Image Container */}
          <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 xl:h-80 rounded-2xl overflow-hidden shadow-lg mb-4 transition-all duration-300">
            <img
              src={getImageUrl(item.mainImage || item.image)}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Card Content */}
          <div className="flex items-center justify-between gap-3">
            {/* Title */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-(--brand-camel) transition-colors duration-300 truncate">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {item.category}
              </p>
            </div>

            {/* Arrow Icon */}
            <div className="shrink-0 transition-all duration-300 transform group-hover:translate-x-2">
              <HiOutlineArrowSmallRight
                className="text-gray-400 group-hover:text-(--brand-camel) transition-colors duration-300 -rotate-45"
                size={24}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
