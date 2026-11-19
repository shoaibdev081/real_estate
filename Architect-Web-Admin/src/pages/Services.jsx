import { useEffect, useMemo, useState, useRef } from 'react';
import {
  Plus,
  Info,
  X,
  Search,
  Upload,
  Edit,
  Trash2,
  ExternalLink,
  Save,
  RefreshCw,
  Sparkles,
  Layers,
  HelpCircle,
  CheckCircle2,
  ListPlus,
  Sliders,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { apiRequest, getImageUrl } from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ResourceTable from '../components/common/ResourceTable';
import ImageGallery from '../components/common/ImageGallery';

const EMPTY_FORM = {
  slug: '',
  title: '',
  image: '',
  desc: '',
  desc2: '',
  features: [],
  points: [],
  faqs: [],
};

// Helper component for picking and uploading image from laptop file explorer
function ServiceImagePicker({ label, value, onChange, token, showToast }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local instant preview while uploading (do not set form value to blob)
    const localUrl = URL.createObjectURL(file);
    setLocalPreview(localUrl);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await apiRequest('/home/upload-image', {
        method: 'POST',
        body: formData,
        token,
      });

      if (res?.success && res.url) {
        onChange(res.url);
        setLocalPreview(null);
        showToast.showSuccess('Service image uploaded successfully!');
      } else {
        setLocalPreview(null);
        showToast.showError('Image upload failed.');
      }
    } catch (err) {
      setLocalPreview(null);
      showToast.showError(err.message || 'Image upload failed.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const previewSrc = localPreview || getImageUrl(value);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[var(--text-primary)]">
          {label || 'Service Cover Image'}
        </label>
        <span className="text-[10px] text-[var(--text-muted)]">
          Recommended: 1200x800 JPG/PNG/WEBP
        </span>
      </div>

      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden h-40 ${
          (localPreview || value)
            ? 'border-[var(--brand-camel)]/50 hover:border-[var(--brand-camel)] bg-[var(--surface-elevated)]'
            : 'border-[var(--border-subtle)] hover:border-[var(--brand-camel)] bg-[var(--surface-elevated)]/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {(localPreview || value) ? (
          <div className="relative w-full h-full">
            <img
              src={previewSrc}
              alt="Service preview"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 backdrop-blur-xs">
              <Upload size={20} className="text-amber-400 animate-bounce" />
              <span className="text-xs font-bold">Select from Laptop</span>
              <span className="text-[10px] opacity-80">Click to change cover photo</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="h-10 w-10 rounded-full bg-[var(--brand-camel)]/10 text-[var(--brand-camel-dark)] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Upload size={20} />
            </div>
            <span className="text-xs font-semibold text-[var(--text-primary)]">
              Choose Service Image from Laptop
            </span>
            <span className="text-[10px] text-[var(--text-muted)] mt-0.5">
              Opens your device file picker / gallery
            </span>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2 z-10">
            <RefreshCw size={22} className="animate-spin text-amber-400" />
            <span className="text-xs font-semibold">Uploading image…</span>
          </div>
        )}
      </div>

      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or enter direct image URL / path…"
        className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-2.5 py-1 text-[11px] text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)] font-mono"
      />
    </div>
  );
}

export default function Services() {
  const { token } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'overview'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [gallery, setGallery] = useState({ open: false, images: [], idx: 0 });

  // Services Page Overview & Skills State
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewSaving, setOverviewSaving] = useState(false);
  const [overviewData, setOverviewData] = useState({
    badge: 'OUR SERVICES',
    titlePrefix: 'Trusted expert in ',
    titleHighlight: 'architectural design and innovation.',
    description: 'We specialize in transforming visions into reality. Explore our portfolio of innovative architectural and interior design projects crafted with precision.',
    image: '/images/ser-img-3.png',
    skills: [
      { name: 'Interior Design', percentage: 85 },
      { name: '3D Modeling', percentage: 95 },
      { name: '2D Planning', percentage: 65 }
    ]
  });

  const openGallery = (images, idx = 0) => {
    setGallery({ open: true, images, idx });
  };
  const closeGallery = () => setGallery({ open: false, images: [], idx: 0 });
  const gotoGalleryIdx = (newIdx) => setGallery((g) => ({ ...g, idx: newIdx }));

  // Fetch services list
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/services', {});
      setItems(res?.data ?? []);
    } catch (err) {
      toast.showError(err.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  // Fetch overview & skills data
  const fetchOverview = async () => {
    setOverviewLoading(true);
    try {
      const res = await apiRequest('/home');
      if (res?.success && res.data?.servicesOverview) {
        setOverviewData(res.data.servicesOverview);
      }
    } catch (err) {
      // safe fallback
    } finally {
      setOverviewLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchOverview();
  }, []);

  // Save Services Page Overview Settings
  const handleSaveOverview = async () => {
    setOverviewSaving(true);
    try {
      await apiRequest('/home', {
        method: 'PUT',
        body: { servicesOverview: overviewData },
        token,
      });
      toast.showSuccess('Services Page Overview & Skills updated successfully!');
    } catch (err) {
      toast.showError(err.message || 'Failed to save services overview');
    } finally {
      setOverviewSaving(false);
    }
  };

  // Auto-slugify generator
  const slugify = (text) =>
    text
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  const handleTitleChange = (e) => {
    const titleVal = e.target.value;
    setForm((prev) => ({
      ...prev,
      title: titleVal,
      slug: !editingId ? slugify(titleVal) : prev.slug,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Features CRUD
  const handleAddFeature = () =>
    setForm((prev) => ({
      ...prev,
      features: [...(prev.features || []), { title: '', desc: '' }],
    }));

  const handleRemoveFeature = (idx) =>
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx),
    }));

  const handleFeatureChange = (idx, key, value) =>
    setForm((prev) => {
      const updated = [...prev.features];
      updated[idx] = { ...updated[idx], [key]: value };
      return { ...prev, features: updated };
    });

  // Points CRUD
  const handleAddPoint = () =>
    setForm((prev) => ({
      ...prev,
      points: [...(prev.points || []), ''],
    }));

  const handleRemovePoint = (idx) =>
    setForm((prev) => ({
      ...prev,
      points: prev.points.filter((_, i) => i !== idx),
    }));

  const handlePointChange = (idx, value) =>
    setForm((prev) => {
      const updated = [...prev.points];
      updated[idx] = value;
      return { ...prev, points: updated };
    });

  // FAQs CRUD
  const handleAddFaq = () =>
    setForm((prev) => ({
      ...prev,
      faqs: [...(prev.faqs || []), { q: '', a: '' }],
    }));

  const handleRemoveFaq = (idx) =>
    setForm((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== idx),
    }));

  const handleFaqChange = (idx, key, value) =>
    setForm((prev) => {
      const updated = [...prev.faqs];
      updated[idx] = { ...updated[idx], [key]: value };
      return { ...prev, faqs: updated };
    });

  // Submit Create or Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) {
      toast.showError('Service title is required');
      return;
    }

    const finalSlug = form.slug ? slugify(form.slug) : slugify(form.title);

    setSaving(true);
    try {
      const payload = {
        title: form.title,
        slug: finalSlug,
        image: form.image || '',
        desc: form.desc || '',
        desc2: form.desc2 || '',
        features: (form.features || []).filter((f) => f.title?.trim()),
        points: (form.points || []).filter((p) => p?.trim()),
        faqs: (form.faqs || []).filter((faq) => faq.q?.trim()),
      };

      if (editingId) {
        await apiRequest(`/services/${editingId}`, {
          method: 'PUT',
          body: payload,
          token,
        });
        toast.showSuccess(`Service "${form.title}" updated successfully!`);
      } else {
        await apiRequest('/services', {
          method: 'POST',
          body: payload,
          token,
        });
        toast.showSuccess(`Service "${form.title}" created successfully!`);
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setFormOpen(false);
      fetchServices();
    } catch (err) {
      toast.showError(err.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (row) => {
    setEditingId(row._id);
    setFormOpen(true);

    let features = [];
    if (Array.isArray(row.features)) features = row.features;
    else if (typeof row.features === 'string') {
      try { features = JSON.parse(row.features); } catch {}
    }

    let points = [];
    if (Array.isArray(row.points)) points = row.points;
    else if (typeof row.points === 'string') {
      try { points = JSON.parse(row.points); } catch {}
    }

    let faqs = [];
    if (Array.isArray(row.faqs)) faqs = row.faqs;
    else if (typeof row.faqs === 'string') {
      try { faqs = JSON.parse(row.faqs); } catch {}
    }

    setForm({
      slug: row.slug || '',
      title: row.title || '',
      image: row.image || '',
      desc: row.desc || '',
      desc2: row.desc2 || '',
      features: features.map((f) => ({ title: f.title || '', desc: f.desc || '' })),
      points: points.map((p) => String(p || '')),
      faqs: faqs.map((faq) => ({ q: faq.q || '', a: faq.a || '' })),
    });

    // Smooth scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (row) => {
    const confirmed = window.confirm(`Are you sure you want to delete service "${row.title}"?`);
    if (!confirmed) return;
    try {
      await apiRequest(`/services/${row._id}`, {
        method: 'DELETE',
        token,
      });
      toast.showSuccess('Service deleted successfully');
      fetchServices();
    } catch (err) {
      toast.showError(err.message || 'Failed to delete service');
    }
  };

  // Filtered services based on search
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (s) =>
        s.title?.toLowerCase().includes(q) ||
        s.slug?.toLowerCase().includes(q) ||
        s.desc?.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--brand-camel)]/20 text-[var(--brand-camel-dark)]">
              <Sparkles size={16} />
            </span>
            <h1 className="text-base font-bold text-[var(--text-primary)]">
              Services Management
            </h1>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Manage your service catalog, cover images, descriptions, feature checkmarks, and detail FAQs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="http://localhost:5173/services"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-card)] transition-colors"
          >
            <span>View Services UI</span>
            <ExternalLink size={13} />
          </a>

          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm(EMPTY_FORM);
              setFormOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-2 text-xs font-bold text-slate-950 shadow hover:from-amber-400 hover:to-amber-300 transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>New Service</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'catalog'
              ? 'border-[var(--brand-camel)] bg-[var(--surface-card)] text-[var(--brand-camel-dark)]'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Layers size={14} />
          <span>Services Catalog ({items.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-[var(--brand-camel)] bg-[var(--surface-card)] text-[var(--brand-camel-dark)]'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <SlidersHorizontal size={14} />
          <span>Services Page Skills & Banner</span>
        </button>
      </div>

      {/* TAB 1: SERVICES CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* SEARCH & QUICK STATS */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search services by title or description…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] pl-9 pr-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)] shadow-xs"
              />
            </div>

            <div className="text-xs text-[var(--text-muted)]">
              Showing <span className="font-bold text-[var(--text-primary)]">{filteredServices.length}</span> of {items.length} services
            </div>
          </div>

          {/* CREATE / EDIT SERVICE FORM MODAL / PANEL */}
          {formOpen && (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-[var(--brand-camel)]/40 bg-[var(--surface-card)] p-5 sm:p-6 shadow-xl space-y-5 animate-in fade-in"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--brand-camel)]/20 text-[var(--brand-camel-dark)] font-bold text-xs">
                    {editingId ? '✎' : '+'}
                  </span>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    {editingId ? `Edit Service: ${form.title}` : 'Create New Service'}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFormOpen(false);
                    setForm(EMPTY_FORM);
                    setEditingId(null);
                  }}
                  className="rounded-lg p-1 text-gray-400 hover:bg-[var(--surface-elevated)] hover:text-red-500 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Title & Slug */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-primary)]">
                    Service Title *
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleTitleChange}
                    placeholder="e.g. Interior Design & Architectural Planning"
                    required
                    className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-2 text-xs font-bold text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-primary)]">
                    URL Slug *
                  </label>
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="e.g. interior-design"
                    required
                    className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-2 text-xs font-mono text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
                  />
                  <p className="text-[10px] text-[var(--text-muted)]">
                    Used in live URL: /services/{form.slug || 'slug'}
                  </p>
                </div>
              </div>

              {/* Cover Image Upload (From Laptop) */}
              <div className="border-t border-[var(--border-subtle)] pt-3">
                <ServiceImagePicker
                  label="Service Visual / Banner Image"
                  value={form.image}
                  onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
                  token={token}
                  showToast={toast}
                />
              </div>

              {/* Descriptions */}
              <div className="grid gap-4 sm:grid-cols-2 border-t border-[var(--border-subtle)] pt-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-primary)]">
                    Short Description (Cards & Home Listings)
                  </label>
                  <textarea
                    name="desc"
                    rows={3}
                    value={form.desc}
                    onChange={handleChange}
                    placeholder="Brief 1-2 sentence overview of this service..."
                    className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text-primary)]">
                    Detailed Description (About The Service Page)
                  </label>
                  <textarea
                    name="desc2"
                    rows={3}
                    value={form.desc2}
                    onChange={handleChange}
                    placeholder="Comprehensive explanation of what is included in this service..."
                    className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-2 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
                  />
                </div>
              </div>

              {/* FEATURES WITH CHECKMARKS */}
              <div className="border-t border-[var(--border-subtle)] pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                      Service Features ({form.features?.length || 0})
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Shown with golden checkmarks on the Service Detail page.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="inline-flex items-center gap-1 rounded-lg bg-[var(--brand-camel)]/15 px-3 py-1.5 text-xs font-semibold text-[var(--brand-camel-dark)] hover:bg-[var(--brand-camel)] hover:text-white transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Feature</span>
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {(form.features || []).map((f, idx) => (
                    <div
                      key={idx}
                      className="group relative rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-3.5 space-y-2 hover:border-[var(--brand-camel)]/60 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove feature"
                      >
                        <Trash2 size={13} />
                      </button>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[var(--brand-camel-dark)] uppercase">
                          Feature #{idx + 1} Title
                        </label>
                        <input
                          type="text"
                          value={f.title}
                          onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                          placeholder="e.g. Site Evaluation & Planning"
                          className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-card)] px-2.5 py-1 text-xs font-semibold text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-[var(--text-muted)]">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={f.desc}
                          onChange={(e) => handleFeatureChange(idx, 'desc', e.target.value)}
                          placeholder="Feature details..."
                          className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-card)] px-2.5 py-1 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* KEY ELEMENTS / BULLET POINTS */}
              <div className="border-t border-[var(--border-subtle)] pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                      Key Elements / Bullet Points ({form.points?.length || 0})
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Shown in 2 columns under Key Elements of Interior Design.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddPoint}
                    className="inline-flex items-center gap-1 rounded-lg bg-[var(--brand-camel)]/15 px-3 py-1.5 text-xs font-semibold text-[var(--brand-camel-dark)] hover:bg-[var(--brand-camel)] hover:text-white transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Bullet Point</span>
                  </button>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {(form.points || []).map((p, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5"
                    >
                      <span className="h-2 w-2 rounded-full bg-[var(--brand-camel)] shrink-0" />
                      <input
                        type="text"
                        value={p}
                        onChange={(e) => handlePointChange(idx, e.target.value)}
                        placeholder="e.g. Space planning and lighting design"
                        className="w-full bg-transparent text-xs text-[var(--text-primary)] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePoint(idx)}
                        className="text-gray-400 hover:text-red-500 p-0.5"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SERVICE FAQs (ACCORDIONS IN UI) */}
              <div className="border-t border-[var(--border-subtle)] pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                      Custom FAQs for This Service ({form.faqs?.length || 0})
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Displayed in the interactive accordion at the bottom of this service page.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="inline-flex items-center gap-1 rounded-lg bg-[var(--brand-camel)]/15 px-3 py-1.5 text-xs font-semibold text-[var(--brand-camel-dark)] hover:bg-[var(--brand-camel)] hover:text-white transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add FAQ</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(form.faqs || []).map((faq, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-3.5 space-y-2 hover:border-[var(--brand-camel)]/60 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveFaq(idx)}
                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove FAQ"
                      >
                        <Trash2 size={13} />
                      </button>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[var(--brand-camel-dark)] uppercase">
                          Question #{idx + 1}
                        </label>
                        <input
                          type="text"
                          value={faq.q}
                          onChange={(e) => handleFaqChange(idx, 'q', e.target.value)}
                          placeholder="e.g. What is the delivery timeframe?"
                          className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-card)] px-2.5 py-1 text-xs font-bold text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-[var(--text-muted)]">
                          Answer
                        </label>
                        <textarea
                          rows={2}
                          value={faq.a}
                          onChange={(e) => handleFaqChange(idx, 'a', e.target.value)}
                          placeholder="Answer details..."
                          className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-card)] px-2.5 py-1 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-[var(--border-subtle)] pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormOpen(false);
                    setForm(EMPTY_FORM);
                    setEditingId(null);
                  }}
                  className="rounded-xl border border-[var(--border-subtle)] px-4 py-2 text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-2 text-xs font-bold text-slate-950 shadow-md hover:from-amber-400 hover:to-amber-300 disabled:opacity-60 transition-all cursor-pointer"
                >
                  {saving ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Saving Service…</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      <span>{editingId ? 'Update Service' : 'Create Service'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* SERVICES LIST TABLE */}
          <div className="overflow-x-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--surface-elevated)] text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
                <tr>
                  <th className="px-4 py-3.5">Image</th>
                  <th className="px-4 py-3.5">Title & Slug</th>
                  <th className="px-4 py-3.5 hidden md:table-cell">Short Description</th>
                  <th className="px-4 py-3.5">Features & Elements</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                      No services found. Click "+ New Service" to create one.
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service) => {
                    const featCount = Array.isArray(service.features) ? service.features.length : 0;
                    const pointCount = Array.isArray(service.points) ? service.points.length : 0;
                    const faqCount = Array.isArray(service.faqs) ? service.faqs.length : 0;
                    const imgSrc = getImageUrl(service.image);

                    return (
                      <tr key={service._id} className="hover:bg-[var(--surface-elevated)]/60 transition-colors">
                        <td className="px-4 py-3">
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={service.title}
                              onClick={() => openGallery([imgSrc], 0)}
                              className="h-12 w-18 object-cover rounded-lg border border-[var(--border-subtle)] cursor-pointer hover:border-[var(--brand-camel)] transition-colors shadow-2xs"
                              title="Click to view image"
                            />
                          ) : (
                            <div className="h-12 w-18 rounded-lg bg-[var(--surface-elevated)] flex items-center justify-center text-[10px] text-gray-400 border border-dashed">
                              No image
                            </div>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-bold text-sm text-[var(--text-primary)]">
                            {service.title}
                          </div>
                          <div className="text-[10px] font-mono text-[var(--brand-camel-dark)] mt-0.5">
                            /{service.slug || service._id}
                          </div>
                        </td>

                        <td className="px-4 py-3 hidden md:table-cell max-w-xs truncate text-[var(--text-muted)]">
                          {service.desc || '—'}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1.5">
                            <span className="rounded-md bg-[var(--brand-camel)]/15 px-2 py-0.5 text-[10px] font-bold text-[var(--brand-camel-dark)]">
                              {featCount} Features
                            </span>
                            <span className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-500">
                              {pointCount} Points
                            </span>
                            {faqCount > 0 && (
                              <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                                {faqCount} FAQs
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <a
                              href={`http://localhost:5173/services/${service.slug || service._id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg p-1.5 text-gray-400 hover:text-amber-500 hover:bg-[var(--surface-elevated)] transition-colors"
                              title="Preview on Live Site"
                            >
                              <ExternalLink size={14} />
                            </a>

                            <button
                              type="button"
                              onClick={() => handleEdit(service)}
                              className="rounded-lg p-1.5 text-amber-500 hover:bg-amber-500/15 transition-colors cursor-pointer"
                              title="Edit Service"
                            >
                              <Edit size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(service)}
                              className="rounded-lg p-1.5 text-red-500 hover:bg-red-500/15 transition-colors cursor-pointer"
                              title="Delete Service"
                            >
                              <Trash2 size={14} />
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
      )}

      {/* TAB 2: SERVICES PAGE SKILLS & BANNER */}
      {activeTab === 'overview' && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Services Page Skills & Innovation Section
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Manage the progress bars, heading, description, and side visual photo shown on the main /services page.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveOverview}
              disabled={overviewSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-2 text-xs font-bold text-slate-950 shadow hover:from-amber-400 hover:to-amber-300 transition-all cursor-pointer"
            >
              {overviewSaving ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Saving…</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save Overview</span>
                </>
              )}
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-primary)]">
                Top Badge
              </label>
              <input
                type="text"
                value={overviewData.badge || ''}
                onChange={(e) => setOverviewData((prev) => ({ ...prev, badge: e.target.value }))}
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-primary)]">
                Heading Prefix
              </label>
              <input
                type="text"
                value={overviewData.titlePrefix || ''}
                onChange={(e) => setOverviewData((prev) => ({ ...prev, titlePrefix: e.target.value }))}
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--text-primary)]">
                Heading Highlight (Gold text)
              </label>
              <input
                type="text"
                value={overviewData.titleHighlight || ''}
                onChange={(e) => setOverviewData((prev) => ({ ...prev, titleHighlight: e.target.value }))}
                className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-primary)]">
              Description Paragraph
            </label>
            <textarea
              rows={2}
              value={overviewData.description || ''}
              onChange={(e) => setOverviewData((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
            />
          </div>

          {/* Side Showcase Image with Laptop file picker */}
          <div className="border-t border-[var(--border-subtle)] pt-4">
            <ServiceImagePicker
              label="Services Showcase Side Image"
              value={overviewData.image}
              onChange={(url) => setOverviewData((prev) => ({ ...prev, image: url }))}
              token={token}
              showToast={toast}
            />
          </div>

          {/* SKILLS LIST CRUD */}
          <div className="border-t border-[var(--border-subtle)] pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  Skill Progress Bars ({overviewData.skills?.length || 0})
                </h4>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Progress bar width automatically matches the percentage value.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setOverviewData((prev) => ({
                    ...prev,
                    skills: [...(prev.skills || []), { name: 'New Skill', percentage: 80 }],
                  }))
                }
                className="inline-flex items-center gap-1 rounded-lg bg-[var(--brand-camel)]/15 px-3 py-1.5 text-xs font-semibold text-[var(--brand-camel-dark)] hover:bg-[var(--brand-camel)] hover:text-white transition-colors cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {(overviewData.skills || []).map((skill, idx) => (
                <div
                  key={idx}
                  className="relative rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-3.5 space-y-2.5"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOverviewData((prev) => ({
                        ...prev,
                        skills: prev.skills.filter((_, i) => i !== idx),
                      }))
                    }
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-[var(--text-muted)] uppercase">
                      Skill Name
                    </label>
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setOverviewData((prev) => {
                          const updated = [...prev.skills];
                          updated[idx].name = val;
                          return { ...prev, skills: updated };
                        });
                      }}
                      className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-card)] px-2.5 py-1 text-xs font-bold text-[var(--text-primary)] outline-none focus:border-[var(--brand-camel)]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[10px] text-[var(--text-muted)] uppercase">Percentage</span>
                      <span className="font-bold text-[var(--brand-camel-dark)]">{skill.percentage}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={skill.percentage}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setOverviewData((prev) => {
                          const updated = [...prev.skills];
                          updated[idx].percentage = val;
                          return { ...prev, skills: updated };
                        });
                      }}
                      className="w-full accent-[var(--brand-camel)] cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      <ImageGallery
        open={gallery.open}
        images={gallery.images}
        currentIndex={gallery.idx}
        onClose={closeGallery}
        onPrevious={() => gotoGalleryIdx((gallery.idx - 1 + gallery.images.length) % gallery.images.length)}
        onNext={() => gotoGalleryIdx((gallery.idx + 1) % gallery.images.length)}
      />
    </div>
  );
}
