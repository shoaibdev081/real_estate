import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import VideoPlayer from '../../components/common/VideoPlayer';
import { apiRequest, getImageUrl } from '../../lib/apiClient';
import { parseVideoInfo } from '../../lib/videoHelper';
import {
  HiOutlineArrowSmallLeft,
  HiOutlineArrowSmallRight,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineEye,
  HiOutlineShare,
  HiOutlineBookmark,
} from 'react-icons/hi2';
import {
  FaYoutube,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaCopy,
  FaCheck,
} from 'react-icons/fa';

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Try slug first, fallback to id
    apiRequest(`/blogs/slug/${id}`)
      .then((res) => {
        setBlog(res.data);
        setRelated(res.related || []);
      })
      .catch(() => {
        return apiRequest(`/blogs/${id}`)
          .then((res) => {
            setBlog(res.data);
          })
          .catch((err) => setError(err));
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <>
        <PageHeader title={'Loading Article...'} breadcrumb={['HOME', 'BLOGS', '...']} />
        <div className="py-32 text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-(--brand-camel) border-r-transparent" />
          <p className="mt-4 text-sm text-gray-500 font-medium">Loading content...</p>
        </div>
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <PageHeader title={'Article Not Found'} breadcrumb={['HOME', 'BLOGS', 'NOT FOUND']} />
        <div className="py-24 text-center max-w-md mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
          <p className="text-sm text-gray-600 mb-6">
            The article you are looking for may have been moved, unpublished, or deleted.
          </p>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-(--brand-camel) text-black hover:brightness-105 transition-all"
          >
            <HiOutlineArrowSmallLeft className="text-lg" />
            <span>Back to All Articles</span>
          </Link>
        </div>
      </>
    );
  }

  const videoInfo = parseVideoInfo(blog.videoUrl);

  return (
    <>
      <PageHeader
        title={blog.title}
        breadcrumb={['HOME', 'BLOGS', (blog.category || 'ARTICLE').toUpperCase()]}
      />

      <article className="py-16 lg:py-24 px-6 lg:px-12 bg-white text-gray-900">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation Button */}
          <div className="mb-8">
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-(--brand-camel-dark) transition-colors"
            >
              <HiOutlineArrowSmallLeft className="text-lg" />
              <span>Back to Articles</span>
            </Link>
          </div>

          {/* Article Header & Meta */}
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span
                className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-black"
                style={{ backgroundColor: 'var(--brand-camel)' }}
              >
                {blog.category}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1.5">
                <HiOutlineCalendar className="text-sm" />
                {new Date(blog.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 flex items-center gap-1.5">
                <HiOutlineClock className="text-sm" />
                {blog.readTime || '4 min read'}
              </span>
              {blog.views > 0 && (
                <>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1.5">
                    <HiOutlineEye className="text-sm" />
                    {blog.views} views
                  </span>
                </>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight mb-6">
              {blog.title}
            </h1>

            {blog.excerpt && (
              <p className="text-lg sm:text-xl text-gray-600 font-normal leading-relaxed border-l-4 border-(--brand-camel) pl-4 italic">
                {blog.excerpt}
              </p>
            )}

            {/* Author Bar */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-black text-sm"
                  style={{ backgroundColor: 'var(--brand-camel)' }}
                >
                  MB
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">
                    {blog.author || 'Monda Brothers'}
                  </div>
                  <div className="text-xs text-gray-500">Architectural Design & Engineering</div>
                </div>
              </div>

              {/* Share icons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  title="Copy link"
                  className="p-2 rounded-full border border-gray-200 text-gray-600 hover:text-(--brand-camel-dark) hover:border-(--brand-camel) transition-colors"
                >
                  {copied ? <FaCheck className="text-emerald-500 text-xs" /> : <FaCopy className="text-xs" />}
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full border border-gray-200 text-gray-600 hover:text-sky-500 hover:border-sky-500 transition-colors"
                >
                  <FaTwitter className="text-xs" />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-600 transition-colors"
                >
                  <FaFacebook className="text-xs" />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full border border-gray-200 text-gray-600 hover:text-blue-700 hover:border-blue-700 transition-colors"
                >
                  <FaLinkedin className="text-xs" />
                </a>
              </div>
            </div>
          </header>

          {/* MAIN MEDIA: VIDEO PLAYER (YOUTUBE / FACEBOOK) OR COVER IMAGE */}
          <div className="mb-12">
            {videoInfo ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-600 pb-1">
                  <span className="font-semibold flex items-center gap-1.5 text-gray-900">
                    {videoInfo.type === 'youtube' && <FaYoutube className="text-red-500 text-sm" />}
                    {videoInfo.type === 'facebook' && <FaFacebook className="text-blue-500 text-sm" />}
                    Featured {videoInfo.type === 'facebook' ? 'Facebook' : 'YouTube'} Video Presentation
                  </span>
                  <span className="text-[11px] text-gray-500">Embedded Player</span>
                </div>

                <VideoPlayer
                  videoUrl={blog.videoUrl}
                  title={blog.title}
                  coverImage={getImageUrl(blog.coverImage)}
                  className="shadow-2xl"
                />
              </div>
            ) : blog.coverImage ? (
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xl max-h-[500px]">
                <img
                  src={getImageUrl(blog.coverImage)}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}
          </div>

          {/* ARTICLE CONTENT */}
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-6">
            {blog.content.split('\n\n').map((paragraph, idx) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

              // Check if markdown heading
              if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-2xl font-bold text-gray-900 mt-8 mb-3">
                    {trimmed.replace('### ', '')}
                  </h3>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-3xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">
                    {trimmed.replace('## ', '')}
                  </h2>
                );
              }
              if (trimmed.startsWith('- ')) {
                const listItems = trimmed.split('\n');
                return (
                  <ul key={idx} className="list-disc pl-6 space-y-2 text-gray-700 my-4">
                    {listItems.map((item, itemIdx) => (
                      <li key={itemIdx}>
                        {item.replace(/^- /, '')}
                      </li>
                    ))}
                  </ul>
                );
              }

              return (
                <p key={idx} className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal">
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* TAGS */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-gray-200 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mr-2">
                Tags:
              </span>
              {blog.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* AUTHOR BOX */}
          <div className="mt-12 p-8 rounded-3xl bg-neutral-900 text-white flex flex-col sm:flex-row items-center gap-6 shadow-xl border border-neutral-800">
            <div
              className="h-16 w-16 rounded-full flex items-center justify-center font-bold text-black text-xl shrink-0"
              style={{ backgroundColor: 'var(--brand-camel)' }}
            >
              MB
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="text-xs font-semibold uppercase tracking-widest text-(--brand-camel) mb-1">
                Written by
              </div>
              <h4 className="text-lg font-bold text-white mb-1.5">{blog.author || 'Monda Brothers'}</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Dedicated to pioneering modern architectural solutions, timeless interiors, and sustainable craftsmanship across residential and commercial developments.
              </p>
            </div>
          </div>

          {/* RELATED ARTICLES */}
          {related && related.length > 0 && (
            <div className="mt-20 pt-12 border-t border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-xs uppercase font-bold tracking-widest text-(--brand-camel)">
                    Explore More
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">Related Articles</h3>
                </div>
                <Link
                  to="/blogs"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-(--brand-camel-dark) hover:underline"
                >
                  <span>View All</span>
                  <HiOutlineArrowSmallRight className="text-sm" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((item) => {
                  const itemVideo = parseVideoInfo(item.videoUrl);
                  return (
                    <div
                      key={item._id}
                      onClick={() => navigate(`/blogs/${item.slug || item._id}`)}
                      className="group cursor-pointer rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-lg transition-all flex flex-col"
                    >
                      <div className="relative h-44 overflow-hidden bg-black">
                        <img
                          src={getImageUrl(item.coverImage) || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {itemVideo && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-semibold flex items-center gap-1">
                            {itemVideo.type === 'youtube' && <FaYoutube className="text-red-500" />}
                            {itemVideo.type === 'facebook' && <FaFacebook className="text-blue-500" />}
                            <span className="capitalize">{itemVideo.type}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-(--brand-camel-dark)">
                            {item.category}
                          </span>
                          <h4 className="font-bold text-sm text-gray-900 group-hover:text-(--brand-camel-dark) transition-colors line-clamp-2 mt-1 mb-2">
                            {item.title}
                          </h4>
                        </div>
                        <div className="text-[11px] text-gray-500 flex items-center justify-between pt-2 border-t border-gray-100">
                          <span>{item.readTime || '3 min read'}</span>
                          <span className="text-black font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                            Read <HiOutlineArrowSmallRight />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}
