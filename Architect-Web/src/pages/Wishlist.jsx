import React from 'react'
import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'
import { Link } from 'react-router-dom'
import { IoMdHeart } from 'react-icons/io'
import { HiOutlineShoppingBag, HiOutlineTrash } from 'react-icons/hi2'
import PageHeader from '../components/common/PageHeader'
import NewsletterSection from '../components/home-sections/NewsletterSection'

export default function Wishlist() {
  const { wishlist, addToCart, toggleWishlist } = useCart()
  const { showToast } = useUI()

  const handleAddToCart = (item) => {
    addToCart({ ...item, quantity: 1 })
    showToast({ type: 'success', message: 'Item added to cart!' })
  }

  const handleRemoveFromWishlist = (item) => {
    toggleWishlist(item)
    showToast({ type: 'info', message: 'Removed from wishlist' })
  }

  if (wishlist.length === 0) {
    return (
      <>
        <PageHeader title='Wishlist' breadcrumb={['HOME', 'WISHLIST']} />
        <div className="bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-16 md:py-24">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <IoMdHeart className="w-20 h-20 text-gray-300" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Your Wishlist Is Empty</h1>
              <p className="text-gray-600 mb-8">Add items to your wishlist and they will be saved here for future reference.</p>
              <Link 
                to="/shop" 
                className="inline-block px-6 py-3 bg-[var(--brand-camel)] text-white rounded-lg font-semibold hover:opacity-90 transition"
              >
                Browse Shop
              </Link>
            </div>
          </div>
          <NewsletterSection />
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title='Wishlist' breadcrumb={['HOME', 'WISHLIST']} />
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-10 md:py-14">
          <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900">My Wishlist ({wishlist.length})</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
            >
              {/* Image */}
              <div className="w-full h-64 bg-gray-100 rounded-t-2xl overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-contain p-4" 
                />
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[var(--brand-camel)]">£{item.price.toFixed(2)}</span>
                  {item.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">£{item.originalPrice.toFixed(2)}</span>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="inline-flex px-4 py-2 border border-gray-300 rounded-3xl items-center font-bold transition-all gap-2 hover:bg-[var(--brand-camel)] hover:border-[var(--brand-camel)] hover:text-white"
                  >
                    <HiOutlineShoppingBag size={18} />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(item)}
                    className="inline-flex px-4 py-2 border border-gray-300 rounded-3xl items-center font-bold transition-all gap-2 hover:bg-red-500 hover:border-red-500 hover:text-white"
                  >
                    <HiOutlineTrash size={18} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Can't find what you're looking for?</p>
            <Link 
              to="/shop" 
              className="inline-flex px-4 py-2 border border-gray-300 rounded-3xl items-center font-bold transition-all gap-2 hover:bg-[var(--brand-camel)] hover:border-[var(--brand-camel)] hover:text-white"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <NewsletterSection />
    </>
  )
}
