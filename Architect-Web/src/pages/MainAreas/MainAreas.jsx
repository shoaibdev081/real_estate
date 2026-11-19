import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { apiRequest, getImageUrl } from '../../lib/apiClient';
import {
  HiOutlineMapPin,
  HiOutlineArrowSmallRight,
  HiOutlineCheckBadge,
  HiOutlineBuildingOffice2,
  HiOutlineShieldCheck,
  HiOutlinePhone,
} from 'react-icons/hi2';
import { FaBuilding, FaSearch, FaCity, FaRoad, FaCheckCircle } from 'react-icons/fa';

export default function MainAreas() {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    apiRequest('/main-areas?active=true')
      .then((res) => setAreas(res?.data || []))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    'All',
    'Residential Society',
    'Commercial Hub',
    'High-Rise Buildings',
    'Road & Avenue',
  ];

  const filteredAreas = useMemo(() => {
    return areas.filter((a) => {
      const matchesCategory =
        activeCategory === 'All' || a.category === activeCategory;

      const matchesSearch =
        !searchQuery.trim() ||
        a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.badge?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(a.features) &&
          a.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesCategory && matchesSearch;
    });
  }, [areas, activeCategory, searchQuery]);

  return (
    <>
      <PageHeader
        title={'Main Areas & Societies'}
        breadcrumb={['HOME', 'MAIN AREAS']}
      />

      <section className="py-16 lg:py-24 px-6 lg:px-12 bg-white text-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Top Scope Introduction */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span
              className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-black mb-3"
              style={{ backgroundColor: 'var(--brand-camel)' }}
            >
              Coverage & Operational Zones
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
              Where <span style={{ color: 'var(--brand-camel-dark)' }}>We Operate</span> in Multan
            </h2>
            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
              Monda Brothers provides comprehensive architectural design, structural engineering, authority approval consultancy, and turnkey construction across all major residential societies, commercial hubs, and arterial avenues in Multan.
            </p>
          </div>

          {/* Quick Stats Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <div className="p-5 rounded-2xl bg-gray-50 text-gray-900 shadow-xs border border-gray-200">
              <div className="text-2xl sm:text-3xl font-bold text-(--brand-camel-dark)">14+</div>
              <div className="text-xs text-gray-500 mt-1 font-medium">Prestigious Societies & Hubs</div>
            </div>
            <div className="p-5 rounded-2xl bg-gray-50 text-gray-900 shadow-xs border border-gray-200">
              <div className="text-2xl sm:text-3xl font-bold text-(--brand-camel-dark)">7 Stories</div>
              <div className="text-xs text-gray-500 mt-1 font-medium">Commercial High-Rise Authority</div>
            </div>
            <div className="p-5 rounded-2xl bg-gray-50 text-gray-900 shadow-xs border border-gray-200">
              <div className="text-2xl sm:text-3xl font-bold text-(--brand-camel-dark)">100%</div>
              <div className="text-xs text-gray-500 mt-1 font-medium">Bye-Laws & Society Approvals</div>
            </div>
            <div className="p-5 rounded-2xl bg-gray-50 text-gray-900 shadow-xs border border-gray-200">
              <div className="text-2xl sm:text-3xl font-bold text-(--brand-camel-dark)">Turnkey</div>
              <div className="text-xs text-gray-500 mt-1 font-medium">Design & Construction Services</div>
            </div>
          </div>

          {/* Search & Category Filter Navigation */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-6 border-b border-gray-200">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hidden">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                const count = cat === 'All' ? areas.length : areas.filter((a) => a.category === cat).length;
                if (cat !== 'All' && count === 0) return null;

                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? 'bg-(--brand-camel) text-black shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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

            {/* Search Input */}
            <div className="relative min-w-[280px]">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                placeholder="Search societies or roads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-gray-300 bg-gray-50 focus:bg-white text-gray-900 outline-none focus:border-(--brand-camel) transition-all"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="py-24 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-(--brand-camel) border-r-transparent" />
              <p className="mt-4 text-sm text-gray-500 font-medium">Loading areas...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="py-20 text-center text-rose-500 font-medium">
              Failed to load operational areas. Please refresh the page.
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredAreas.length === 0 && (
            <div className="py-24 text-center max-w-md mx-auto">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <FaSearch className="text-xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No areas found</h3>
              <p className="text-xs text-gray-500 mb-4">
                No matching operational society found for "{searchQuery}".
              </p>
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-(--brand-camel) text-black"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Main Areas Grid */}
          {!loading && !error && filteredAreas.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAreas.map((area) => (
                <div
                  key={area._id}
                  className="group rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-xs hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Card Image */}
                  <div className="relative h-56 w-full overflow-hidden bg-neutral-900">
                    <img
                      src={
                        getImageUrl(area.image) ||
                        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={area.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Badge */}
                    {area.badge && (
                      <div
                        className="absolute top-4 left-4 z-10 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-black shadow-lg"
                        style={{ backgroundColor: 'var(--brand-camel)' }}
                      >
                        {area.badge}
                      </div>
                    )}

                    {/* Category Pill */}
                    <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-md text-[10px] font-semibold bg-black/70 backdrop-blur-md text-white border border-white/10">
                      {area.category}
                    </div>

                    {/* Bottom Title on Image */}
                    <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                      <div className="flex items-center gap-1.5 text-xs text-(--brand-camel) font-semibold mb-0.5">
                        <HiOutlineMapPin className="text-sm" />
                        <span>{area.city || 'Multan'}</span>
                        {area.tagline && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-300 font-normal">{area.tagline}</span>
                          </>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold tracking-tight text-white drop-shadow leading-snug">
                        {area.name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                        {area.description ||
                          'Professional architectural planning, structural approvals, 3D modeling, and turnkey construction.'}
                      </p>

                      {/* Feature chips */}
                      {area.features && area.features.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {area.features.map((feat, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-gray-50 text-gray-700 border border-gray-200"
                            >
                              {feat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <Link
                        to={`/contact?area=${encodeURIComponent(area.name)}`}
                        className="inline-flex items-center gap-2 text-xs font-bold text-gray-900 group-hover:text-(--brand-camel-dark) transition-colors"
                      >
                        <span>Start Project in {area.name}</span>
                        <HiOutlineArrowSmallRight className="text-sm group-hover:translate-x-1 transition-transform" />
                      </Link>

                      <a
                        href={`https://wa.me/923016624449?text=${encodeURIComponent(
                          `Hello Monda Brothers, I am interested in architectural / construction services in ${area.name}.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                        title="Quick WhatsApp inquiry"
                      >
                        <HiOutlinePhone className="text-sm" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Authority & High-Rise Callout */}
          <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-neutral-50 text-gray-900 relative overflow-hidden shadow-sm border border-gray-200">
            <div className="relative z-10 max-w-3xl">
              <span
                className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-black inline-block mb-3 shadow-xs"
                style={{ backgroundColor: 'var(--brand-camel)' }}
              >
                Specialized Building Scope
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-snug">
                Commercial High-Rise Buildings & Bye-Law Experts
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
                Monda Brothers possesses specialized engineering and approval expertise for commercial structures up to <strong>7 Stories Max</strong>, complete with structural load-bearing analysis, modern glass curtain walls, safety exits, and full regulatory clearance.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-black hover:brightness-105 transition-all shadow-md"
                  style={{ backgroundColor: 'var(--brand-camel)' }}
                >
                  Consult with an Architect
                </Link>
                <Link
                  to="/projects"
                  className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-gray-800 bg-white border border-gray-300 hover:bg-gray-100 transition-all shadow-xs"
                >
                  View Completed Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
