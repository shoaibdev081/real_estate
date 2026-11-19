import React from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineArrowSmallRight } from 'react-icons/hi2'

function SecondaryButton({ text, className = '', href, type, onClick, iconSize = 24 }) {
  const base = `px-4 py-2 border border-gray-300 rounded-3xl flex gap-2 items-center font-bold transition-all ${className}`.trim()

  const content = (
    <>
      <span>{text}</span>
      <HiOutlineArrowSmallRight className='bg-(--brand-camel) p-1 rounded-full -rotate-45 text-white' size={iconSize + 8} />
    </>
  )

  const hoverStyle = 'hover:bg-(--brand-camel) hover:border-(--brand-camel) hover:text-white'

  if (href) {
    return (
      <Link to={href} className={`${base} ${hoverStyle}`}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type || 'button'} onClick={onClick} className={`${base} ${hoverStyle}`}>
      {content}
    </button>
  )
}

export default SecondaryButton
