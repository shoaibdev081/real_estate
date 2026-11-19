import { useState, useEffect } from 'react';
import TitleBadge from '../common/TitleBadge';
import { getImageUrl } from '../../lib/apiClient';

const DEFAULT_TIMELINE = [
  {
    year: '1990',
    title: 'Founded',
    description:
      'The company is founded by a visionary designer with a focus on personalized, high-quality residential interiors. The first few projects are local homes.',
    image: '/images/gallery-1.jpg',
  },
  {
    year: '1995',
    title: 'Expansion',
    description:
      'Opens multiple offices across the region to meet growing demand. Begins taking on larger commercial projects.',
    image: '/images/gallery-3.jpg',
  },
  {
    year: '2000',
    title: 'Digital Revolution',
    description:
      'Adopts cutting-edge 3D modeling technology to enhance design presentations and client experiences.',
    image: '/images/gallery-4.jpg',
  },
  {
    year: '2005',
    title: 'Awards & Recognition',
    description:
      'Receives multiple national design awards and gains international recognition for innovative projects.',
    image: '/images/gallery-6.jpg',
  },
  {
    year: '2010',
    title: 'Global Reach',
    description:
      'Opens a second office in a neighboring city to meet growing demand and takes on larger projects, such as retail spaces and restaurants.',
    image: '/images/gallery-7.jpg',
  },
  {
    year: '2015',
    title: 'Sustainability Focus',
    description:
      'Commits to sustainable design practices and green building materials in all future projects.',
    image: '/images/gallery-9.jpg',
  },
  {
    year: '2020',
    title: 'Design Excellence',
    description:
      'Wins a prestigious national design award for an innovative mixed-use development project.',
    image: '/images/gallery-11.jpg',
  },
  {
    year: '2025',
    title: 'Milestone Anniversary',
    description:
      'Celebrates 35 years with a retrospective showcase of the company\'s most iconic projects and milestones.',
    image: '/images/gallery-12.jpg',
  },
];

const Timeline = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const timelineData = items && items.length > 0 ? items : DEFAULT_TIMELINE;

  // Auto-scroll every 2 seconds
  useEffect(() => {
    if (timelineData.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % timelineData.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [timelineData.length]);

  // Get visible items for carousel (4 items on desktop, 2 on tablet, 1 on mobile)
  const getVisibleItems = () => {
    const list = [];
    const count = Math.min(4, timelineData.length);
    for (let i = 0; i < count; i++) {
      list.push(timelineData[(currentIndex + i) % timelineData.length]);
    }
    return list;
  };

  const visibleItems = getVisibleItems();

  return (
    <section className="w-full bg-linear-to-b from-gray-50 to-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className='flex flex-col lg:flex-row items-start gap-6 lg:gap-8 mb-12 sm:mb-16'>
          <div className='flex'>
            <div className='flex py-5'>
              <TitleBadge
                text={'OUR LEGACY'}
                className={'text-black z-10'}
              />
            </div>
          </div>
          <div className='flex-1 w-full'>
            <div className='border-l border-l-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl px-4 sm:px-6 font-bold'>
              <span>Our history is full of </span>
              <span className='text-(--brand-camel)'>interesting stages</span>
              <span className='block'>and events</span>
            </div>
            <div className='pl-4 sm:pl-6 lg:pl-8'>
              <p className='max-w-lg text-gray-500 pt-4 sm:pt-5 text-sm sm:text-base'>
                Discover the key milestones and pivotal moments that shaped our journey and defined our commitment to excellence in design.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Carousel */}
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 transition-all duration-500">
            {visibleItems.map((item, index) => (
              <div
                key={`${item.year}-${index}`}
                className="flex flex-col items-start"
              >
                {/* Image Container */}
                <div className="w-full h-48 sm:h-56 lg:h-64 rounded-2xl overflow-hidden mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={getImageUrl(item.image) || "/placeholder.svg"}
                    alt={`${item.year} - ${item.title}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Timeline Dot */}
                <div className="flex items-center gap-3 sm:gap-4 mb-4 w-full">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-(--brand-camel) shrink-0"></div>
                  <div className="flex-1 h-0.5 bg-gray-200"></div>
                </div>

                {/* Year and Description */}
                <div className="w-full">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {item.year}
                  </h3>
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                    {item.title}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
