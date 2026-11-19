import React, { useState, useRef } from 'react'
import TitleBadge from '../common/TitleBadge'
import { getImageUrl } from '../../lib/apiClient'

export default function PanoramaSection({ panoramaData }) {
  const [scale, setScale] = useState(1)
  const containerRef = useRef(null)

  const handleMouseDown = () => {
    setScale(1.1)
  }

  const handleMouseUp = () => {
    setScale(1)
  }

  const badgeText = panoramaData?.badge || '360-DEGREE PANORAMAS'
  const titleNormal = panoramaData?.titleNormal !== undefined ? panoramaData.titleNormal : 'Create An Even '
  const titleHighlight = panoramaData?.titleHighlight || 'Greater Experience'
  const imgUrl = getImageUrl(panoramaData?.image) || '/images/gallery-1.jpg'

  return (
    <section className='w-full px-6 lg:px-8 py-16 lg:py-24'>
      <div className='mx-auto flex flex-col gap-8'>
        
        {/* Header - badge placed above the heading on tablet+, no left border */}
        <div className='flex flex-col items-center md:items-center gap-4 text-center w-full'>
          <div className='py-3'>
            <TitleBadge text={badgeText} className={'text-(--brand-camel)'} />
          </div>

          <div className='w-full'>
            <div className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold px-2'>
              <span>{titleNormal}</span>
              <span className='text-(--brand-camel)'>{titleHighlight}</span>
            </div>
          </div>
        </div>

        {/* Image with Zoom */}
        <div
          ref={containerRef}
          className='relative w-full h-[40vh] sm:h-[55vh] md:h-[65vh] lg:h-[70vh] xl:h-[75vh] 2xl:h-[60vh] rounded-2xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing'
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            src={imgUrl}
            alt='360 Panorama'
            className='w-full h-full object-cover transition-transform duration-300'
            style={{ transform: `scale(${scale})` }}
          />
        </div>
      </div>
    </section>
  )
}
