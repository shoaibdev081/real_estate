import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import PageHeader from '../components/common/PageHeader'
import NewsletterSection from '../components/home-sections/NewsletterSection'

export default function Cart() {
  const { cart, cartTotal, updateCartQuantity, removeFromCart } = useCart()
  const hasItems = cart.length > 0

  return (
    <>
      <PageHeader title='Shopping Cart' breadcrumb={['HOME', 'CART']} />
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-6 md:py-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Your Cart</h1>

          {!hasItems && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 text-center text-sm text-gray-600">
              <p className="mb-4">Your cart is currently empty.</p>
              <Link to="/shop" className="inline-block px-6 py-3 bg-[var(--brand-camel)] text-white rounded-lg font-semibold hover:opacity-90 transition">
                Continue Shopping
              </Link>
            </div>
          )}

          {hasItems && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Mobile / Tablet Card Layout */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 md:hidden">
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">{item.title}</p>
                        <p className="mt-1 text-xs text-gray-500">Price: £{item.price.toFixed(2)}</p>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center border border-gray-200 rounded-full overflow-hidden bg-gray-50">
                            <button
                              className="px-3 py-1 text-gray-600 text-sm hover:bg-white transition"
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            >
                              −
                            </button>
                            <div className="px-4 py-1 text-sm font-medium text-gray-900">{item.quantity}</div>
                            <button
                              className="px-3 py-1 text-gray-600 text-sm hover:bg-white transition"
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="ml-3 text-xs text-red-500 hover:text-red-600 font-medium transition"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">£{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
                        <th className="py-3 pr-4">Product</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Quantity</th>
                        <th className="py-3 px-4">Subtotal</th>
                        <th className="py-3 pl-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50/50 transition">
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
                                <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{item.title}</div>
                                <div className="text-xs text-gray-500">Price: £{item.price.toFixed(2)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 align-middle">£{item.price.toFixed(2)}</td>
                          <td className="py-4 px-4 align-middle">
                            <div className="inline-flex items-center border border-gray-200 rounded-full overflow-hidden bg-gray-50">
                              <button
                                className="px-3 py-1 text-gray-600 text-sm hover:bg-white transition"
                                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              >
                                −
                              </button>
                              <div className="px-4 py-1 text-sm font-medium text-gray-900">{item.quantity}</div>
                              <button
                                className="px-3 py-1 text-gray-600 text-sm hover:bg-white transition"
                                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-4 align-middle font-semibold text-gray-900">
                            £{(item.price * item.quantity).toFixed(2)}
                          </td>
                          <td className="py-4 pl-4 align-middle text-right">
                            <button
                              className="text-sm text-red-500 hover:text-red-600 font-medium transition"
                              onClick={() => removeFromCart(item.id)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Cart Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>

                <div className="space-y-4 pb-6 border-b border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">£{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-gray-900">Free</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold text-gray-900">Calculated at checkout</span>
                  </div>
                </div>

                <div className="py-6 flex items-center justify-between">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-[var(--brand-camel)]">£{cartTotal.toFixed(2)}</span>
                </div>

                <Link
                  to="/checkout"
                  className="block w-full text-center px-4 py-3 bg-[var(--brand-camel)] hover:bg-[var(--brand-camel)]/90 text-white rounded-lg font-semibold transition"
                >
                  Proceed To Checkout
                </Link>
                <Link
                  to="/shop"
                  className="block w-full text-center px-4 py-3 mt-3 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
      <NewsletterSection />
    </>
  )
}