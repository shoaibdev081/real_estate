import React from 'react'
import TitleBadge from '../common/TitleBadge'
import { getImageUrl } from '../../lib/apiClient'

const defaultSkills = [
  { name: "Interior Design", percentage: 85 },
  { name: "3D Modeling", percentage: 95 },
  { name: "2D Planning", percentage: 65 },
];

export default function ServicesProgress({ overviewData }) {
  const badgeText = overviewData?.badge || 'OUR SERVICES';
  const titlePrefix = overviewData?.titlePrefix !== undefined ? overviewData.titlePrefix : 'Trusted expert in ';
  const titleHighlight = overviewData?.titleHighlight || 'architectural design and innovation.';
  const description = overviewData?.description || 'We specialize in transforming visions into reality. Explore our portfolio of innovative architectural and interior design projects crafted with precision.';
  const imgUrl = getImageUrl(overviewData?.image) || '/images/ser-img-3.png';
  const skills = (overviewData?.skills && overviewData.skills.length > 0) ? overviewData.skills : defaultSkills;

  return (
    <section className="w-full bg-linear-to-b from-gray-50 to-white py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        {/* Top Header Section */}
        <div className="relative py-6 sm:py-8 md:py-10 px-2 sm:px-6 md:px-8 lg:px-12 bg-white w-full mb-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
              <div className='flex'>
                <div className='flex py-2'>
                  <TitleBadge text={badgeText} className={'text-black z-10'} />
                </div>
              </div>
              <div className='flex-1 w-full'>
                <div className='border-l border-l-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl px-4 sm:px-6 font-bold'>
                  <span style={{color: 'var(--text-near-black)'}}>{titlePrefix}</span>
                  <span style={{color: 'var(--brand-camel)'}} className='block'>{titleHighlight}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Container - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Content Section */}
          <div className="space-y-8 md:space-y-10">
            {/* Description Text */}
            <div className="space-y-4">
              <p className="text-base sm:text-lg md:text-lg text-gray-700 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Services List */}
            <div className="space-y-8">
              {skills.map((service, index) => (
                <div key={index} className="space-y-3">
                  {/* Service Name and Percentage */}
                  <div className="flex justify-between items-center gap-4">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      {service.name}
                    </h3>
                    <span className="text-lg sm:text-xl font-semibold whitespace-nowrap" style={{color: 'var(--brand-camel)'}}>
                      {service.percentage}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative w-full h-5 flex items-center">
                    <div className="w-full relative">
                      <div
                        className="h-0.5 bg-black rounded transition-all duration-500"
                        style={{ width: `${service.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image Section */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md sm:max-w-lg lg:max-w-full">
              <img
                src={imgUrl}
                alt="Modern interior design showcase with furniture and decor"
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
