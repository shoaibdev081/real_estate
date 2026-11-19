import { useEffect, useMemo, useState, useRef } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Save,
  RefreshCw,
  X,
  Play,
  Film,
  Video,
  Eye,
  Calendar,
  User,
  Tag,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Layers,
  Upload,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiRequest, getImageUrl } from '../lib/apiClient';
import { parseVideoInfo } from '../lib/videoHelper';

const CATEGORIES = [
  'Architecture',
  'Interior Design',
  'Sustainability',
  'Construction',
  'Urban Planning',
  'Tips & Trends',
];

const EMPTY_FORM = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  author: 'Monda Brothers',
  category: 'Architecture',
  tags: '',
  coverImage: '',
  videoUrl: '',
  videoType: 'none',
  status: 'published',
  featured: false,
  readTime: '4 min read',
};

export default function Blogs() {
  const { token } = useAuth();
  const toast = useToast();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal form states
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const fileInputRef = useRef(null);

  // Video preview modal
  const [previewModalVideo, setPreviewModalVideo] = useState(null);

  // Fetch blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/blogs?isAdmin=true&status=all&limit=all', {
        token,
      });
      setBlogs(res?.data || []);
    } catch (err) {
      toast.showError(err.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchesSearch =
        !search.trim() ||
        b.title?.toLowerCase().includes(search.toLowerCase()) ||
        b.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
        b.category?.toLowerCase().includes(search.toLowerCase()) ||
        (Array.isArray(b.tags) && b.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())));

      const matchesCat =
        categoryFilter === 'All' ||
        b.category?.toLowerCase() === categoryFilter.toLowerCase();

      const matchesStatus =
        statusFilter === 'all' || b.status === statusFilter;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [blogs, search, categoryFilter, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const total = blogs.length;
    const published = blogs.filter((b) => b.status === 'published').length;
    const drafts = blogs.filter((b) => b.status === 'draft').length;
    const withVideos = blogs.filter((b) => b.videoUrl && b.videoUrl.trim()).length;
    return { total, published, drafts, withVideos };
  }, [blogs]);

  // Open Create
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setCoverFile(null);
    setCoverPreview('');
    setFormOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (blog) => {
    setEditingId(blog._id);
    setFormData({
      title: blog.title || '',
      slug: blog.slug || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      author: blog.author || 'Monda Brothers',
      category: blog.category || 'Architecture',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags || '',
      coverImage: blog.coverImage || '',
      videoUrl: blog.videoUrl || '',
      videoType: blog.videoType || 'none',
      status: blog.status || 'published',
      featured: !!blog.featured,
      readTime: blog.readTime || '4 min read',
    });
    setCoverFile(null);
    setCoverPreview(blog.coverImage ? getImageUrl(blog.coverImage) : '');
    setFormOpen(true);
  };

  // Handle Form Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => {
        const updated = { ...prev, [name]: value };
        // Auto-generate slug if editing title and slug is empty or matches slugified old title
        if (name === 'title' && !editingId) {
          const generatedSlug = value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
          updated.slug = generatedSlug;
        }
        return updated;
      });
    }
  };

  // Handle Cover File Picker
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  // Submit Blog Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.showError('Blog title is required');
      return;
    }
    if (!formData.content.trim()) {
      toast.showError('Blog content is required');
      return;
    }

    setSaving(true);
    try {
      const formPayload = new FormData();
      formPayload.append('title', formData.title.trim());
      if (formData.slug) formPayload.append('slug', formData.slug.trim());
      formPayload.append('excerpt', formData.excerpt.trim());
      formPayload.append('content', formData.content);
      formPayload.append('author', formData.author.trim());
      formPayload.append('category', formData.category.trim());
      formPayload.append('tags', formData.tags);
      formPayload.append('videoUrl', formData.videoUrl.trim());
      formPayload.append('status', formData.status);
      formPayload.append('featured', formData.featured);
      formPayload.append('readTime', formData.readTime);

      if (coverFile) {
        formPayload.append('coverImage', coverFile);
      } else if (formData.coverImage) {
        formPayload.append('coverImage', formData.coverImage);
      }

      if (editingId) {
        await apiRequest(`/blogs/${editingId}`, {
          method: 'PUT',
          body: formPayload,
          token,
        });
        toast.showSuccess('Blog updated successfully!');
      } else {
        await apiRequest('/blogs', {
          method: 'POST',
          body: formPayload,
          token,
        });
        toast.showSuccess('Blog published successfully!');
      }

      setFormOpen(false);
      fetchBlogs();
    } catch (err) {
      toast.showError(err.message || 'Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  // Delete Blog
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await apiRequest(`/blogs/${id}`, {
        method: 'DELETE',
        token,
      });
      toast.showSuccess('Blog deleted successfully');
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      toast.showError(err.message || 'Failed to delete blog');
    }
  };

  // Parsed Video for live form preview
  const liveFormVideoInfo = useMemo(() => {
    return parseVideoInfo(formData.videoUrl);
  }, [formData.videoUrl]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-(--brand-camel-dark)">
            <BookOpen className="h-4 w-4" />
            <span>Content Management</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-(--text-primary)">
            Blog & Video Articles
          </h1>
          <p className="text-xs text-(--text-muted) mt-0.5">
            Create, update, and manage architectural articles with embedded YouTube & Facebook videos.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-(--brand-camel-dark) to-(--brand-camel) px-4 py-2.5 text-xs font-semibold text-(--brand-black) shadow-sm hover:brightness-110 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Article</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-(--border-subtle) bg-(--surface-card) shadow-xs">
          <div className="text-[11px] text-(--text-muted) font-medium">Total Articles</div>
          <div className="text-xl font-bold text-(--text-primary) mt-1">{stats.total}</div>
        </div>
        <div className="p-3.5 rounded-xl border border-(--border-subtle) bg-(--surface-card) shadow-xs">
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Published</div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.published}</div>
        </div>
        <div className="p-3.5 rounded-xl border border-(--border-subtle) bg-(--surface-card) shadow-xs">
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Drafts</div>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.drafts}</div>
        </div>
        <div className="p-3.5 rounded-xl border border-(--border-subtle) bg-(--surface-card) shadow-xs">
          <div className="text-[11px] text-sky-600 dark:text-sky-400 font-medium">With Video Embeds</div>
          <div className="text-xl font-bold text-sky-600 dark:text-sky-400 mt-1">{stats.withVideos}</div>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border border-(--border-subtle) bg-(--surface-card)">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-(--text-muted)" />
          <input
            type="text"
            placeholder="Search by title, tag, or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-(--border-subtle) bg-(--bg-main) text-(--text-primary) outline-none focus:border-(--brand-camel)"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text-primary)"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-(--border-subtle) bg-(--bg-main) text-(--text-primary) outline-none"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-(--border-subtle) bg-(--bg-main) text-(--text-primary) outline-none"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>

          <button
            onClick={fetchBlogs}
            title="Refresh list"
            className="p-1.5 rounded-lg border border-(--border-subtle) text-(--text-muted) hover:text-(--text-primary) hover:bg-(--surface-elevated)"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Blogs Table / Cards */}
      <div className="rounded-xl border border-(--border-subtle) bg-(--surface-card) overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-(--surface-elevated)/80 border-b border-(--border-subtle) text-[11px] font-semibold text-(--text-muted) uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Article</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Video Link</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Views</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-4 text-right sticky right-0 bg-(--surface-elevated) shadow-[-4px_0_12px_rgba(0,0,0,0.08)] z-20 min-w-[170px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border-subtle)">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-(--text-muted)">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-(--brand-camel)" />
                      <span>Loading articles...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-(--text-muted)">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <BookOpen className="h-8 w-8 text-(--brand-camel)/40" />
                      <p className="font-medium text-sm text-(--text-primary)">No articles found</p>
                      <p className="text-xs">Try adjusting your search or filters, or add a new article.</p>
                      <button
                        onClick={handleOpenCreate}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs text-(--brand-camel-dark) font-semibold hover:underline"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add New Article
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => {
                  const videoInfo = parseVideoInfo(blog.videoUrl);
                  return (
                    <tr
                      key={blog._id}
                      className="hover:bg-(--surface-elevated)/50 transition-colors"
                    >
                      {/* Title & Cover */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-16 shrink-0 rounded-lg overflow-hidden bg-neutral-900 border border-(--border-subtle)">
                            {blog.coverImage ? (
                              <img
                                src={getImageUrl(blog.coverImage)}
                                alt={blog.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-[10px] text-neutral-500">
                                No cover
                              </div>
                            )}
                            {videoInfo && (
                              <div
                                onClick={() => setPreviewModalVideo(videoInfo)}
                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity cursor-pointer group"
                                title="Click to preview video"
                              >
                                <Play className="h-4 w-4 text-white fill-white group-hover:scale-110 transition-transform" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-(--text-primary) truncate max-w-xs md:max-w-md block" title={blog.title}>
                                {blog.title}
                              </span>
                              {blog.featured && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                  Featured
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-(--text-muted)">
                              <span>{blog.author || 'Monda Brothers'}</span>
                              <span>•</span>
                              <span>{blog.readTime || '4 min read'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-(--brand-camel)/15 text-(--brand-camel-dark) border border-(--brand-camel)/30">
                          {blog.category || 'General'}
                        </span>
                      </td>

                      {/* Video Link */}
                      <td className="py-3 px-3">
                        {videoInfo ? (
                          <button
                            onClick={() => setPreviewModalVideo(videoInfo)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 transition-colors cursor-pointer"
                            title={blog.videoUrl}
                          >
                            <Film className="h-3 w-3 shrink-0" />
                            <span className="capitalize">{videoInfo.type} Video</span>
                            <Play className="h-2.5 w-2.5 fill-current" />
                          </button>
                        ) : (
                          <span className="text-[11px] text-(--text-muted) italic">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            blog.status === 'published'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-neutral-500/10 text-neutral-500'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              blog.status === 'published' ? 'bg-emerald-500' : 'bg-neutral-400'
                            }`}
                          />
                          <span className="capitalize">{blog.status}</span>
                        </span>
                      </td>

                      {/* Views */}
                      <td className="py-3 px-3 text-(--text-muted)">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Eye className="h-3 w-3" />
                          <span>{blog.views || 0}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 text-[11px] text-(--text-muted) whitespace-nowrap">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions (Sticky and Prominent) */}
                      <td className="py-3 px-4 text-right sticky right-0 bg-(--surface-card) shadow-[-4px_0_12px_rgba(0,0,0,0.08)] z-10 min-w-[170px]">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(blog)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 text-xs font-semibold cursor-pointer transition-all shadow-xs"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(blog._id, blog.title)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 text-rose-700 dark:text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-semibold cursor-pointer transition-all shadow-xs"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT SLIDE-OVER MODAL */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-(--border-subtle) bg-(--surface-card) shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-(--border-subtle) bg-(--surface-elevated)">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-(--brand-camel)/20 text-(--brand-camel-dark)">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-(--text-primary)">
                    {editingId ? 'Edit Article' : 'Publish New Article'}
                  </h2>
                  <p className="text-[11px] text-(--text-muted)">
                    Include content and optional YouTube or Facebook video link.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFormOpen(false)}
                className="p-1.5 rounded-lg text-(--text-muted) hover:text-(--text-primary) hover:bg-(--border-subtle)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-(--text-primary) mb-1">
                    Article Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="e.g. Modern Residential Architectural Marvels"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-(--border-subtle) bg-(--bg-main) text-(--text-primary) outline-none focus:border-(--brand-camel)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-(--text-primary) mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    placeholder="modern-residential-architectural-marvels"
                    value={formData.slug}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-(--border-subtle) bg-(--bg-main) text-(--text-primary) outline-none focus:border-(--brand-camel)"
                  />
                </div>
              </div>

              {/* Category, Author, Read Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-(--text-primary) mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-(--border-subtle) bg-(--bg-main) text-(--text-primary) outline-none focus:border-(--brand-camel)"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-(--text-primary) mb-1">
                    Author
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Monda Brothers"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-(--border-subtle) bg-(--bg-main) text-(--text-primary) outline-none focus:border-(--brand-camel)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-(--text-primary) mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleChange}
                    placeholder="4 min read"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-(--border-subtle) bg-(--bg-main) text-(--text-primary) outline-none focus:border-(--brand-camel)"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-semibold text-(--text-primary) mb-1">
                  Short Excerpt / Summary
                </label>
                <textarea
                  name="excerpt"
                  rows={2}
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="A concise summary of the article displayed on preview cards..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-(--border-subtle) bg-(--bg-main) text-(--text-primary) outline-none focus:border-(--brand-camel)"
                />
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-xs font-semibold text-(--text-primary) mb-1">
                  Full Article Content <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="content"
                  rows={8}
                  required
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write the full content of your article here. Supports paragraphs and markdown..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-(--border-subtle) bg-(--bg-main) text-(--text-primary) font-mono outline-none focus:border-(--brand-camel) leading-relaxed"
                />
              </div>

              {/* VIDEO EMBED SECTION (CRITICAL USER REQUIREMENT) */}
              <div className="p-4 rounded-xl border border-(--border-subtle) bg-(--surface-elevated)/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-(--brand-camel-dark)" />
                    <span className="text-xs font-bold text-(--text-primary)">
                      Video Embed (YouTube or Facebook)
                    </span>
                  </div>
                  {liveFormVideoInfo && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3" />
                      Detected {liveFormVideoInfo.type.toUpperCase()}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] text-(--text-muted) mb-1">
                    Paste YouTube link (e.g. <code className="text-(--brand-camel-dark)">https://www.youtube.com/watch?v=...</code> or <code className="text-(--brand-camel-dark)">https://youtu.be/...</code>) or Facebook video link:
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    placeholder="https://www.youtube.com/watch?v=... or https://www.facebook.com/.../videos/..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-(--border-subtle) bg-(--bg-main) text-(--text-primary) outline-none focus:border-(--brand-camel)"
                  />
                </div>

                {/* Live Video Preview Box */}
                {liveFormVideoInfo ? (
                  <div className="mt-2 space-y-1.5">
                    <div className="text-[11px] font-semibold text-(--text-muted) flex items-center gap-1">
                      <Play className="h-3 w-3 text-(--brand-camel)" /> Live Video Preview in Dashboard:
                    </div>
                    <div className="relative aspect-video w-full max-w-lg rounded-xl overflow-hidden border border-(--border-subtle) bg-black shadow-md">
                      {liveFormVideoInfo.type === 'direct' ? (
                        <video
                          src={liveFormVideoInfo.embedUrl}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <iframe
                          src={liveFormVideoInfo.embedUrl}
                          title="Video Preview"
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      )}
                    </div>
                  </div>
                ) : formData.videoUrl.trim() ? (
                  <div className="text-[11px] text-amber-500">
                    Enter a valid YouTube (e.g. https://www.youtube.com/watch?v=...) or Facebook video link.
                  </div>
                ) : null}
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-xs font-semibold text-(--text-primary) mb-1">
                  Cover Image
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {coverPreview ? (
                    <div className="relative h-24 w-40 rounded-xl overflow-hidden border border-(--border-subtle) bg-neutral-900 shrink-0">
                      <img
                        src={coverPreview}
                        alt="Cover Preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCoverFile(null);
                          setCoverPreview('');
                          setFormData((p) => ({ ...p, coverImage: '' }));
                        }}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-black"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="h-24 w-40 rounded-xl border border-dashed border-(--border-subtle) flex flex-col items-center justify-center gap-1 text-(--text-muted) hover:border-(--brand-camel) hover:text-(--text-primary) transition-colors cursor-pointer bg-(--bg-main) shrink-0"
                    >
                      <Upload className="h-5 w-5" />
                      <span className="text-[10px]">Upload Cover</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-2 w-full">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg border border-(--border-subtle) text-xs font-medium text-(--text-primary) hover:bg-(--surface-elevated)"
                      >
                        Choose File from Computer
                      </button>
                      <span className="text-[11px] text-(--text-muted)">or paste image URL:</span>
                    </div>
                    <input
                      type="url"
                      name="coverImage"
                      value={formData.coverImage}
                      onChange={(e) => {
                        setFormData((p) => ({ ...p, coverImage: e.target.value }));
                        if (!coverFile) setCoverPreview(e.target.value);
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-(--border-subtle) bg-(--bg-main) text-(--text-primary) outline-none focus:border-(--brand-camel)"
                    />
                  </div>
                </div>
              </div>

              {/* Tags, Status, Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-(--border-subtle)">
                <div>
                  <label className="block text-xs font-semibold text-(--text-primary) mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="Architecture, Modern, Luxury"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-(--border-subtle) bg-(--bg-main) text-(--text-primary) outline-none focus:border-(--brand-camel)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-(--text-primary) mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-(--border-subtle) bg-(--bg-main) text-(--text-primary) outline-none focus:border-(--brand-camel)"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-5">
                  <label className="relative flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="rounded border-(--border-subtle) text-(--brand-camel) focus:ring-(--brand-camel) h-4 w-4"
                    />
                    <span className="text-xs font-semibold text-(--text-primary)">
                      Featured Article
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-(--border-subtle)">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-xl border border-(--border-subtle) text-(--text-muted) hover:text-(--text-primary)"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-(--brand-camel-dark) to-(--brand-camel) px-5 py-2 text-xs font-semibold text-(--brand-black) hover:brightness-110 disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? 'Saving...' : editingId ? 'Update Article' : 'Publish Article'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK VIDEO PREVIEW MODAL */}
      {previewModalVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl bg-black border border-neutral-800 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-3 bg-neutral-900 border-b border-neutral-800 text-white">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Play className="h-4 w-4 text-(--brand-camel)" />
                <span className="capitalize">{previewModalVideo.type} Video Player</span>
              </div>
              <button
                onClick={() => setPreviewModalVideo(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              {previewModalVideo.type === 'direct' ? (
                <video
                  src={previewModalVideo.embedUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <iframe
                  src={previewModalVideo.embedUrl}
                  title="Video Player"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>
            <div className="p-3 bg-neutral-950 flex items-center justify-between text-xs text-neutral-400">
              <span className="truncate max-w-md">{previewModalVideo.originalUrl}</span>
              <a
                href={previewModalVideo.originalUrl}
                target="_blank"
                rel="noreferrer"
                className="text-(--brand-camel) hover:underline flex items-center gap-1 shrink-0 ml-2"
              >
                <span>Open original</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
