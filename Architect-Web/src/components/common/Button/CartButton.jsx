import React from 'react'
import { HiOutlineShoppingBag } from 'react-icons/hi2'

function CartButton({ text = 'Add to Cart', className = '', onClick, type = 'button', iconSize = 35 }) {
  const base = `px-4 py-1.5 border border-gray-300 rounded-3xl inline-flex gap-2 items-center font-bold transition-all ${className}`.trim()
  const hoverStyle = 'hover:bg-[var(--brand-camel)] hover:border-[var(--brand-camel)] hover:text-white'

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${hoverStyle}`}
    >
      <span>{text}</span>
      <HiOutlineShoppingBag className='bg-[var(--brand-camel)] p-1.5 rounded-full text-white' size={iconSize} />
    </button>
  )
}

export default CartButton
