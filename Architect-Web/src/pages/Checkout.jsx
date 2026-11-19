import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useUI } from '../context/UIContext'
import { trackEvent } from '../lib/metaPixel'

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart()
  const { showToast } = useUI()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    createAccount: false,
  })

  const shippingFee = 0
  const total = cartTotal + shippingFee

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address) {
      showToast({ type: 'error', message: 'Please fill in all required fields' })
      return
    }
    showToast({ type: 'success', message: 'Order placed successfully!' })
    
    // Track Meta Pixel Purchase event for conversion tracking
    trackEvent('Purchase', {
      value: total,
      currency: 'GBP',
      num_items: cart.length,
      content_type: 'product',
    })

    clearCart()
    setTimeout(() => {
      window.location.href = '/'
    }, 2000)
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-8 md:py-10 lg:py-12 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Your cart is empty</h1>
        <p className="text-gray-600 mb-6">Please add items to your cart before checkout.</p>
        <Link to="/shop" className="inline-block px-6 py-3 bg-[var(--brand-camel)] text-white rounded-lg font-semibold hover:opacity-90">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-8 md:py-10 lg:py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--brand-camel)] text-white flex items-center justify-center text-sm font-bold">1</div>
              <span className="text-sm font-semibold text-gray-900">Shipping</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-4" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold">2</div>
              <span className="text-sm font-medium text-gray-600">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-6 lg:gap-8 xl:gap-10 items-start">
          {/* Left Column - Billing Details */}
          <div className="space-y-6">
            {/* Returning Customer */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 sm:px-6 py-3.5 sm:py-4">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer text-sm sm:text-base font-medium text-gray-700 hover:text-[var(--brand-camel)] transition">
                  <span>Returning customer? Click here to login</span>
                  <span className="text-gray-400 group-open:rotate-180 transition">▾</span>
                </summary>
                <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-camel)]/60 focus:border-[var(--brand-camel)]"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-camel)]/60 focus:border-[var(--brand-camel)]"
                  />
                  <button className="w-full px-4 py-2 bg-[var(--brand-camel)] text-white rounded-lg font-semibold hover:opacity-90 transition">
                    Login
                  </button>
                </div>
              </details>
            </div>

            {/* Billing Details Form */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 sm:px-6 md:px-7 py-5 sm:py-6 md:py-7">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-5">Billing details</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-1">
                    <label className="text-xs sm:text-sm font-medium text-gray-900">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-camel)]/60 focus:border-[var(--brand-camel)] transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs sm:text-sm font-medium text-gray-900">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-camel)]/60 focus:border-[var(--brand-camel)] transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-900">Company Name</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-camel)]/60 focus:border-[var(--brand-camel)] transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-900">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[var(--brand-camel)]/60 focus:border-[var(--brand-camel)] transition"
                  >
                    <option value="">Select country</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    <option value="PK">Pakistan</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-900">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House number and street name"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-camel)]/60 focus:border-[var(--brand-camel)] transition"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-1">
                    <label className="text-xs sm:text-sm font-medium text-gray-900">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-camel)]/60 focus:border-[var(--brand-camel)] transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs sm:text-sm font-medium text-gray-900">Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-camel)]/60 focus:border-[var(--brand-camel)] transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-900">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-camel)]/60 focus:border-[var(--brand-camel)] transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs sm:text-sm font-medium text-gray-900">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-camel)]/60 focus:border-[var(--brand-camel)] transition"
                  />
                </div>

                <label className="flex items-center gap-2 pt-2 text-xs sm:text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="createAccount"
                    checked={formData.createAccount}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-[var(--brand-camel)] accent-[var(--brand-camel)]"
                  />
                  <span>Create an account</span>
                </label>

                {/* Order Button at Bottom of Form */}
                <button
                  type="submit"
                  className="w-full mt-6 px-6 py-3 bg-[var(--brand-camel)] hover:bg-[var(--brand-camel)]/90 text-white rounded-lg font-semibold transition hidden md:block"
                >
                  Place Order
                </button>
              </form>
            </section>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>

              {/* Order Items */}
              <div className="space-y-4 pb-6 border-b border-gray-100 max-h-80 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                      £{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 py-6 border-b border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">£{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-gray-900">Free</span>
                </div>
              </div>

              <div className="py-6 flex items-center justify-between">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-[var(--brand-camel)]">£{total.toFixed(2)}</span>
              </div>

              {/* Mobile Order Button */}
              <button
                onClick={handleSubmit}
                className="w-full px-6 py-3 bg-[var(--brand-camel)] hover:bg-[var(--brand-camel)]/90 text-white rounded-lg font-semibold transition md:hidden"
              >
                Place Order
              </button>

              {/* Additional Info */}
              <p className="text-xs text-gray-500 text-center mt-4">
                Your personal data will be used to support your experience throughout this website, to manage access to your account and more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
