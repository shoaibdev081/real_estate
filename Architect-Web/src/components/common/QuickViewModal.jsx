import React, { useEffect, useMemo, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { HiArrowSmallLeft, HiArrowSmallRight, HiOutlineHeart, HiOutlineShoppingBag } from 'react-icons/hi2'
import { IoMdHeart } from 'react-icons/io'
import { useCart } from '../../context/CartContext'
import { useUI } from '../../context/UIContext'

export default function QuickViewModal({ product, onClose }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart()
  const { showToast } = useUI()
  const [quantity, setQuantity] = useState(1)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inWishlist = useMemo(() => (product ? isInWishlist(product.id) : false), [product, isInWishlist])

  const fallbackImg = product?.image || '/images/intro-bg.avif'
  
  const getGalleryImages = () => {
    if (product?.images && product.images.length > 0) {
      const uniqueImages = [...new Set(product.images)]
      while (uniqueImages.length < 3) {
        uniqueImages.push(uniqueImages[uniqueImages.length - 1] || fallbackImg)
      }
      return uniqueImages.slice(0, 3)
    }
    return [fallbackImg, fallbackImg, fallbackImg]
  }

  const gallery = getGalleryImages()

  useEffect(() => {
    setSelectedIndex(0)
    setQuantity(1)
  }, [product])

  const handleAddToCart = () => {
    if (!product) return
    addToCart({ ...product, quantity })
    showToast({ type: 'success', message: 'Item added to cart!' })
    setQuantity(1)
  }

  const handleToggleWishlist = () => {
    if (!product) return
    toggleWishlist(product)
    showToast({
      type: inWishlist ? 'info' : 'success',
      message: inWishlist ? 'Removed from wishlist' : 'Added to wishlist',
    })
  }

  const changeQty = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta
      return next < 1 ? 1 : next
    })
  }

  const handlePrevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + gallery.length) % gallery.length)
  }

  const handleNextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % gallery.length)
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalf = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className='text-amber-500'>★</span>
      )
    }

    if (hasHalf) {
      stars.push(
        <span key='half' className='text-amber-500'>★</span>
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

  if (!product) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden />

        <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden">
          <button
            aria-label="Close quick view"
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:text-gray-900 z-10"
          >
            <IoClose size={20} />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 p-4 sm:p-6 lg:p-8">
            {/* Gallery Section */}
            <div className="flex flex-col gap-4">
              {/* Main Image */}
              <div className="relative bg-gray-50 rounded-2xl h-96 flex items-center justify-center overflow-hidden border border-gray-200">
                <img 
                  src={gallery[selectedIndex]} 
                  alt={product.title}
                  className='w-full h-full object-contain p-6'
                />

                {/* Navigation Arrows */}
                <button
                  onClick={handlePrevImage}
                  className='absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center text-gray-700 transition-all'
                  aria-label="Previous image"
                >
                  <HiArrowSmallLeft size={20} />
                </button>
                <button
                  onClick={handleNextImage}
                  className='absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center text-gray-700 transition-all'
                  aria-label="Next image"
                >
                  <HiArrowSmallRight size={20} />
                </button>
              </div>

              {/* Thumbnails */}
              <div className='flex gap-3'>
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedIndex(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedIndex === idx
                        ? 'border-[var(--brand-camel)]'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img src={img} alt={`${product.title}-${idx}`} className='w-full h-full object-contain p-2' />
                  </button>
                ))}
              </div>
            </div>

            {/* Details Section */}
            <div className="flex flex-col gap-6">
              {/* Rating & Status */}
              <div>
                <div className='flex gap-1 items-center mb-3'>
                  {renderStars(product.rating)}
                  <span className='text-gray-600 text-sm ml-2'>({product.reviews} reviews)</span>
                </div>
                <h2 className='text-2xl font-bold text-gray-900 mb-4'>{product.title}</h2>
                <p className='text-gray-600 text-sm line-clamp-3'>{product.description}</p>
              </div>

              {/* Price Section */}
              <div>
                <div className='text-3xl font-bold text-gray-900'>£{product.price.toFixed(2)}</div>
              </div>

              {/* Quantity Selector */}
              <div className='flex items-center gap-4'>
                <span className='text-gray-700 font-semibold'>Quantity:</span>
                <div className='inline-flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white'>
                  <button
                    className='px-4 py-2 text-gray-600 hover:bg-gray-100 transition'
                    onClick={() => changeQty(-1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <div className='px-6 py-2 text-gray-900 font-medium'>{quantity}</div>
                  <button
                    className='px-4 py-2 text-gray-600 hover:bg-gray-100 transition'
                    onClick={() => changeQty(1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-3 flex-col sm:flex-row'>
                <button
                  onClick={handleAddToCart}
                  className='flex-1 px-6 py-3 bg-[var(--brand-camel)] text-white rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2'
                >
                  <HiOutlineShoppingBag size={20} />
                  Add to Cart
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`px-6 py-3 rounded-lg font-semibold transition border-2 flex items-center justify-center gap-2 ${
                    inWishlist
                      ? 'bg-white border-[var(--brand-camel)] text-[var(--brand-camel)]'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-[var(--brand-camel)]'
                  }`}
                >
                  {inWishlist ? (
                    <>
                      <IoMdHeart size={20} className='fill-[var(--brand-camel)]' />
                      Saved
                    </>
                  ) : (
                    <>
                      <HiOutlineHeart size={20} />
                      Save
                    </>
                  )}
                </button>
              </div>

              {/* Additional Info */}
              <div className='border-t border-gray-200 pt-4 space-y-2 text-sm text-gray-600'>
                <div>✓ Free Shipping on orders over £100</div>
                <div>✓ 30-day money-back guarantee</div>
                <div>✓ Secure checkout</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
