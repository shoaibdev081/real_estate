import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import { apiRequest, getImageUrl } from '../../lib/apiClient';
import { parseVideoInfo } from '../../lib/videoHelper';
import {
  HiOutlineArrowSmallRight,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineTag,
} from 'react-icons/hi2';
import { FaPlay, FaYoutube, FaFacebook, FaSearch } from 'react-icons/fa';

export default function Blogs() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiRequest('/blogs?status=published&limit=all'),
      apiRequest('/blogs/categories').catch(() => ({ data: [] })),
    ])
      .then(([blogsRes, catsRes]) => {
        setBlogs(blogsRes?.data || []);
        if (catsRes?.data && Array.isArray(catsRes.data)) {
          setCategories(['All', ...catsRes.data]);
        }
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  // Filtered list based on category & search
  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchesCategory =
        activeCategory === 'All' ||
        b.category?.toLowerCase() === activeCategory.toLowerCase();

      const matchesSearch =
        !searchQuery.trim() ||
        b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(b.tags) &&
          b.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesCategory && matchesSearch;
    });
  }, [blogs, activeCategory, searchQuery]);

  // Featured blog (first featured blog or first blog)
  const featuredBlog = useMemo(() => {
    return blogs.find((b) => b.featured) || blogs[0] || null;
  }, [blogs]);

  // Pagination calculation
  const total = filteredBlogs.length;
  const pages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const pageItems = filteredBlogs.slice(start, start + perPage);

  const hasPrev = page > 1;
  const hasNext = page < pages;

  return (
    <>
      <PageHeader title={'Blogs & Video Articles'} breadcrumb={['HOME', 'BLOGS']} />

      <section className="py-16 lg:py-24 px-6 lg:px-12 bg-white text-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Spotlight / Featured Blog (if available and no search filter) */}
          {featuredBlog && !searchQuery.trim() && activeCategory === 'All' && (
            <div className="mb-16">
              <div className="text-xs uppercase font-bold tracking-widest text-(--brand-camel) mb-3">
                Featured Spotlight
              </div>
              <div
                onClick={() => navigate(`/blogs/${featuredBlog.slug || featuredBlog._id}`)}
                className="group relative cursor-pointer rounded-3xl overflow-hidden border border-gray-200 bg-neutral-900 shadow-xl transition-all duration-300 hover:shadow-2xl grid grid-cols-1 lg:grid-cols-12"
              >
                {/* Image / Video preview half */}
                <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden bg-black">
                  <img
                    src={getImageUrl(featuredBlog.coverImage) || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}
                    alt={featuredBlog.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/40" />

                  {/* Video Badge if article has video */}
                  {featuredBlog.videoUrl && (
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
                      {featuredBlog.videoType === 'youtube' && <FaYoutube className="text-red-500 text-sm" />}
                      {featuredBlog.videoType === 'facebook' && <FaFacebook className="text-blue-500 text-sm" />}
                      <span>{featuredBlog.videoType === 'facebook' ? 'Facebook Video' : 'YouTube Video'}</span>
                    </div>
                  )}

                  {featuredBlog.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="h-14 w-14 rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110"
                        style={{ backgroundColor: 'var(--brand-camel)' }}
                      >
                        <FaPlay className="ml-1 text-black text-sm" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content half */}
                <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between text-white bg-neutral-900">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-black"
                        style={{ backgroundColor: 'var(--brand-camel)' }}
                      >
                        {featuredBlog.category}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <HiOutlineClock className="text-sm" />
                        {featuredBlog.readTime || '4 min read'}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4 group-hover:text-(--brand-camel) transition-colors leading-snug">
                      {featuredBlog.title}
                    </h2>

                    <p className="text-sm text-gray-300 line-clamp-3 mb-6 leading-relaxed">
                      {featuredBlog.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-neutral-800">
                    <div className="text-xs text-gray-400">
                      By <span className="text-white font-medium">{featuredBlog.author || 'Monda Brothers'}</span>
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-(--brand-camel) group-hover:translate-x-1 transition-transform">
                      <span>Explore Article</span>
                      <HiOutlineArrowSmallRight className="text-lg" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search & Category Filter Navigation */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-6 border-b border-gray-200">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hidden">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setPage(1);
                    }}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                      isActive
                        ? 'bg-(--brand-camel) text-black shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-gray-300 bg-gray-50 focus:bg-white text-gray-900 outline-none focus:border-(--brand-camel) transition-all"
              />
            </div>
          </div>

          {/* State: Loading & Error */}
          {loading && (
            <div className="py-24 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-(--brand-camel) border-r-transparent" />
              <p className="mt-4 text-sm text-gray-500 font-medium">Loading articles...</p>
            </div>
          )}

          {error && (
            <div className="py-20 text-center text-rose-500 font-medium">
              Failed to load articles. Please refresh the page.
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredBlogs.length === 0 && (
            <div className="py-24 text-center max-w-md mx-auto">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <FaSearch className="text-xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No articles found</h3>
              <p className="text-xs text-gray-500 mb-4">
                We couldn't find any articles matching your search criteria.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-(--brand-camel) text-black hover:brightness-105"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Articles Grid */}
          {!loading && !error && pageItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pageItems.map((blog) => {
                const videoInfo = parseVideoInfo(blog.videoUrl);
                return (
                  <article
                    key={blog._id}
                    onClick={() => navigate(`/blogs/${blog.slug || blog._id}`)}
                    className="group cursor-pointer rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    {/* Thumbnail with hover zoom */}
                    <div className="relative h-60 w-full overflow-hidden bg-neutral-900">
                      <img
                        src={
                          getImageUrl(blog.coverImage) ||
                          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
                        }
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                      {/* Video Badge */}
                      {videoInfo && (
                        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10">
                          {videoInfo.type === 'youtube' && <FaYoutube className="text-red-500 text-xs" />}
                          {videoInfo.type === 'facebook' && <FaFacebook className="text-blue-500 text-xs" />}
                          <span className="capitalize">{videoInfo.type} Video</span>
                        </div>
                      )}

                      {/* Play overlay button if has video */}
                      {videoInfo && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity">
                          <div
                            className="h-11 w-11 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
                            style={{ backgroundColor: 'var(--brand-camel)' }}
                          >
                            <FaPlay className="ml-0.5 text-black text-xs" />
                          </div>
                        </div>
                      )}

                      {/* Category Pill */}
                      <div className="absolute bottom-3 left-3 z-10">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-gray-900 shadow-xs">
                          {blog.category || 'Architecture'}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Meta */}
                        <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-2.5">
                          <span className="flex items-center gap-1">
                            <HiOutlineCalendar className="text-xs" />
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <HiOutlineClock className="text-xs" />
                            {blog.readTime || '4 min read'}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-(--brand-camel-dark) transition-colors line-clamp-2 mb-2 leading-snug">
                          {blog.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
                          {blog.excerpt}
                        </p>
                      </div>

                      {/* Footer Link */}
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[11px] font-medium text-gray-500">
                          {blog.author || 'Monda Brothers'}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-(--brand-camel-dark) group-hover:translate-x-1 transition-transform">
                          <span>{videoInfo ? 'Watch & Read' : 'Read Article'}</span>
                          <HiOutlineArrowSmallRight className="text-sm" />
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {pages > 1 && (
            <div className="mt-14 flex items-center justify-center gap-2">
              <button
                disabled={!hasPrev}
                onClick={() => {
                  setPage((p) => Math.max(p - 1, 1));
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-full border border-gray-300 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: pages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setPage(num);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className={`h-8 w-8 rounded-full text-xs font-semibold transition-all ${
                      num === page
                        ? 'bg-(--brand-camel) text-black font-bold shadow-xs'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button
                disabled={!hasNext}
                onClick={() => {
                  setPage((p) => Math.min(p + 1, pages));
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-full border border-gray-300 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
