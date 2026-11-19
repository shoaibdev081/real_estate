import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { useUI } from '../../context/UIContext'

export default function ReviewFormModal({ product, onClose }) {
  const { showToast } = useUI()
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Minimal validation
    if (!name.trim() || !text.trim()) {
      showToast({ type: 'error', message: 'Please provide your name and review text.' })
      return
    }

    // In a real app we'd POST this to an API. For now show a toast and close.
    showToast({ type: 'success', message: 'Thanks — your review has been submitted.' })
    setName('')
    setRating(5)
    setText('')
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />

        <div className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden">
          <button
            aria-label="Close review form"
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:text-gray-900 z-10"
          >
            <IoClose size={18} />
          </button>

          <div className="p-6">
            <h3 className="text-lg font-semibold mb-3">Write a review for {product.title}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Your name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-camel)]/60"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none"
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Very good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Terrible</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Your review</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={5}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--brand-camel)]/60"
                />
              </div>

              <div className="flex items-center gap-3 justify-end">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-[var(--brand-camel)] text-white font-semibold">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
