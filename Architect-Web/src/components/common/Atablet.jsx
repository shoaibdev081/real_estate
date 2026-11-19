import React from 'react'

// Reusable tablet-style heading block
export default function Atablet({badgeText = 'OUR PROJECTS', title, subtitle, className = ''}) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className='hidden md:block'>
        <div className='text-sm uppercase text-gray-400 tracking-wider'>{badgeText}</div>
      </div>

      <div className='md:hidden'>
        <div className='text-sm uppercase text-gray-400 tracking-wider'>{badgeText}</div>
      </div>

      <h2 className='text-2xl md:text-3xl lg:text-4xl font-bold leading-tight'>{title}</h2>
      {subtitle && <p className='text-gray-600 max-w-3xl'>{subtitle}</p>}
    </div>
  )
}
