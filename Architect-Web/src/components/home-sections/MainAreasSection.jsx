import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest, getImageUrl } from '../../lib/apiClient';
import { HiOutlineArrowSmallRight, HiOutlineMapPin } from 'react-icons/hi2';

export default function MainAreasSection() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    async function fetchAreas() {
      try {
        const res = await apiRequest('/main-areas?active=true');
        setAreas(res?.data || []);
      } catch (err) {
        console.error('Failed to fetch main areas for home:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAreas();
  }, []);

  const categories = ['All', 'Residential Society', 'Commercial Hub', 'High-Rise Buildings', 'Road & Avenue'];

  const filteredAreas = useMemo(() => {
    if (activeTab === 'All') return areas;
    return areas.filter((a) => a.category === activeTab);
  }, [areas, activeTab]);

  if (!loading && areas.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 px-6 lg:px-12 bg-white text-gray-900 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-black mb-3 shadow-xs"
              style={{ backgroundColor: 'var(--brand-camel)' }}
            >
              <HiOutlineMapPin className="text-sm" />
              <span>Operational Locations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
              Main Areas <span style={{ color: 'var(--brand-camel-dark)' }}>We Serve</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed">
              From flagship residential societies to commercial avenues and high-rise towers up to 7 stories max, Monda Brothers operates across Multan’s most prestigious development zones.
            </p>
          </div>

          <Link
            to="/main-areas"
            className="inline-flex items-center gap-2 self-start md:self-auto px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-black transition-all shadow-md hover:brightness-105 group cursor-pointer"
            style={{ backgroundColor: 'var(--brand-camel)' }}
          >
            <span>Explore All Areas ({areas.length})</span>
            <HiOutlineArrowSmallRight className="text-lg group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-10 scrollbar-hidden">
          {categories.map((cat) => {
            const isActive = activeTab === cat;
            const count = cat === 'All' ? areas.length : areas.filter((a) => a.category === cat).length;
            if (cat !== 'All' && count === 0) return null;

            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-(--brand-camel) text-black shadow-sm font-bold'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                <span>{cat === 'All' ? 'All Areas' : cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-black/20 text-black' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Cards Grid (show top 6 on home) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAreas.slice(0, 6).map((area) => (
            <div
              key={area._id}
              className="group relative rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-xs hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image banner */}
              <div className="relative h-52 w-full overflow-hidden bg-neutral-900">
                <img
                  src={
                    getImageUrl(area.image) ||
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={area.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                {/* Badge (e.g. 7-Story Max, Phase 1 & 2) */}
                {area.badge && (
                  <div
                    className="absolute top-3.5 left-3.5 z-10 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-black shadow-md"
                    style={{ backgroundColor: 'var(--brand-camel)' }}
                  >
                    {area.badge}
                  </div>
                )}

                {/* Category Pill */}
                <div className="absolute top-3.5 right-3.5 z-10 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-black/70 backdrop-blur-md text-white border border-white/10">
                  {area.category}
                </div>

                {/* Location on image */}
                <div className="absolute bottom-3 left-3.5 right-3.5 text-white z-10">
                  <div className="flex items-center gap-1.5 text-xs text-(--brand-camel) font-semibold">
                    <HiOutlineMapPin className="text-sm" />
                    <span>{area.city || 'Multan'}</span>
                    {area.tagline && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-300 font-normal">{area.tagline}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-(--brand-camel-dark) transition-colors mb-2">
                    {area.name}
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                    {area.description || 'Specialized architectural planning, elevation, and turnkey construction.'}
                  </p>

                  {/* Feature chips */}
                  {area.features && area.features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {area.features.slice(0, 3).map((feat, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-50 text-gray-700 border border-gray-200"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card CTA */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-medium">Full Scope Consultancy</span>
                  <Link
                    to={`/contact?area=${encodeURIComponent(area.name)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-(--brand-camel-dark) hover:underline group-hover:translate-x-1 transition-transform"
                  >
                    <span>Inquire Now</span>
                    <HiOutlineArrowSmallRight className="text-sm" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Bottom Link */}
        <div className="mt-14 text-center">
          <Link
            to="/main-areas"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-black hover:brightness-105 transition-all shadow-md"
            style={{ backgroundColor: 'var(--brand-camel)' }}
          >
            <span>View All Operational Societies & Areas ({areas.length})</span>
            <HiOutlineArrowSmallRight className="text-lg" />
          </Link>
        </div>
      </div>
    </section>
  );
}
