import React from 'react'
import TitleBadge from '../common/TitleBadge'
import { SiTicktick } from "react-icons/si";
import PrimaryButton from '../common/Button/PrimaryButton';
import { getImageUrl } from '../../lib/apiClient';

const defaultHighlights = [
    "Latest Technologies",
    "5 Years Warranty",
    "High-Quality Designs",
    "Residential Design",
]

function History({ historyData }) {
    const bgUrl = getImageUrl(historyData?.bgImage) || '/images/history-bg.png'
    const sideImgUrl = getImageUrl(historyData?.sideImage) || '/images/history-side.jpg'
    const badgeText = historyData?.badge || 'Started In 1991'
    const title1 = historyData?.title1 || 'Where Spaces'
    const title2 = historyData?.title2 || 'Inspire, and'
    const titleHighlight = historyData?.titleHighlight || 'Design'
    const titleBottom = historyData?.titleBottom || 'Comes Alive'
    const highlights = historyData?.highlights && historyData.highlights.length > 0 ? historyData.highlights : defaultHighlights
    const description = historyData?.description || "Whether it's your home, office, or a commercial project, we are always dedicated to bringing your vision to life.Our numbers speak better than words:"
    const buttonText = historyData?.buttonText || 'More About Us'
    const buttonLink = historyData?.buttonLink || '/about'

    return (
        <section
            className='relative min-h-96 sm:min-h-[600px] md:min-h-[700px] lg:min-h-screen xl:min-h-[85vh] 2xl:min-h-[50vh] bg-cover bg-center bg-no-repeat w-full'
            style={{ backgroundImage: `url('${bgUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
        >
            <div className='absolute inset-0 bg-black/40' />
            <div className='relative w-full'>
              <div className='flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-12 h-full py-8 sm:py-12 lg:py-0 px-4 sm:px-6 md:px-8 lg:px-12 mx-auto'>
                {/* Left: Text content */}
                <div className='flex flex-col gap-4 sm:gap-6 w-full lg:w-1/2 order-2 lg:order-1 text-center lg:text-left'>
                <div className='flex pt-2 sm:pt-4 justify-center lg:justify-start'>
                    <TitleBadge
                        text={badgeText}
                        className={'text-white z-10'}
                    />
                </div>
                <div className='flex flex-col text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold'>
                    <span className='text-white z-10'>{title1}</span>
                    <span className='text-white z-10'>{title2}
                        <span className='text-(--brand-camel) z-10'> {titleHighlight}</span>
                    </span>
                    <span className='text-(--brand-camel) z-10'> {titleBottom}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 z-10 max-w-2xl mx-auto lg:mx-0">
                    {highlights.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <SiTicktick className="text-(--brand-camel) flex-shrink-0" size={18} />
                            <span className="text-white font-medium text-xs sm:text-sm md:text-base">{item}</span>
                        </div>
                    ))}
                </div>
                <div className='z-10'>
                    <p className='text-white max-w-md text-xs sm:text-sm md:text-base mx-auto lg:mx-0'>
                        {description}
                    </p>
                </div>
                <PrimaryButton
                    text={buttonText}
                    href={buttonLink}
                    className={'self-center lg:self-start text-white z-10'}
                />
            </div>

            {/* Right: Image on lg, top on small */}
            <div className='z-10 w-full lg:w-1/2 order-1 lg:order-2 flex justify-center lg:justify-end lg:pr-8 pt-4 2xl:pt-10'>
                <img 
                    src={sideImgUrl}
                    alt='History side visual'
                    className='w-full h-64 sm:h-80 md:h-96 lg:h-[480px] xl:h-[520px] lg:w-4/5 object-cover rounded-2xl sm:rounded-4xl'
                />
            </div>
            </div>
            </div>

        </section>
    )
}

export default History
