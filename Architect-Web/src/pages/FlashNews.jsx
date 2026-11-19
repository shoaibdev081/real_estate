import React, { useState, useEffect, useMemo } from 'react';
import PageHeader from '../components/common/PageHeader';
import { apiRequest, getImageUrl } from '../lib/apiClient';
import NewsletterSection from '../components/home-sections/NewsletterSection';
import {
  HiOutlineArrowSmallRight,
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlineBolt,
  HiOutlineSparkles,
  HiOutlineBuildingOffice2,
  HiXMark,
} from 'react-icons/hi2';
import { FiSearch } from 'react-icons/fi';

const CATEGORIES = [
  'All',
  'Project Update',
  'Breaking News',
  'New Launch',
  'Milestone',
  'Award & Recognition',
  'Announcement',
];

const DEFAULT_FLASH_NEWS = [
  {
    _id: 'default-news-1',
    title: 'Groundbreaking Milestone: DHA Multan Luxury Commercial Mall Phase 2 Commenced',
    slug: 'dha-multan-luxury-commercial-mall-phase-2-commenced',
    category: 'Milestone',
    badge: 'BREAKING UPDATE',
    summary: 'Monda Brothers officially begins structural excavation and architectural implementation for the iconic Phase 2 development in DHA Multan.',
    content: `We are thrilled to announce that Monda Brothers has officially commenced structural work on the DHA Multan Luxury Commercial Complex (Phase 2). This state-of-the-art architectural landmark features cutting-edge glass facade engineering, seismic-resistant structural planning, sustainable atrium ventilation, and premium interior shopping zones. Our engineering and site management teams have completed ground testing and basement foundation reinforcement. The project is tracking ahead of schedule with handover planned for early 2027.`,
    image: '/images/service-1.jpg',
    isFlash: true,
    priority: 10,
    status: 'published',
    relatedProject: 'DHA Commercial Complex',
    publishedAt: new Date().toISOString(),
  },
  {
    _id: 'default-news-2',
    title: 'Monda Brothers Awarded Best Luxury Residential Interior Design Award 2026',
    slug: 'monda-brothers-awarded-best-luxury-residential-interior-design-award-2026',
    category: 'Award & Recognition',
    badge: 'HONOR & AWARD',
    summary: 'Recognized at the National Architectural & Design Excellence Summit 2026 for revolutionary modern minimalist villa designs.',
    content: `At the prestigious Architectural Excellence Summit 2026, Monda Brothers was honored with the coveted 'Best Luxury Residential Interior Design' trophy. The award honors our contemporary villa project featuring open-concept bioclimatic courtyards, custom Italian marble flooring, and smart automated interior mood lighting. We express sincere gratitude to our visionary clients and passionate craftsmanship team who make every creation extraordinary.`,
    image: '/images/gallery-1.jpg',
    isFlash: true,
    priority: 8,
    status: 'published',
    relatedProject: 'Royal Palm Villa',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'default-news-3',
    title: 'Exclusive Launch: Eco-Friendly Smart Sustainable Living Villa Collection',
    slug: 'exclusive-launch-eco-friendly-smart-sustainable-living-villa-collection',
    category: 'New Launch',
    badge: 'PROJECT LAUNCH',
    summary: 'Introducing our 2026 collection of energy-positive, solar-integrated luxury residential estates with zero carbon footprint.',
    content: `Monda Brothers is proud to announce the official launch of our Eco-Friendly Villa Blueprint Collection. Key architectural innovations include passive solar heat dissipation using recessed balconies, double-glazed low-E thermal windows, and rainwater harvesting integrated into landscape architecture.`,
    image: '/images/gallery-3.jpg',
    isFlash: true,
    priority: 6,
    status: 'published',
    relatedProject: 'Eco Green Villa',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function FlashNews() {
  const [newsList, setNewsList] = useState(DEFAULT_FLASH_NEWS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStory, setActiveStory] = useState(null);

  // Fetch published news
  useEffect(() => {
    setLoading(true);
    apiRequest('/flash-news?status=published')
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setNewsList(res.data);
          setError(null);
        }
      })
      .catch((err) => {
        console.warn('API fetch failed, displaying default flash news:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter list
  const filteredList = useMemo(() => {
    return newsList.filter((item) => {
      const matchCat =
        activeCategory === 'All' || item.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.summary?.toLowerCase().includes(q) ||
        item.relatedProject?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [newsList, activeCategory, searchQuery]);

  // Flash items for animated ticker
  const flashTickerItems = useMemo(() => {
    const flashes = newsList.filter((n) => n.isFlash);
    return flashes.length > 0 ? flashes : newsList.slice(0, 3);
  }, [newsList]);

  // Featured top item (highest priority)
  const featuredItem = filteredList.length > 0 ? filteredList[0] : null;
  const remainingItems = filteredList.length > 1 ? filteredList.slice(1) : [];

  return (
    <>
      <PageHeader
        title="Flash News & Updates"
        breadcrumb={['HOME', 'FLASH NEWS & UPDATES']}
      />

      {/* Breaking / Flash News Ticker Banner */}
      {flashTickerItems.length > 0 && (
        <div className="bg-neutral-900 text-white border-b border-amber-500/30 overflow-hidden relative shadow-inner">
          <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3">
            <div className="shrink-0 flex items-center gap-1.5 bg-amber-500 text-neutral-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow">
              <span className="w-2 h-2 rounded-full bg-neutral-950 animate-ping inline-block" />
              <HiOutlineBolt className="w-3.5 h-3.5" />
              <span>FLASH</span>
            </div>

            <div className="overflow-hidden whitespace-nowrap flex-1 text-xs sm:text-sm font-medium text-neutral-200">
              <div className="inline-flex gap-8 animate-marquee">
                {flashTickerItems.map((item, idx) => (
                  <button
                    key={`${item._id}-${idx}`}
                    type="button"
                    onClick={() => setActiveStory(item)}
                    className="hover:text-amber-400 hover:underline cursor-pointer inline-flex items-center gap-2 transition"
                  >
                    <span className="text-amber-500 font-bold">[{item.badge || item.category}]</span>
                    <span>{item.title}</span>
                    <span className="text-neutral-500 mx-2">•</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-gray-50 w-full min-h-[70vh]">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto space-y-10">
          {/* Header Title & Subtitle */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
            <div>
              <span className="px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-700 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-3">
                <HiOutlineSparkles className="w-3.5 h-3.5 text-amber-600" />
                Latest Architectural Insights & Milestones
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                Live Project Updates & Announcements
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl leading-relaxed">
                Stay updated with breaking construction milestones, ongoing commercial developments, new blueprints, and industry awards from Monda Brothers.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search news or project..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 bg-white text-gray-900 shadow-xs outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-neutral-900 text-white shadow-md scale-105'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-500">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium">Fetching latest flash updates...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-center text-red-600">
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredList.length === 0 && (
            <div className="py-20 text-center bg-white rounded-3xl border border-gray-200 p-8 shadow-xs">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
                <HiOutlineBolt className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No News Found</h3>
              <p className="text-sm text-gray-500 mt-1">
                There are no published updates in this category right now.
              </p>
            </div>
          )}

          {/* Content Available */}
          {!loading && !error && filteredList.length > 0 && (
            <div className="space-y-10">
              {/* Featured Top Story Hero Card */}
              {featuredItem && (
                <div
                  onClick={() => setActiveStory(featuredItem)}
                  className="group cursor-pointer rounded-3xl bg-white border border-gray-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12"
                >
                  <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-full min-h-[300px] overflow-hidden bg-neutral-900">
                    <img
                      src={getImageUrl(featuredItem.image) || '/images/service-1.jpg'}
                      alt={featuredItem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/service-1.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-amber-500 text-neutral-950 text-xs font-black uppercase tracking-wider shadow">
                        {featuredItem.badge || 'FEATURED UPDATE'}
                      </span>
                      {featuredItem.isFlash && (
                        <span className="px-3 py-1 rounded-full bg-neutral-900/90 text-amber-400 text-xs font-bold backdrop-blur-md flex items-center gap-1">
                          <HiOutlineBolt className="w-3.5 h-3.5" />
                          Flash
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <HiOutlineCalendar className="w-4 h-4 text-amber-600" />
                          {new Date(featuredItem.publishedAt || featuredItem.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
                          <HiOutlineTag className="w-4 h-4" />
                          {featuredItem.category}
                        </span>
                      </div>

                      {featuredItem.relatedProject && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold">
                          <HiOutlineBuildingOffice2 className="w-3.5 h-3.5 text-amber-600" />
                          {featuredItem.relatedProject}
                        </div>
                      )}

                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors leading-tight">
                        {featuredItem.title}
                      </h3>

                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {featuredItem.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-600 group-hover:text-amber-700 inline-flex items-center gap-1.5">
                        Read Complete Update
                        <HiOutlineArrowSmallRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                      </span>
                      <span className="text-xs text-gray-400">Click to view details</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid of Remaining Stories */}
              {remainingItems.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {remainingItems.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => setActiveStory(item)}
                      className="group cursor-pointer rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      {/* Image Header */}
                      <div className="relative h-52 overflow-hidden bg-neutral-900">
                        <img
                          src={getImageUrl(item.image) || '/images/gallery-1.jpg'}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/gallery-1.jpg';
                          }}
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-neutral-900/80 text-amber-400 text-[11px] font-bold backdrop-blur-md">
                            {item.badge || item.category}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-[11px] text-gray-500">
                            <span className="flex items-center gap-1">
                              <HiOutlineCalendar className="w-3.5 h-3.5 text-amber-600" />
                              {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}
                            </span>
                            <span className="font-semibold text-amber-700">
                              {item.category}
                            </span>
                          </div>

                          {item.relatedProject && (
                            <div className="text-[11px] font-medium text-amber-600 flex items-center gap-1 truncate">
                              <HiOutlineBuildingOffice2 className="w-3 h-3 shrink-0" />
                              <span className="truncate">{item.relatedProject}</span>
                            </div>
                          )}

                          <h4 className="text-base font-bold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
                            {item.title}
                          </h4>

                          <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                            {item.summary}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-amber-600 group-hover:text-amber-700">
                          <span>View Story</span>
                          <HiOutlineArrowSmallRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Story Detail Reading Modal */}
      {activeStory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in"
          onClick={() => setActiveStory(null)}
        >
          <div
            className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveStory(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black transition"
              aria-label="Close story"
            >
              <HiXMark className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            {activeStory.image && (
              <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-neutral-900">
                <img
                  src={getImageUrl(activeStory.image)}
                  alt={activeStory.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white text-xs">
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-neutral-950 font-bold uppercase tracking-wider">
                    {activeStory.badge || activeStory.category}
                  </span>
                  <span>
                    {new Date(activeStory.publishedAt || activeStory.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            )}

            {/* Modal Text Content */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <div>
                {activeStory.relatedProject && (
                  <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <HiOutlineBuildingOffice2 className="w-4 h-4" />
                    Project: {activeStory.relatedProject}
                  </div>
                )}
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                  {activeStory.title}
                </h2>
              </div>

              {/* Summary Highlight Box */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border-l-4 border-amber-500 text-sm text-gray-800 font-medium leading-relaxed">
                {activeStory.summary}
              </div>

              {/* Full Content */}
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line space-y-4">
                {activeStory.content}
              </div>

              {/* Footer CTA */}
              <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-gray-500">
                  Published by <strong>Monda Brothers Architects & Builders</strong>
                </span>
                <a
                  href="/contact"
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold tracking-wide transition shadow"
                >
                  Inquire About This Project
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter */}
      <NewsletterSection />
    </>
  );
}

