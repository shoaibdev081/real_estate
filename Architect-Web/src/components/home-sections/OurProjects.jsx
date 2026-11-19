import React, {useRef, useEffect, useState} from 'react'
import TitleBadge from '../common/TitleBadge'
import { useNavigate } from 'react-router-dom'
import { apiRequest, getImageUrl } from '../../lib/apiClient'

export default function OurProjects() {
  const containerRef = useRef(null)
  const [isInteracting, setIsInteracting] = useState(false)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiRequest('/projects')
        // Map backend data to frontend format
        const mappedProjects = (response.data || []).map(project => ({
          id: project.slug || project._id || project.id,
          title: project.title,
          location: project.location,
          year: project.year,
          image: project.mainImage || project.image
        }))
        setProjects(mappedProjects)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Auto-advance every 10s
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let timer = null

    const startAuto = () => {
      timer = setInterval(() => {
        if (isInteracting) return
        // scroll by container width to show next set of cards
        const scrollAmount = el.clientWidth
        if (el.scrollLeft + scrollAmount >= el.scrollWidth - 10) {
          // loop back to start
          el.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          el.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        }
      }, 2000)
    }

    startAuto()
    return () => clearInterval(timer)
  }, [isInteracting])

  // Pause auto-advance when user interacts
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let pointerDown = false

    const onPointerDown = () => { pointerDown = true; setIsInteracting(true) }
    const onPointerUp = () => { pointerDown = false; setTimeout(()=>setIsInteracting(false), 1200) }

    el.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [])

  const handleCardClick = (projectId) => {
    navigate(`/projects/${projectId}`)
  }

  // Show loading state
  if (loading) {
    return (
      <section className='py-16 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 w-full bg-white'>
        <div className='mx-auto flex flex-col gap-12'>
          <div className='flex flex-col lg:flex-row items-start gap-6 lg:gap-8'>
            <div className='lg:col-span-5 flex flex-col gap-4'>
              <TitleBadge text='OUR PROJECTS' className='text-black' />
            </div>
            <div className='lg:col-span-7 flex flex-col gap-6'>
              <div className='animate-pulse'>
                <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                <div className='h-4 bg-gray-200 rounded w-1/2'></div>
              </div>
            </div>
          </div>
          <div className='projects-carousel relative overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory flex gap-6'>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className='snap-start shrink-0 w-[85%] sm:w-[50%] md:w-[35%] lg:w-[28%]'>
                <div className='animate-pulse'>
                  <div className='h-80 md:h-90 lg:h-100 bg-gray-200 rounded-2xl mb-4'></div>
                  <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                  <div className='h-3 bg-gray-200 rounded w-1/2'></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Show empty state if no projects
  if (!projects.length) {
    return (
      <section className='py-16 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 w-full bg-white'>
        <div className='mx-auto flex flex-col gap-12'>
          <div className='flex flex-col lg:flex-row items-start gap-6 lg:gap-8'>
            <div className='lg:col-span-5 flex flex-col gap-4'>
              <TitleBadge text='OUR PROJECTS' className='text-black' />
            </div>
            <div className='lg:col-span-7 flex flex-col gap-6'>
              <div className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl px-4 sm:px-6 font-bold'>
                <span>Creative projects that </span>
                <span className='text-(--brand-camel)'>define</span>
                <span className='block'>our style</span>
              </div>
              <p className='text-gray-500 text-sm sm:text-base max-w-lg pl-4 sm:pl-6 lg:pl-8'>
                No projects available at the moment.
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='py-16 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 w-full bg-white'>
      <div className='mx-auto flex flex-col gap-12'>
        
        {/* Header Section - Left badge, Right heading/subtitle */}
        <div className='flex flex-col lg:flex-row items-start gap-6 lg:gap-8'>
          <div className='lg:col-span-5 flex flex-col gap-4'>
            <TitleBadge text='OUR PROJECTS' className='text-black' />
          </div>

          <div className='lg:col-span-7 flex flex-col gap-6'>
            <div className='border-l border-l-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl px-4 sm:px-6 font-bold'>
              <span>Creative projects that </span>
              <span className='text-(--brand-camel)'>define</span>
              <span className='block'>our style</span>
            </div>
            <p className='text-gray-500 text-sm sm:text-base max-w-lg pl-4 sm:pl-6 lg:pl-8'>
              Our portfolio showcases a diverse range of projects, from beautifully crafted residential spaces to functional and stylish commercial interiors.
            </p>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={containerRef}
          className='projects-carousel relative overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory flex gap-6'
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {projects.map((p, idx) => {
            const offsets = ['mt-0', 'mt-12', 'mt-0', 'mt-12', 'mt-0']
            const offsetClass = offsets[idx % offsets.length] ?? 'mt-0'
            return (
              <div key={p.id} className={`snap-start shrink-0 w-[85%] sm:w-[50%] md:w-[35%] lg:w-[28%] flex flex-col gap-4 ${offsetClass}`}>
                {/* Card Image with Zoom on Hover */}
                <div
                  onClick={() => handleCardClick(p.id)}
                  className='cursor-pointer rounded-2xl overflow-hidden shadow-lg'
                >
                  <img 
                    src={getImageUrl(p.image)} 
                    alt={p.title} 
                    className='w-full h-80 md:h-90 lg:h-100 object-cover block transition-transform duration-300 hover:scale-105' 
                  />
                </div>

                {/* Text Below Card */}
                <div className='flex flex-col gap-1 cursor-pointer' onClick={() => handleCardClick(p.id)}>
                  <h3 className='text-lg md:text-xl font-bold text-gray-800 transition-colors hover:text-brand-camel'>{p.title}</h3>
                  <p className='text-gray-500 text-sm'>{p.location}</p>
                  <p className='text-gray-500 text-sm'>{p.year}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
