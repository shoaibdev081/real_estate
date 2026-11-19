import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'

import { apiRequest, getImageUrl } from '../../lib/apiClient'
import { HiOutlineArrowSmallRight } from 'react-icons/hi2'

const DEFAULT_PROJECTS = [
  {
    id: 'minimalist-villa-residence',
    slug: 'minimalist-villa-residence',
    title: 'Minimalist Villa Residence',
    location: 'Lahore, Pakistan',
    year: '2024',
    image: '/images/gallery-1.jpg',
  },
  {
    id: 'skyline-commercial-tower',
    slug: 'skyline-commercial-tower',
    title: 'Skyline Commercial Tower',
    location: 'Islamabad, Pakistan',
    year: '2023',
    image: '/images/gallery-6.jpg',
  },
  {
    id: 'serene-urban-penthouse',
    slug: 'serene-urban-penthouse',
    title: 'Serene Urban Penthouse',
    location: 'Karachi, Pakistan',
    year: '2024',
    image: '/images/gallery-11.jpg',
  },
];

export default function Projects() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState(DEFAULT_PROJECTS)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const perPage = 3
  const total = projects.length
  const pages = Math.ceil(total / perPage)

  useEffect(() => {
    setLoading(true)
    apiRequest('/projects')
      .then(res => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setProjects(res.data)
        }
      })
      .catch(err => {
        console.warn('Using default projects fallback:', err?.message || err)
      })
      .finally(() => setLoading(false))
  }, [])

  const start = (page - 1) * perPage
  const pageItems = projects.slice(start, start + perPage)

  const hasPrev = page > 1
  const hasNext = page < pages

  return (
    <>
      <PageHeader title={'Our Projects'} breadcrumb={['HOME', 'PROJECTS']} />

      <section className="py-16 lg:py-24 px-6 lg:px-8">
        <div className="mx-auto">
          {/* Projects Grid with Carousel-style Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {pageItems.map(p => (
              <div
                key={p._id || p.id}
                onClick={() => navigate(`/projects/${p.slug || p._id || p.id}`)}
                className="cursor-pointer rounded-2xl overflow-hidden flex flex-col gap-4 group"
              >
                {/* Card Image with Zoom on Hover */}
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={getImageUrl(p.image || p.mainImage)}
                    alt={p.title}
                    className="w-full h-96 md:h-112 lg:h-120 object-cover block transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Text Below Card */}
                <div className="px-6 pb-6 flex flex-col gap-1">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800">{p.title}</h3>
                  <p className="text-gray-500 text-sm">{p.location}</p>
                  <p className="text-gray-500 text-sm">{p.year}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Arrow Pagination */}
          <div className="flex justify-center items-center gap-4">
            {/* Left Arrow - 45deg */}
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={!hasPrev}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                hasPrev
                  ? 'bg-(--brand-camel) hover:opacity-80 cursor-pointer'
                  : 'bg-amber-200 cursor-not-allowed opacity-60'
              }`}
            >
              <HiOutlineArrowSmallRight className="rotate-45 text-white" size={20} />
            </button>

            {/* Page Numbers */}
            <div className="flex gap-2">
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    page === i + 1
                      ? 'bg-(--brand-camel) text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-500'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Right Arrow - 45deg */}
            <button
              onClick={() => setPage(p => Math.min(pages, p + 1))}
              disabled={!hasNext}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                hasNext
                  ? 'bg-(--brand-camel) hover:opacity-80 cursor-pointer'
                  : 'bg-amber-200 cursor-not-allowed opacity-60'
              }`}
            >
              <HiOutlineArrowSmallRight className="-rotate-45 text-white" size={20} />
            </button>
          </div>
        </div>
      </section>
    </>
  )
}