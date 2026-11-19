import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineHeart, HiOutlineEye, HiOutlineShoppingBag } from 'react-icons/hi2'
import { IoMdHeart } from 'react-icons/io'
import { useCart } from '../../context/CartContext'
import { useUI } from '../../context/UIContext'

function ShopProductCard({ product, viewMode = 'grid', onQuickView }) {
  const { addToCart, toggleWishlist, isInWishlist, isInCart } = useCart()
  const { showToast } = useUI()
  const navigate = useNavigate()
  const [showHoverIcons, setShowHoverIcons] = useState(false)

  const inWishlist = useMemo(() => isInWishlist(product.id), [product.id, isInWishlist])

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalf = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className='text-[var(--brand-camel)]'>★</span>
      )
    }

    if (hasHalf) {
      stars.push(
        <span key='half' className='text-[var(--brand-camel)]'>★</span>
      )
    }

    const remaining = 5 - Math.ceil(rating)
    for (let i = 0; i < remaining; i++) {
      stars.push(
        <span key={`empty-${i}`} className='text-gray-300'>★</span>
      )
    }

    return stars
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart({ ...product, quantity: 1 })
    showToast({ type: 'success', message: 'Item added to cart!' })
  }

  const handleToggleWishlist = (e) => {
    e.stopPropagation()
    toggleWishlist(product)
    showToast({
      type: inWishlist ? 'info' : 'success',
      message: inWishlist ? 'Removed from wishlist' : 'Added to wishlist',
    })
  }

  const handleQuickView = (e) => {
    e.stopPropagation()
    if (onQuickView) return onQuickView(product)
    return null
  }

  const handleNavigateProduct = (e) => {
    e.stopPropagation()
    navigate(`/product/${product.id}`)
  }

  if (viewMode === 'list') {
    return (
      <>
        <div className='flex items-stretch gap-6 pb-6 border-b border-gray-200 last:border-b-0'>
          {/* Image Section */}
          <div
            className='relative w-48 shrink-0 rounded-lg overflow-hidden bg-gray-100 cursor-pointer group'
            onMouseEnter={() => setShowHoverIcons(true)}
            onMouseLeave={() => setShowHoverIcons(false)}
            onClick={handleNavigateProduct}
          >
            <img
              src={product.image}
              alt={product.title}
              className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
            />

            {/* Hover Overlay */}
            {showHoverIcons && (
              <div className='absolute inset-0 bg-black/10 flex flex-col items-end gap-3 p-3 justify-center'>
                <button
                  className={`p-2 rounded-full transition-colors ${
                    inWishlist
                      ? 'bg-white text-[var(--brand-camel)] hover:bg-gray-100'
                      : 'bg-white text-gray-800 hover:bg-[var(--brand-camel)] hover:text-white'
                  }`}
                  onClick={handleToggleWishlist}
                  title='Add to wishlist'
                >
                  {inWishlist ? (
                    <IoMdHeart size={20} className='fill-[var(--brand-camel)]' />
                  ) : (
                    <HiOutlineHeart size={20} />
                  )}
                </button>
                <button
                  className='p-2 rounded-full bg-white text-gray-800 hover:bg-[var(--brand-camel)] hover:text-white transition-colors'
                  title='Quick view'
                  onClick={handleQuickView}
                >
                  <HiOutlineEye size={20} />
                </button>
                <button
                  className='p-2 rounded-full bg-white text-gray-800 hover:bg-[var(--brand-camel)] hover:text-white transition-colors flex items-center justify-center'
                  title='Add to cart'
                  onClick={handleAddToCart}
                >
                  <HiOutlineShoppingBag size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className='flex-1 flex flex-col justify-between'>
            <div>
              <div className='flex gap-1 mb-3 items-center'>
                {renderStars(product.rating)}
                <span className='text-gray-600 text-sm ml-2'>({product.reviews} reviews)</span>
              </div>
              <h3 className='text-lg font-bold text-gray-900 mb-2 cursor-pointer hover:text-[var(--brand-camel)]' onClick={handleNavigateProduct}>{product.title}</h3>
              <p className='text-gray-600 text-sm line-clamp-2'>{product.description}</p>
            </div>

              <div className='mt-4'>
              <div className='text-2xl font-bold text-gray-900'>£{product.price.toFixed(2)}</div>
              <button 
                onClick={handleAddToCart}
                className='mt-3 inline-flex gap-2 px-4 py-2 border border-gray-300 rounded-3xl items-center font-bold transition-all hover:bg-[var(--brand-camel)] hover:border-[var(--brand-camel)] hover:text-white'
              >
                <span>Add To Cart</span>
                <HiOutlineShoppingBag className='bg-[var(--brand-camel)] p-1.5 rounded-full text-white' size={28} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick View handled at page level via onQuickView prop */}
      </>
    )
  }

  // Grid View
  return (
    <div className='flex flex-col gap-4 group cursor-pointer'>
      {/* Image with Rounded Corners */}
      <div
        className='relative w-full h-80 rounded-2xl overflow-hidden bg-gray-100'
        onMouseEnter={() => setShowHoverIcons(true)}
        onMouseLeave={() => setShowHoverIcons(false)}
        onClick={handleNavigateProduct}
      >
        <img
          src={product.image}
          alt={product.title}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
        />

        {/* Hover Overlay */}
        {showHoverIcons && (
          <div className='absolute inset-0 bg-black/10 flex items-center justify-end p-6'>
            {/* Icons on Right Side */}
            <div className='flex flex-col gap-3'>
              <button
                className={`p-2.5 rounded-full transition-colors ${
                  inWishlist
                    ? 'bg-white text-[var(--brand-camel)] hover:bg-gray-100'
                    : 'bg-white text-gray-800 hover:bg-[var(--brand-camel)] hover:text-white'
                }`}
                onClick={handleToggleWishlist}
                title='Add to wishlist'
              >
                {inWishlist ? (
                  <IoMdHeart size={20} className='fill-[var(--brand-camel)]' />
                ) : (
                  <HiOutlineHeart size={20} />
                )}
              </button>
              <button
                className='p-2.5 rounded-full bg-white text-gray-800 hover:bg-[var(--brand-camel)] hover:text-white transition-colors'
                title='Quick view'
                onClick={handleQuickView}
              >
                <HiOutlineEye size={20} />
              </button>
              <button
                className='p-2.5 rounded-full bg-white text-gray-800 hover:bg-[var(--brand-camel)] hover:text-white transition-colors flex items-center justify-center'
                title='Add to cart'
                onClick={handleAddToCart}
              >
                <HiOutlineShoppingBag size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content - Centered */}
      <div className='text-center'>
        {/* Rating */}
        <div className='flex gap-0.5 items-center justify-center mb-2'>
          <div className='flex gap-0.5'>
            {renderStars(product.rating)}
          </div>
          <span className='text-gray-600 text-xs ml-1'>({product.reviews})</span>
        </div>

        {/* Title */}
        <h3 className='text-base font-bold text-gray-900 line-clamp-2 mb-1 cursor-pointer hover:text-[var(--brand-camel)]' onClick={handleNavigateProduct}>{product.title}</h3>

        {/* Price */}
        <p className='text-lg font-bold text-gray-900'>£{product.price.toFixed(2)}</p>
      </div>

      {/* Quick View handled at page level via onQuickView prop */}
    </div>
  )
}

export default ShopProductCard

