import React, { useState } from 'react'
import { HiOutlineSquares2X2, HiOutlineBars3 } from 'react-icons/hi2'

function ShopTopBar({ viewMode, onViewModeChange, productsCount, onSortChange }) {
  const [sortOpen, setSortOpen] = useState(false)
  const [selectedSort, setSelectedSort] = useState('popularity')

  const sortOptions = [
    { value: 'popularity', label: 'Sort by popularity' },
    { value: 'rating', label: 'Sort by average rating' },
    { value: 'latest', label: 'Sort by latest' },
    { value: 'price-low', label: 'Sort by price: low to high' },
    { value: 'price-high', label: 'Sort by price: high to low' },
  ]

  const handleSort = (value) => {
    setSelectedSort(value)
    setSortOpen(false)
    onSortChange(value)
  }

  return (
    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-gray-200'>
      {/* Left Side - Results Count */}
      <div className='text-sm text-gray-600'>
        <p>Showing 1–12 of {productsCount} results</p>
      </div>

      {/* Right Side - View Mode and Sort */}
      <div className='flex items-center gap-4'>
        {/* Grid/List Toggle */}
        <div className='flex gap-2 bg-gray-100 p-1 rounded-lg'>
          <button
            onClick={() => onViewModeChange('grid')}
            title='Grid view'
            className={`p-2 rounded transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <HiOutlineSquares2X2 size={20} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            title='List view'
            className={`p-2 rounded transition-all ${
              viewMode === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <HiOutlineBars3 size={20} />
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className='relative'>
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:border-gray-400 transition-all'
          >
            <span className='text-sm font-medium'>
              {sortOptions.find(o => o.value === selectedSort)?.label || 'Sort'}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${sortOpen ? 'rotate-180' : ''}`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {sortOpen && (
            <div className='absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-lg shadow-lg z-10'>
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSort(option.value)}
                  className={`w-full text-left px-4 py-3 transition-all ${
                    selectedSort === option.value
                      ? 'bg-[var(--brand-camel)] text-white font-medium'
                      : 'hover:bg-gray-50 text-gray-700'
                  } first:rounded-t-lg last:rounded-b-lg`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShopTopBar
