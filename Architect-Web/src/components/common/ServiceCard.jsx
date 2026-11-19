import React from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineArrowSmallRight } from 'react-icons/hi2'

function ServiceCard({ icon: Icon, title, description, slug, index = 0 }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (slug) {
      navigate(`/services/${slug}`)
    }
  }

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      className="group relative bg-white rounded-2xl p-5 sm:p-6 lg:p-5 xl:p-6 2xl:p-7 border border-gray-200/80 hover:border-(--brand-camel) shadow-xs hover:shadow-2xl transition-all duration-300 flex flex-col justify-between gap-5 cursor-pointer hover:-translate-y-2 select-none overflow-hidden h-full"
    >
      {/* Top subtle hover accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-(--brand-camel) scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      {/* Header: Icon + Number */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          {Icon && (
            <div className="w-12 h-12 rounded-xl bg-(--brand-camel)/10 group-hover:bg-(--brand-camel) flex items-center justify-center shrink-0 transition-all duration-300 shadow-xs">
              <Icon className="w-6 h-6 text-(--brand-camel) group-hover:text-white transition-colors duration-300" />
            </div>
          )}
          <span className="text-xs font-mono font-bold tracking-widest text-gray-400 group-hover:text-(--brand-camel) transition-colors">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-(--brand-camel) transition-colors duration-300 leading-snug mb-3 min-h-[3rem] flex items-center">
          {title}
        </h3>

        {/* Horizontal Divider */}
        <div className="w-full h-px bg-gray-200/80 group-hover:bg-(--brand-camel)/30 transition-colors duration-300 mb-4" />

        {/* Description */}
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-4">
          {description}
        </p>
      </div>

      {/* Bottom Action: "Explore Service →" */}
      <div className="pt-3 flex items-center justify-between border-t border-gray-100 group-hover:border-(--brand-camel)/20 transition-colors mt-auto">
        <span className="text-xs sm:text-sm font-semibold text-(--brand-camel) group-hover:text-gray-900 transition-colors flex items-center gap-1.5">
          Explore Service
        </span>
        <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-(--brand-camel) text-gray-700 group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
          <HiOutlineArrowSmallRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  )
}

export default ServiceCard
