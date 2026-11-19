import React from 'react'
import TitleBadge from '../common/TitleBadge'
import ServicesGrid from './ServicesGrid'
import { getImageUrl } from '../../lib/apiClient'

function Intro({ introData }) {
    const bgUrl = getImageUrl(introData?.bgImage) || '/images/intro-bg.avif'
    const badgeText = introData?.badge || 'WHO WE ARE'
    const titlePrefix = introData?.titlePrefix !== undefined ? introData.titlePrefix : 'Experience '
    const titleHighlight = introData?.titleHighlight || 'the Art of Interior'
    const titleSuffix = introData?.titleSuffix !== undefined ? introData.titleSuffix : 'Design'
    const description = introData?.description || 'We specialize in transforming visions into reality. Explore our portfolio of innovative architectural and interior design projects crafted with precision.'

    return (
        <section
            className='relative min-h-screen xl:min-h-[85vh] 2xl:min-h-[65vh] bg-cover bg-center bg-no-repeat w-full'
            style={{ backgroundImage: `url('${bgUrl}')` }}
        >
            <div className='absolute inset-0 bg-white/80' />
            <div className='relative w-full'>
              <div className='pt-8 sm:pt-12 md:pt-16 lg:pt-20 px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl mx-auto'>
                <div className='flex flex-col lg:flex-row items-start gap-6 lg:gap-8'>
                    <div className='lg:col-span-5 flex flex-col gap-4'>
                        <div className='flex py-5'>
                            <TitleBadge
                                text={badgeText}
                                className={'text-black z-10'}
                            />
                        </div>
                    </div>

                    <div className='lg:col-span-7 flex flex-col gap-6'>
                        <div className='border-l border-l-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl px-4 sm:px-6 font-bold'>
                            <span>{titlePrefix}</span>
                            <span className='text-(--brand-camel)'>{titleHighlight}</span>
                            <span className='block'>{titleSuffix}</span>
                        </div>
                        <div className='pl-4 sm:pl-6 lg:pl-8'>
                            <p className='max-w-lg text-gray-500 text-sm sm:text-base'>
                                {description}
                            </p>
                        </div>
                    </div>
                </div>
                
                <ServicesGrid />
               
              </div>
            </div>
        </section>
    )
}

export default Intro