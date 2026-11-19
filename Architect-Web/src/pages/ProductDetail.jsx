import React, { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { HiArrowSmallLeft, HiArrowSmallRight, HiOutlinePencilSquare } from 'react-icons/hi2'
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io'
import { productsData } from '../data/productsData'
import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'
import PageHeader from '../components/common/PageHeader'
import ReviewFormModal from '../components/common/ReviewFormModal'

const tabs = ['Description', 'Additional Information', 'Reviews']

const dummyReviews = [
  {
    name: 'John Smith',
    role: 'Verified Buyer',
    rating: 5,
    text: 'Excellent quality! The product exceeded my expectations. Highly recommend to everyone.',
  },
  {
    name: 'Sarah Johnson',
    role: 'Verified Buyer',
    rating: 4,
    text: 'Great product with good build quality. Fast shipping as well.',
  },
  {
    name: 'Michael Brown',
    role: 'Verified Buyer',
    rating: 5,
    text: 'Perfect! Exactly what I was looking for. Will definitely purchase again.',
  },
]

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, toggleWishlist, isInWishlist } = useCart()
  const { showToast } = useUI()
  const [activeTab, setActiveTab] = useState('Description')
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [showReviewModal, setShowReviewModal] = useState(false)

  const product = useMemo(() => productsData.find((p) => String(p.id) === String(id)), [id])

  const gallery = useMemo(() => {
    if (!product) return ['/images/gallery-1.jpg', '/images/gallery-1.jpg', '/images/gallery-1.jpg']
    const base = product.image || '/images/gallery-1.jpg'
    if (product.images?.length) {
      const unique = [...new Set(product.images)]
      while (unique.length < 3) unique.push(unique[unique.length - 1] || base)
      return unique.slice(0, 3)
    }
    return [base, base, base]
  }, [product])

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Product not found</h1>
        <button
          className="px-4 py-2 rounded-lg bg-[var(--brand-camel)] text-white hover:opacity-90"
          onClick={() => navigate('/shop')}
        >
          Back to Shop
        </button>
      </div>
    )
  }

  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = () => {
    addToCart({ ...product, quantity })
    showToast({ type: 'success', message: 'Item added to cart successfully!' })
    setQuantity(1)
  }

  const handleWishlist = () => {
    toggleWishlist(product)
    showToast({
      type: inWishlist ? 'info' : 'success',
      message: inWishlist ? 'Removed from wishlist' : 'Added to wishlist',
    })
  }

  const goTab = (direction) => {
    const current = tabs.indexOf(activeTab)
    const nextIndex = (current + direction + tabs.length) % tabs.length
    setActiveTab(tabs[nextIndex])
  }

  return (
    <>
      <PageHeader title='Product Details' breadcrumb={['HOME', 'SHOP', 'PRODUCT']} />
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10">
            {/* Gallery Section */}
            <div className="space-y-4">
              <div className="relative flex items-center justify-center bg-gray-50 rounded-2xl p-6 overflow-hidden min-h-96 lg:min-h-[500px]">
              <img src={gallery[selectedImage]} alt={product.title} className="w-full h-full max-h-96 lg:max-h-full object-contain" />

              {/* Previous Button */}
              <button
                onClick={() => setSelectedImage((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-[var(--brand-camel)] hover:text-white transition"
              >
                <HiArrowSmallLeft size={20} />
              </button>

              {/* Next Button */}
              <button
                onClick={() => setSelectedImage((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))}
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-[var(--brand-camel)] hover:text-white transition"
              >
                <HiArrowSmallRight size={20} />
              </button>
            </div>

            {/* Thumbnail Images */}
            <div className="hidden md:flex gap-3">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-lg border-2 overflow-hidden flex items-center justify-center transition ${
                    selectedImage === idx ? 'border-[var(--brand-camel)]' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`${product.title}-${idx}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            {/* Title and Rating */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold uppercase">
                  Sale 20% Off
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{product.title}</h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    i <= Math.floor(product.rating) ? (
                      <AiFillStar key={i} className="w-4 h-4 text-[var(--brand-camel)]" />
                    ) : (
                      <AiOutlineStar key={i} className="w-4 h-4 text-gray-300" />
                    )
                  ))}
                </div>
                <span className="font-semibold">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-600 uppercase">Price</span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[var(--brand-camel)]">£{product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">£{product.originalPrice.toFixed(2)}</span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Options removed (size selection not required) */}

            {/* Quantity and Buttons */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <span className="text-sm font-semibold text-gray-900 block mb-2">Quantity</span>
                  <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition"
                    >
                      −
                    </button>
                    <span className="px-6 py-2 text-gray-900 font-semibold min-w-[64px] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full px-6 py-3 rounded-lg bg-[var(--brand-camel)] hover:bg-[var(--brand-camel)]/90 text-white font-semibold transition"
              >
                ADD TO CART
              </button>

              <div className="flex justify-center">
                <button
                  onClick={handleWishlist}
                  className="inline-flex px-4 py-2 border border-gray-300 rounded-3xl items-center font-bold transition-all gap-2 hover:bg-[var(--brand-camel)] hover:border-[var(--brand-camel)] hover:text-white"
                >
                  {inWishlist ? (
                    <>
                      <IoMdHeart className="w-5 h-5 bg-[var(--brand-camel)] p-0.5 rounded-full text-white" />
                      <span>Remove from Wishlist</span>
                    </>
                  ) : (
                    <>
                      <IoMdHeartEmpty className="w-5 h-5 bg-[var(--brand-camel)] p-0.5 rounded-full text-white" />
                      <span>Add to Wishlist</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Meta Info - stacked on mobile, row on md+ */}
            <div className="flex flex-col md:flex-row md:items-center md:gap-8 text-sm text-gray-600">
              <div><strong>SKU:</strong> {`ARCH-${product.id}`}</div>
              <div><strong>Category:</strong> {product.category}</div>
              <div><strong>Stock:</strong> In Stock</div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16 border-t border-gray-200 pt-10">
          {/* Tab Navigation */}
          <div className="flex items-center gap-6 mb-8 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 font-semibold transition relative ${
                  activeTab === tab ? 'text-[var(--brand-camel)]' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--brand-camel)]" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'Description' && (
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  This premium product is crafted with attention to detail and made from high-quality materials. It combines functionality with elegant design, making it a perfect addition to any home or workspace.
                </p>
              </div>
            )}

            {activeTab === 'Additional Information' && (
              <div className="space-y-4">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 pr-4 font-semibold text-gray-900">Dimensions</td>
                      <td className="py-3 text-gray-600">Varies by size</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 pr-4 font-semibold text-gray-900">Weight</td>
                      <td className="py-3 text-gray-600">Varies by size</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 pr-4 font-semibold text-gray-900">Material</td>
                      <td className="py-3 text-gray-600">Premium Quality</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-semibold text-gray-900">Warranty</td>
                      <td className="py-3 text-gray-600">1 Year Limited</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'Reviews' && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="text-4xl font-bold text-[var(--brand-camel)] mb-2">{product.rating}/5</div>
                  <div className="flex gap-1 justify-center mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      i <= Math.floor(product.rating) ? (
                        <AiFillStar key={i} className="w-5 h-5 text-[var(--brand-camel)]" />
                      ) : (
                        <AiOutlineStar key={i} className="w-5 h-5 text-gray-300" />
                      )
                    ))}
                  </div>
                  <p className="text-gray-600">Based on {product.reviews} reviews</p>
                </div>

                <div className="space-y-4">
                  {dummyReviews.map((review, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-[var(--brand-camel)] text-white flex items-center justify-center font-bold">
                          {review.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{review.name}</div>
                          <div className="text-xs text-gray-500">{review.role}</div>
                        </div>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          i <= review.rating ? (
                            <AiFillStar key={i} className="w-4 h-4 text-[var(--brand-camel)]" />
                          ) : (
                            <AiOutlineStar key={i} className="w-4 h-4 text-gray-300" />
                          )
                        ))}
                      </div>
                      <p className="text-gray-700 text-sm">{review.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="inline-flex px-4 py-2 border border-gray-300 rounded-3xl items-center font-bold transition-all gap-2 hover:bg-[var(--brand-camel)] hover:border-[var(--brand-camel)] hover:text-white"
                  >
                    <HiOutlinePencilSquare size={28} className="bg-[var(--brand-camel)] p-0.5 rounded-full text-white" />
                    Write a Review
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Review Form Modal */}
      {showReviewModal && (
        <ReviewFormModal product={product} onClose={() => setShowReviewModal(false)} />
      )}
    </div>
    </>
  )
}
