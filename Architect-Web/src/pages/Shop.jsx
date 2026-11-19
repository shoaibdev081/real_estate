import React, { useState, useMemo } from 'react'
import PageHeader from '../components/common/PageHeader'
import ShopFilters from '../components/shop-sections/ShopFilters'
import ShopTopBar from '../components/shop-sections/ShopTopBar'
import ShopProductCard from '../components/shop-sections/ShopProductCard'
import QuickViewModal from '../components/common/QuickViewModal'
import NewsletterSection from '../components/home-sections/NewsletterSection'
import { productsData } from '../data/productsData'
import { HiOutlineArrowSmallRight, HiOutlineBars3 } from 'react-icons/hi2'

function Shop() {
  const [viewMode, setViewMode] = useState('grid')
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const perPage = 6
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [0, 300],
    search: '',
    sort: 'popularity'
  })

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let products = [...productsData]

    // Apply filters
    if (filters.search) {
      products = products.filter(p =>
        p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.categories.length > 0) {
      products = products.filter(p => filters.categories.includes(p.category))
    }

    products = products.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1])

    // Apply sorting
    switch (filters.sort) {
      case 'rating':
        products.sort((a, b) => b.rating - a.rating)
        break
      case 'latest':
        products.sort((a, b) => b.id - a.id)
        break
      case 'price-low':
        products.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        products.sort((a, b) => b.price - a.price)
        break
      case 'popularity':
      default:
        products.sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews))
    }

    return products
  }, [filters])

  // Pagination logic
  const total = filteredProducts.length
  const pages = Math.ceil(total / perPage)
  const start = (page - 1) * perPage
  const pageItems = filteredProducts.slice(start, start + perPage)
  const hasPrev = page > 1
  const hasNext = page < pages

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setPage(1) // Reset to first page on filter change
  }

  const handleSortChange = (sortValue) => {
    setFilters(prev => ({ ...prev, sort: sortValue }))
    setPage(1)
  }

  const handleViewModeChange = (mode) => {
    setViewMode(mode)
  }

  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const openQuickView = (product) => setQuickViewProduct(product)
  const closeQuickView = () => setQuickViewProduct(null)

  return (
    <>
      <PageHeader title='Our Shop' breadcrumb={['HOME', 'SHOP']} />
      <section className='py-16 lg:py-24 px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          {/* Mobile Filters Toggle */}
          <div className='lg:hidden mb-6'>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className='flex items-center gap-2 px-4 py-2 bg-[var(--brand-camel)] text-white rounded-lg font-bold hover:opacity-90'
            >
              <HiOutlineBars3 size={20} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          <div className='flex flex-col lg:flex-row gap-12'>
            {/* Mobile Sidebar - Filters */}
            {showFilters && (
              <div className='fixed inset-0 z-50 lg:static lg:w-auto'>
                {/* Mobile Filter Overlay */}
                <div
                  className='fixed inset-0 bg-black/50 lg:hidden'
                  onClick={() => setShowFilters(false)}
                />
                {/* Mobile Sidebar Panel */}
                <div className='fixed left-0 top-0 h-full w-80 bg-white overflow-y-auto z-50 lg:static lg:w-auto lg:h-auto lg:bg-transparent lg:block'>
                  <div className='p-6 lg:p-0'>
                    <div className='flex justify-between items-center mb-6 lg:hidden'>
                      <h2 className='text-lg font-bold'>Filters</h2>
                      <button
                        onClick={() => setShowFilters(false)}
                        className='text-gray-600 hover:text-gray-900'
                      >
                        ✕
                      </button>
                    </div>
                    <ShopFilters onFilterChange={handleFilterChange} />
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Sidebar - Always Visible */}
            <div className='hidden lg:block'>
              <ShopFilters onFilterChange={handleFilterChange} />
            </div>

            {/* Right Section - Products */}
            <div className='flex-1'>
              {/* Top Bar with View Mode and Sort */}
              <ShopTopBar
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
                productsCount={total}
                onSortChange={handleSortChange}
              />

              {/* Products Grid/List */}
              {pageItems.length > 0 ? (
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12'
                      : 'space-y-6 mt-8'
                  }
                >
                  {pageItems.map(product => (
                    <ShopProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                      onQuickView={openQuickView}
                    />
                  ))}
                </div>
              ) : (
                <div className='mt-12 text-center py-12'>
                  <p className='text-gray-500 text-lg'>No products found matching your filters.</p>
                  <button
                    onClick={() => setFilters({ categories: [], priceRange: [0, 300], search: '', sort: 'popularity' })}
                    className='mt-4 px-6 py-2 bg-(--brand-camel) text-white rounded-lg font-bold hover:opacity-90'
                  >
                    Reset Filters
                  </button>
                </div>
              )}

              {/* Pagination - Clone from Projects Page */}
              {pageItems.length > 0 && (
                <div className='flex justify-center items-center gap-4 mt-12'>
                  {/* Left Arrow */}
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={!hasPrev}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      hasPrev
                        ? 'bg-(--brand-camel) hover:opacity-80 cursor-pointer'
                        : 'bg-amber-200 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <HiOutlineArrowSmallRight className='rotate-45 text-white' size={20} />
                  </button>

                  {/* Page Numbers */}
                  <div className='flex gap-2'>
                    {Array.from({ length: pages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                          page === i + 1
                            ? 'bg-(--brand-camel) text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-500'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  {/* Right Arrow */}
                  <button
                    onClick={() => setPage(p => Math.min(pages, p + 1))}
                    disabled={!hasNext}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      hasNext
                        ? 'bg-(--brand-camel) hover:opacity-80 cursor-pointer'
                        : 'bg-amber-200 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <HiOutlineArrowSmallRight className='-rotate-45 text-white' size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />
      {/* Page-level Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={closeQuickView} />
      )}
    </>
  )
}

export default Shop