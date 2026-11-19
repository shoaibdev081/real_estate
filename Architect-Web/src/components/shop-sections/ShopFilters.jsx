import React, { useState } from 'react'
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2'
import { categories, productsData } from '../../data/productsData'

function ShopFilters({ onFilterChange }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [priceRange, setPriceRange] = useState([0, 300])

  // Best products (highest rated and reviewed)
  const bestProducts = [...productsData]
    .sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews))
    .slice(0, 4)

  const handleCategoryToggle = (category) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category]
    setSelectedCategories(updated)
    onFilterChange({ categories: updated, priceRange, search: searchQuery })
  }

  const handlePriceChange = (e) => {
    const newPrice = Number(e.target.value)
    setPriceRange([0, newPrice])
    onFilterChange({ categories: selectedCategories, priceRange: [0, newPrice], search: searchQuery })
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    onFilterChange({ categories: selectedCategories, priceRange, search: query })
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedCategories([])
    setPriceRange([0, 300])
    onFilterChange({ categories: [], priceRange: [0, 300], search: '' })
  }

  return (
    <div className='w-full lg:w-80 xl:w-96 space-y-8'>
      {/* Search Bar */}
      <div>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search products...'
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className='w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-(--brand-camel)'
          />
          <HiOutlineMagnifyingGlass size={20} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400' />
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className='text-lg font-bold text-gray-900 mb-4'>Categories</h3>
        <div className='space-y-3'>
          {categories.map((category) => (
            <label key={category} className='flex items-center gap-3 cursor-pointer group'>
              <input
                type='checkbox'
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className='w-4 h-4 accent-(--brand-camel) cursor-pointer'
              />
              <span className='text-gray-700 group-hover:text-gray-900 transition-colors'>{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className='text-lg font-bold text-gray-900 mb-4'>Filter By Price</h3>
        <div className='space-y-3'>
          <input
            type='range'
            min='0'
            max='500'
            value={priceRange[1]}
            onChange={handlePriceChange}
            className='w-full accent-(--brand-camel) cursor-pointer'
          />
          <div className='text-sm text-gray-600'>
            Price: ${priceRange[0]} - ${priceRange[1]}
          </div>
          <div className='flex gap-2'>
            <button className='flex-1 px-4 py-2 bg-(--brand-camel) text-white rounded-lg font-bold hover:opacity-90 transition-opacity'>
              Filter
            </button>
            <button 
              onClick={handleClearFilters}
              className='flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-bold hover:bg-gray-300 transition-colors'
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Best Products */}
      <div>
        <h3 className='text-lg font-bold text-gray-900 mb-4'>Best Products</h3>
        <div className='space-y-4'>
          {bestProducts.map((product) => (
            <div
              key={product.id}
              className='flex gap-3 pb-4 border-b border-gray-200 last:border-b-0 cursor-pointer hover:opacity-80 transition-opacity'
            >
              <div className='w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0'>
                <img
                  src={product.image}
                  alt={product.title}
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='flex-1 min-w-0'>
                <h4 className='text-sm font-bold text-gray-900 line-clamp-2'>{product.title}</h4>
                <div className='flex gap-0.5 my-1'>
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={i < Math.floor(product.rating) ? 'text-[#b07b2b] text-xs' : 'text-gray-300 text-xs'}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className='text-sm font-bold text-gray-900'>${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ShopFilters
