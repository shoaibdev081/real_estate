import { useState, useEffect } from 'react';

export default function AboutHero() {
  const [imageLoaded, setImageLoaded] = useState({
    main: false,
    side: false,
  });

  return (
    <section className="w-full bg-white py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-8">
          {/* Left Content */}
          <div className="lg:col-span-1 flex flex-col justify-between space-y-8 md:space-y-12">
            {/* Badge */}
            <div className="flex items-center gap-2 w-fit">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              <span className="text-xs sm:text-sm font-semibold text-gray-700 tracking-wide">
                STARTED IN 1989
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-5xl font-bold leading-tight text-gray-900">
                We Shape{' '}
                <span className="text-amber-500">Interior Designs,</span>
                <br className="hidden sm:block" />
                Crafting{' '}
                <span className="text-amber-500">Timeless</span> And Inspiring
                <br className="hidden sm:block" />
                Spaces
              </h1>
            </div>

            {/* Experience Counter */}
            <div className="flex items-center gap-6 md:gap-8">
              <div className="text-6xl sm:text-7xl md:text-7xl lg:text-7xl font-bold text-amber-500 leading-none">
                26
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  Years Of
                </span>
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  Experience
                </span>
              </div>
            </div>

            {/* Center Image - Mobile/Tablet */}
            <div className="lg:hidden w-full rounded-3xl overflow-hidden shadow-lg">
              <img
                src="/images/interior-design-1.jpg"
                alt="Interior Design - Living Room"
                className="w-full h-64 sm:h-80 object-cover"
                onLoad={() => setImageLoaded({ ...imageLoaded, main: true })}
              />
            </div>
          </div>

          {/* Middle - Small Image */}
          <div className="hidden lg:flex lg:col-span-1 rounded-3xl overflow-hidden shadow-lg h-fit">
            <img
              src="/images/interior-design-1.jpg"
              alt="Interior Design - Living Room"
              className="w-full h-80 object-cover"
              onLoad={() => setImageLoaded({ ...imageLoaded, main: true })}
            />
          </div>

          {/* Right Content */}
          <div className="lg:col-span-1 flex flex-col justify-between gap-8">
            {/* Large Image */}
            <div className="w-full rounded-3xl overflow-hidden shadow-lg h-64 sm:h-80 md:h-96 lg:h-80">
              <img
                src="/images/interior-design-2.jpg"
                alt="Interior Design - Modern Space"
                className="w-full h-full object-cover"
                onLoad={() => setImageLoaded({ ...imageLoaded, side: true })}
              />
            </div>

            {/* Description Text */}
            <div className="space-y-6">
              <p className="text-gray-600 text-base sm:text-base leading-relaxed">
                We believe that every space has the power to inspire, and that
                great design brings that inspiration to life. Our mission is to
                craft environments that stir creativity, evoke emotion, and
                reflect the essence of those who inhabit them.
              </p>

              {/* Learn More Button */}
              <div className="flex items-center gap-3">
                <button className="px-6 sm:px-8 py-3 border-2 border-gray-900 rounded-full font-semibold text-gray-900 text-sm sm:text-base hover:bg-gray-900 hover:text-white transition-all duration-300">
                  Learn More
                </button>
                <button
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-500 flex items-center justify-center hover:bg-amber-600 transition-all duration-300 flex-shrink-0 shadow-md"
                  aria-label="Learn more"
                >
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Left Image - Desktop Only */}
        <div className="hidden lg:block absolute left-0 bottom-0 w-1/3 -z-10 opacity-5">
          <svg
            viewBox="0 0 200 200"
            fill="currentColor"
            className="text-amber-500"
          >
            <circle cx="100" cy="100" r="90" />
          </svg>
        </div>
      </div>
    </section>
  );
}
