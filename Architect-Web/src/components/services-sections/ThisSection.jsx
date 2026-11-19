import React, { useState, useEffect } from 'react'
import { apiRequest, getImageUrl } from '../../lib/apiClient'
import { servicesData } from '../../data/servicesData'

function mapServiceData(item) {
  return {
    id: item._id,
    title: item.title,
    desc: item.desc2 || item.desc,
    img: getImageUrl(item.image),
  }
}


export default function ThisSection() {
  const defaultItems = (servicesData || []).map(mapServiceData)
  const [items, setItems] = useState(defaultItems)
  const [active, setActive] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true)
        const res = await apiRequest('/services')
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setItems(res.data.map(mapServiceData))
        }
      } catch (err) {
        console.warn('Could not fetch services from API, using default services:', err?.message || err)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  if (loading) {
    return <div className="py-20 text-center text-xl">Loading services...</div>
  }
  if (!items.length) {
    return <div className="py-20 text-center text-xl">No services found.</div>
  }

  return (
    <section className="relative w-full h-auto md:h-130 lg:h-150 overflow-hidden">
      {/* Background - Hidden on small screens, visible on md and up */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500 hidden md:block"
        style={{ backgroundImage: `url(${items[active]?.img || items[0]?.img || '/images/service-1.jpg'})` }}
        aria-hidden
      />

      <div className="absolute inset-0 bg-black/55 hidden md:block" />

      {/* Small Screen Layout (less than md) */}
      <div className="md:hidden relative z-20 flex flex-col">
        {items.map((it, idx) => (
          <button
            key={it.id}
            onMouseEnter={() => setActive(idx)}
            onFocus={() => setActive(idx)}
            className="group flex-1 relative p-6 text-left bg-transparent transition-colors duration-300 focus:outline-none border-b border-white/30 last:border-b-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-500 opacity-40"
              style={{ backgroundImage: `url(${it.img})` }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative z-10 flex flex-col pt-4 justify-start">
              {/* Number */}
              <div className="text-white/40 text-4xl font-extrabold drop-shadow-lg mb-3">
                {String(idx + 1).padStart(2, '0')}
              </div>

              {/* Title */}
              <h3 className="text-white text-lg font-bold leading-tight whitespace-pre-line mb-3">
                {it.title}
              </h3>

              {/* Description */}
              <p className={`text-xs text-white/90 max-w-md transition-all duration-300 transform ${active === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                {it.desc}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Large Screen Layout (md and up) */}
      <div className="relative z-20 h-full flex-col md:flex-row items-stretch hidden md:flex">
        {items.map((it, idx) => (
          <button
            key={it.id}
            onMouseEnter={() => setActive(idx)}
            onFocus={() => setActive(idx)}
            className={`group flex-1 relative p-8 md:p-12 text-left bg-transparent transition-colors duration-300 focus:outline-none border-l border-white/20 first:border-l-0`}
          >
            <div className="flex flex-col h-full pt-12 md:pt-16 lg:pt-20 justify-end">
              {/* Number */}
              <div className="text-white/30 text-5xl md:text-6xl lg:text-7xl font-extrabold drop-shadow-lg mb-6">
                {String(idx + 1).padStart(2, '0')}
              </div>

              {/* Title */}
              <h3 className="text-white text-2xl md:text-xl lg:text-2xl font-bold leading-tight whitespace-pre-line mb-6">
                {it.title}
              </h3>

              {/* Description */}
              <p className={`text-sm text-white/90 max-w-md transition-all duration-300 transform ${active === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                {it.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
