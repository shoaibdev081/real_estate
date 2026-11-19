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
  Zap,
  Calendar,
  Layers,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  Megaphone,
  Radio,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiRequest, getImageUrl } from '../lib/apiClient';

const CATEGORIES = [
  'Project Update',
  'Breaking News',
  'New Launch',
  'Milestone',
  'Award & Recognition',
  'Event',
  'Announcement',
];

const EMPTY_FORM = {
  title: '',
  category: 'Project Update',
  badge: 'FLASH NEWS',
  summary: '',
  content: '',
  relatedProject: '',
  image: '',
  isFlash: true,
  priority: 0,
  status: 'published',
};

export default function FlashNewsManager() {
  const { token } = useAuth();
  const toast = useToast();

  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);

  const fileInputRef = useRef(null);

  // Fetch all news for admin (includes draft & archived)
  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/flash-news/admin/all', { token });
      if (res?.data) {
        setNewsList(res.data);
      }
    } catch (err) {
      toast.showError(err.message || 'Failed to fetch flash news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setImageFile(null);
    setImagePreview('');
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item._id);
    setFormData({
      title: item.title || '',
      category: item.category || 'Project Update',
      badge: item.badge || 'FLASH NEWS',
      summary: item.summary || '',
      content: item.content || '',
      relatedProject: item.relatedProject || '',
      image: item.image || '',
      isFlash: item.isFlash !== false,
      priority: item.priority || 0,
      status: item.status || 'published',
    });
    setImageFile(null);
    setImagePreview(item.image ? getImageUrl(item.image) : '');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setImageFile(null);
    setImagePreview('');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.showError('News title is required');
      return;
    }
    if (!formData.summary.trim()) {
      toast.showError('Summary is required');
      return;
    }
    if (!formData.content.trim()) {
      toast.showError('Content is required');
      return;
    }

    setSaving(true);
    try {
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('category', formData.category);
      data.append('badge', formData.badge.trim());
      data.append('summary', formData.summary.trim());
      data.append('content', formData.content.trim());
      data.append('relatedProject', formData.relatedProject.trim());
      data.append('isFlash', String(formData.isFlash));
      data.append('priority', String(formData.priority));
      data.append('status', formData.status);

      if (imageFile) {
        data.append('image', imageFile);
      } else if (formData.image) {
        data.append('image', formData.image);
      }

      if (editingId) {
        const res = await apiRequest(`/flash-news/${editingId}`, {
          method: 'PUT',
          body: data,
          token,
        });
        if (res?.success) {
          toast.showSuccess('News update saved successfully!');
          closeModal();
          fetchNews();
        }
      } else {
        const res = await apiRequest('/flash-news', {
          method: 'POST',
          body: data,
          token,
        });
        if (res?.success) {
          toast.showSuccess('News update created and published!');
          closeModal();
          fetchNews();
        }
      }
    } catch (err) {
      toast.showError(err.message || 'Failed to save news update');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await apiRequest(`/flash-news/${id}`, {
        method: 'DELETE',
        token,
      });
      if (res?.success) {
        toast.showSuccess('News update deleted');
        setNewsList((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      toast.showError(err.message || 'Failed to delete news update');
    }
  };

  // Filtered list for table
  const filteredList = useMemo(() => {
    return newsList.filter((item) => {
      const matchesCategory =
        categoryFilter === 'All' || item.category === categoryFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        item.title?.toLowerCase().includes(q) ||
        item.summary?.toLowerCase().includes(q) ||
        item.relatedProject?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [newsList, categoryFilter, search]);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-(--border-subtle)">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Megaphone className="h-4 w-4" />
            </div>
            <h1 className="text-lg font-bold text-(--text-primary)">
              Flash News & Project Updates
            </h1>
          </div>
          <p className="text-xs text-(--text-muted) mt-1">
            Publish breaking announcements, construction milestones, and project launches for the website.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="http://localhost:5173/flash-news"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-(--border-subtle) bg-(--surface-primary) px-3 py-1.5 text-xs font-medium text-(--text-muted) hover:text-(--text-primary) transition"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Live Page
          </a>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-amber-500 to-amber-400 px-3.5 py-1.5 text-xs font-semibold text-slate-950 shadow hover:from-amber-400 hover:to-amber-300 transition"
          >
            <Plus className="h-4 w-4" />
            Add Flash News
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-(--surface-elevated) p-3 rounded-xl border border-(--border-subtle)">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search news by title, project, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-(--border-subtle) bg-(--surface-primary) text-(--text-primary) outline-none focus:border-amber-500/70"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-(--border-subtle) bg-(--surface-primary) text-(--text-primary) outline-none focus:border-amber-500/70"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={fetchNews}
            className="p-2 rounded-lg border border-(--border-subtle) text-gray-400 hover:text-white hover:bg-(--surface-primary) transition"
            title="Refresh"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* News Table */}
      <div className="rounded-xl border border-(--border-subtle) bg-(--surface-elevated) overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-(--surface-primary) border-b border-(--border-subtle) text-(--text-muted) font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Title & Project</th>
                <th className="py-3 px-4">Category & Badge</th>
                <th className="py-3 px-4">Flash Ticker</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Published</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border-subtle)">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-400">
                    Loading news updates...
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-400">
                    No flash news items found. Click "Add Flash News" to create one.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr key={item._id} className="hover:bg-(--surface-primary)/50 transition">
                    <td className="py-3 px-4">
                      {item.image ? (
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.title}
                          className="w-12 h-10 object-cover rounded border border-(--border-subtle)"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/service-1.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-10 bg-gray-800 rounded flex items-center justify-center text-gray-500 text-[10px]">
                          No Pic
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-(--text-primary) line-clamp-1">
                        {item.title}
                      </div>
                      {item.relatedProject && (
                        <div className="text-[11px] text-amber-400 font-medium mt-0.5">
                          Project: {item.relatedProject}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30">
                        {item.badge || item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {item.isFlash ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                          <Zap className="h-3 w-3 fill-emerald-400" />
                          Yes (Ticker)
                        </span>
                      ) : (
                        <span className="text-[11px] text-gray-400">Standard</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          item.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : item.status === 'draft'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-slate-500/10 text-slate-400'
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-(--text-muted) text-[11px]">
                      {new Date(item.publishedAt || item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewItem(item)}
                          className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-white/5 transition"
                          title="Preview"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition"
                          title="Edit"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item._id, item.title)}
                          className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-(--surface-elevated) border border-(--border-subtle) shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-(--border-subtle)">
              <div className="flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-(--text-primary)">
                  {editingId ? 'Edit Flash News Update' : 'Publish New Flash News'}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-(--text-primary)">
                  Headline / Title <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Groundbreaking Milestone for DHA Multan Commercial Complex Phase 2"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-(--border-subtle) bg-(--surface-primary) text-(--text-primary) outline-none focus:border-amber-500/70"
                />
              </div>

              {/* Category, Badge, Status in Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-(--text-primary)">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-(--border-subtle) bg-(--surface-primary) text-(--text-primary) outline-none focus:border-amber-500/70"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-(--text-primary)">
                    Badge Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BREAKING UPDATE"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-(--border-subtle) bg-(--surface-primary) text-(--text-primary) outline-none focus:border-amber-500/70"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-(--text-primary)">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-(--border-subtle) bg-(--surface-primary) text-(--text-primary) outline-none focus:border-amber-500/70"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Related Project & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-(--text-primary)">
                    Related Project Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DHA Multan Commercial Mall"
                    value={formData.relatedProject}
                    onChange={(e) => setFormData({ ...formData, relatedProject: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-(--border-subtle) bg-(--surface-primary) text-(--text-primary) outline-none focus:border-amber-500/70"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-(--text-primary)">
                    Display Priority (Higher = First)
                  </label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-(--border-subtle) bg-(--surface-primary) text-(--text-primary) outline-none focus:border-amber-500/70"
                  />
                </div>
              </div>

              {/* Flash Ticker Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-(--border-subtle) bg-(--surface-primary)">
                <div>
                  <div className="text-xs font-semibold text-(--text-primary) flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-amber-400" />
                    Show in Flash News Ticker?
                  </div>
                  <div className="text-[11px] text-(--text-muted) mt-0.5">
                    Displays headline in the top animated breaking news ticker bar on the website.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isFlash: !formData.isFlash })}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.isFlash ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                  role="switch"
                  aria-checked={formData.isFlash}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formData.isFlash ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Image Picker */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-(--text-primary)">
                  Cover Photo / Project Visual
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg border border-(--border-subtle) bg-(--surface-primary) text-xs font-medium text-(--text-primary) hover:border-amber-500/60 transition flex items-center gap-1.5"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload from Computer
                  </button>
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-10 w-16 object-cover rounded border border-(--border-subtle)"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                          setFormData({ ...formData, image: '' });
                        }}
                        className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-(--text-primary)">
                  Short Summary / Excerpt <span className="text-amber-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="A concise 1-2 sentence preview for cards and ticker..."
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-(--border-subtle) bg-(--surface-primary) text-(--text-primary) outline-none focus:border-amber-500/70"
                />
              </div>

              {/* Full Content */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-(--text-primary)">
                  Full Details / Project Content <span className="text-amber-500">*</span>
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Provide comprehensive updates, architecture details, material choices, construction timeline, etc..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-(--border-subtle) bg-(--surface-primary) text-(--text-primary) outline-none focus:border-amber-500/70 leading-relaxed font-sans"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-(--border-subtle)">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs rounded-lg border border-(--border-subtle) text-(--text-muted) hover:text-(--text-primary) transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-amber-500 to-amber-400 px-5 py-2 text-xs font-semibold text-slate-950 shadow hover:from-amber-400 hover:to-amber-300 disabled:opacity-60 transition"
                >
                  <Save className="h-3.5 w-3.5" />
                  {saving ? 'Saving...' : editingId ? 'Update News' : 'Publish News'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-2xl bg-(--surface-elevated) border border-(--border-subtle) p-6 shadow-2xl space-y-4">
            <button
              type="button"
              onClick={() => setPreviewItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="h-4 w-4" />
            </button>

            {previewItem.image && (
              <img
                src={getImageUrl(previewItem.image)}
                alt={previewItem.title}
                className="w-full h-48 object-cover rounded-xl"
              />
            )}

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400">
                  {previewItem.badge || previewItem.category}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(previewItem.publishedAt || previewItem.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-base font-bold text-(--text-primary)">
                {previewItem.title}
              </h3>
              {previewItem.relatedProject && (
                <p className="text-xs text-amber-400 font-medium mt-1">
                  Project: {previewItem.relatedProject}
                </p>
              )}
            </div>

            <p className="text-xs text-gray-300 bg-(--surface-primary) p-3 rounded-lg leading-relaxed border border-(--border-subtle)">
              {previewItem.summary}
            </p>

            <div className="text-xs text-gray-400 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-line pr-1">
              {previewItem.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

