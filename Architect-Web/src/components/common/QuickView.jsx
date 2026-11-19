import React, { useMemo, useState } from 'react'
import { useCart } from '../../context/CartContext'
import { useUI } from '../../context/UIContext'
import { FiX } from 'react-icons/fi'
import { HiArrowSmallLeft, HiArrowSmallRight } from 'react-icons/hi2'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io'

export default function QuickView({ product, onClose }) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart()
  const { showToast } = useUI()
  const [quantity, setQuantity] = useState(1)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const inWishlist = useMemo(() => (product ? isInWishlist(product.id) : false), [product, isInWishlist])

  const safeTitle = product?.title || 'Product'
  const safePrice = product?.price !== undefined && !Number.isNaN(Number(product.price)) ? Number(product.price) : 0
  const safeOriginal = product?.originalPrice !== undefined && !Number.isNaN(Number(product?.originalPrice)) ? Number(product.originalPrice) : undefined
  const fallbackImg = product?.image || '/images/gallery-1.jpg'

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

  const handleAddToCart = () => {
    if (!product) return
    addToCart({ ...product, quantity })
    showToast({ type: 'success', message: 'Item added to cart' })
    setQuantity(1)
    onClose()
  }

  const handleWishlist = () => {
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
      if (next < 1) return 1
      return next
    })
  }

  if (!product) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} aria-hidden />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden">
        <button
          aria-label="Close quick view"
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:text-gray-900 z-10"
        >
          <FiX size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6 md:gap-8 p-4 sm:p-6 md:p-8">
          {/* Gallery Section */}
          <div className="relative flex items-center justify-center bg-gray-50 rounded-2xl p-4 sm:p-6 min-h-96">
            <img 
              src={gallery[selectedIndex]} 
              alt={safeTitle} 
              className="w-full h-full max-h-96 object-contain transition"
            />

            {/* Previous Button */}
            <button
              onClick={() => setSelectedIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-[var(--brand-camel)] hover:text-white transition"
            >
              <HiArrowSmallLeft size={20} />
            </button>

            {/* Next Button */}
            <button
              onClick={() => setSelectedIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-[var(--brand-camel)] hover:text-white transition"
            >
              <HiArrowSmallRight size={20} />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {gallery.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  aria-label={`View image ${idx + 1}`}
                  className={`w-2 h-2 rounded-full transition ${
                    selectedIndex === idx ? 'bg-[var(--brand-camel)]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col gap-4 py-2">
            {/* Title and Rating */}
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{safeTitle}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    i <= Math.floor(product?.rating || 0) ? (
                      <AiFillStar key={i} className="w-4 h-4 text-amber-400" />
                    ) : (
                      <AiOutlineStar key={i} className="w-4 h-4 text-gray-300" />
                    )
                  ))}
                </div>
                <span className="font-semibold">({product?.reviews || 0} reviews)</span>
              </div>
            </div>

            {/* View Full Details */}
            <button className="text-sm font-semibold text-[var(--brand-camel)] hover:underline">
              VIEW FULL PRODUCT DETAILS →
            </button>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
              {product?.description || 'High-quality product with excellent craftsmanship and attention to detail.'}
            </p>

            {/* Size/Option Selector */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">SIZE</label>
              <select className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-camel)]/60">
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
              </select>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">£{safePrice.toFixed(2)}</span>
              {safeOriginal && (
                <span className="text-lg text-gray-400 line-through">£{safeOriginal.toFixed(2)}</span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-800">Quantity</span>
              <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white overflow-hidden">
                <button
                  onClick={() => changeQty(-1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="px-4 py-2 text-gray-900 font-semibold min-w-[48px] text-center">{quantity}</span>
                <button
                  onClick={() => changeQty(1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-camel)] hover:bg-[var(--brand-camel)]/90 text-white font-semibold px-4 py-3 transition"
              >
                ADD TO BASKET
              </button>
              <button
                onClick={handleWishlist}
                className="w-12 h-12 rounded-lg border border-gray-300 hover:border-[var(--brand-camel)] bg-white text-gray-600 flex items-center justify-center transition"
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {inWishlist ? (
                  <IoMdHeart className="w-6 h-6 text-[var(--brand-camel)]" />
                ) : (
                  <IoMdHeartEmpty className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
