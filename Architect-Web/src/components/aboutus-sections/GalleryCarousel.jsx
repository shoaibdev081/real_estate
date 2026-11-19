import { useState, useRef, useEffect } from 'react';
import { HiOutlineArrowSmallRight, HiOutlineArrowSmallLeft } from 'react-icons/hi2';
import TitleBadge from '../common/TitleBadge';
import { apiRequest, getImageUrl } from '../../lib/apiClient';

const FALLBACK_ITEMS = [
  { id: 1, image: '/images/gallery-1.jpg', title: 'Modern Minimalist Living' },
  { id: 2, image: '/images/gallery-6.jpg', title: 'Luxury Kitchen Suite' },
  { id: 3, image: '/images/gallery-11.jpg', title: 'Contemporary Master Bedroom' },
  { id: 4, image: '/images/gallery-9.jpg', title: 'Spa-Inspired Bathroom' },
  { id: 5, image: '/images/gallery-3.jpg', title: 'Elegant Dining Space' },
  { id: 6, image: '/images/gallery-4.jpg', title: 'Bespoke Interior Millwork' },
];

export default function GalleryCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [autoScroll, setAutoScroll] = useState(true);
  const [galleryItems, setGalleryItems] = useState(FALLBACK_ITEMS);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

  // Fetch gallery data from backend
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        const response = await apiRequest('/gallery');
        if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
          const mappedItems = response.data.map((item) => {
            const allImages = [item.mainImage, ...(item.otherImages || [])].filter(Boolean);
            return allImages.map((image, imgIndex) => ({
              id: `${item._id}-${imgIndex}`,
              image: image,
              title: item.title,
            }));
          });
          const flattened = mappedItems.flat();
          if (flattened.length > 0) {
            setGalleryItems(flattened);
          }
        }
      } catch (error) {
        console.error('Failed to fetch gallery data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1280) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto scroll effect
  useEffect(() => {
    if (!autoScroll || loading || galleryItems.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, galleryItems.length - itemsPerView);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [autoScroll, itemsPerView, galleryItems.length, loading]);

  const handlePrev = () => {
    setAutoScroll(false);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
    setTimeout(() => setAutoScroll(true), 3000);
  };

  const handleNext = () => {
    setAutoScroll(false);
    const maxIndex = Math.max(0, galleryItems.length - itemsPerView);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    setTimeout(() => setAutoScroll(true), 3000);
  };

  const maxIndex = Math.max(0, galleryItems.length - itemsPerView);

  return (
    <section
      className="relative w-full min-h-175 lg:min-h-225 bg-gray-900"
      style={{
        backgroundImage: 'url(/images/gallery-1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/65 z-0" />

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center pt-28 sm:pt-40">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
          {/* Left text section */}
          <div className="w-full lg:w-auto shrink-0 flex flex-col justify-center">
            <div className="mb-4 sm:mb-6">
              <TitleBadge text={'OUR GALLERY'} className={'text-white inline-flex items-center'} />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
              Interior &
              <br />
              Architecture
            </h1>

            <p className="text-sm sm:text-base text-gray-300 max-w-md leading-relaxed">
              Discover our portfolio of exceptional architectural designs and interior spaces. Each
              project reflects our commitment to innovative design, functional excellence, and
              timeless aesthetics.
            </p>
          </div>

          {/* Carousel section */}
          <div className="w-full lg:flex-1 flex flex-col items-center gap-8 overflow-x-hidden">
            <div ref={carouselRef} className="w-full overflow-hidden">
              <div
                className="flex gap-4 sm:gap-6 lg:gap-8 transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                }}
              >
                {galleryItems.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="shrink-0 w-full sm:w-1/2 lg:w-[38%] xl:w-[30%]"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/10 group">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = '/images/gallery-1.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <p className="text-white text-sm font-semibold truncate">{item.title}</p>
                        </div>
                      </div>

                      <h3 className="text-center text-sm font-medium text-gray-200 truncate">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation arrows */}
            <div className="flex items-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="p-3 sm:p-3.5 rounded-full border-2 border-white/70 text-white hover:bg-white hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
                aria-label="Previous gallery items"
              >
                <HiOutlineArrowSmallLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className="p-3 sm:p-3.5 rounded-full border-2 border-white/70 text-white hover:bg-white hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
                aria-label="Next gallery items"
              >
                <HiOutlineArrowSmallRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
