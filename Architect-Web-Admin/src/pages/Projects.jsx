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
  Image as ImageIcon,
  Video,
  CheckCircle2,
  ListPlus,
  Layers,
  Sparkles,
  Maximize2,
  Sliders,
  Calendar,
  MapPin,
  Building2,
  User,
  Clock,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiRequest, getImageUrl } from '../lib/apiClient';
import ImageGallery from '../components/common/ImageGallery';

const DEFAULT_PROJECT_TYPES = [
  'Residential',
  'Commercial',
  'Industrial',
  'Mixed Use',
  'Institutional',
  'Interior Design',
  'Architecture',
  'Landscape'
];

const EMPTY_FORM = {
  title: '',
  slug: '',
  location: '',
  year: '',
  client: '',
  projectType: 'Residential',
  mainImage: '',
  photos: [],
  architect: '',
  terms: '',
  strategy: '',
  date: '',
  videos: [],
  details: [],
  resultDescription: '',
  relatedProjects: [],
  roomSizes: [],
};

// Helper: Laptop File Picker for Main Cover Image
function ProjectImagePicker({ label, value, onChange, token, toast }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview while uploading (do not pass blob URL to form state)
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
        toast.showSuccess('Cover image uploaded successfully!');
      } else {
        setLocalPreview(null);
        toast.showError('Image upload failed.');
      }
    } catch (err) {
      setLocalPreview(null);
      toast.showError(err.message || 'Image upload failed.');
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
          {label || 'Project Cover Image'}
        </label>
        <span className="text-[10px] text-[var(--text-muted)]">
          Click below to select from your laptop
        </span>
      </div>

      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden h-48 ${
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
              alt="Project Cover"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 backdrop-blur-xs">
              <Upload size={22} className="text-amber-400 animate-bounce" />
              <span className="text-xs font-bold">Select from Laptop</span>
              <span className="text-[10px] opacity-80">Click to change cover image</span>
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-xs gap-2">
                <RefreshCw size={16} className="animate-spin text-amber-400" />
                Uploading from laptop...
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
              <Upload size={20} />
            </div>
            <span className="text-xs font-semibold text-[var(--text-primary)]">
              {uploading ? 'Uploading from laptop...' : 'Click to select from laptop'}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] mt-1">
              Supports JPG, PNG, WEBP, AVIF
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL / public path"
          className="w-full text-xs px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
        />
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            className="text-xs text-red-400 hover:text-red-300 px-2 py-1"
            title="Clear image"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

// Helper: Multi-Photo Gallery Laptop Picker
function GalleryPhotosManager({ photos = [], onChange, token, toast }) {
  const galleryInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleMultipleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    const newUploaded = [];

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        const res = await apiRequest('/home/upload-image', {
          method: 'POST',
          body: formData,
          token,
        });
        if (res?.success && res.url) {
          newUploaded.push(res.url);
        }
      } catch (err) {
        console.error('Failed photo upload:', err);
      }
    }

    if (newUploaded.length > 0) {
      onChange([...photos, ...newUploaded]);
      toast.showSuccess(`Added ${newUploaded.length} photo(s) from laptop!`);
    } else {
      toast.showError('Could not upload selected photos.');
    }

    setUploading(false);
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const handleRemovePhoto = (index) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-semibold text-[var(--text-primary)]">
            Project Photos Gallery ({photos.length})
          </label>
          <p className="text-[11px] text-[var(--text-muted)]">
            These appear under the "Incredible Result" photos tab on the website
          </p>
        </div>
        <button
          type="button"
          disabled={uploading}
          onClick={() => galleryInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--brand-camel)] text-white text-xs font-medium hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
        >
          <Upload size={14} />
          {uploading ? 'Uploading...' : 'Add Photos from Laptop'}
        </button>
        <input
          ref={galleryInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleMultipleFiles}
        />
      </div>

      {photos.length === 0 ? (
        <div
          onClick={() => galleryInputRef.current?.click()}
          className="border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--brand-camel)] rounded-xl p-6 text-center cursor-pointer transition-all bg-[var(--surface-elevated)]/30"
        >
          <ImageIcon className="mx-auto text-[var(--text-muted)] mb-2" size={24} />
          <p className="text-xs font-semibold text-[var(--text-primary)]">
            No gallery photos added yet
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Click here to select multiple photos from your laptop
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-60 overflow-y-auto p-1">
          {photos.map((photoUrl, idx) => (
            <div
              key={idx}
              className="relative group rounded-lg overflow-hidden border border-[var(--border-subtle)] aspect-4/3 bg-black/20"
            >
              <img
                src={getImageUrl(photoUrl)}
                alt={`Gallery ${idx + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => handleRemovePhoto(idx)}
                className="absolute top-1.5 right-1.5 bg-red-600/90 hover:bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                title="Remove photo"
              >
                <Trash2 size={12} />
              </button>
              <span className="absolute bottom-1 left-1 bg-black/60 text-[9px] text-white px-1.5 py-0.5 rounded font-mono">
                #{idx + 1}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Projects() {
  const { token } = useAuth();
  const toast = useToast();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [projectTypes, setProjectTypes] = useState(DEFAULT_PROJECT_TYPES);

  // Form State
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'media' | 'details' | 'related'
  const [form, setForm] = useState(EMPTY_FORM);

  // Lightbox / Image Gallery Preview
  const [gallery, setGallery] = useState({ open: false, images: [], idx: 0 });
  const openGallery = (images, idx = 0) => setGallery({ open: true, images, idx });
  const closeGallery = () => setGallery({ open: false, images: [], idx: 0 });

  // Quick Info Modal
  const [infoModal, setInfoModal] = useState({ open: false, project: null });

  // Load Projects & Types
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const [resProjects, resTypes] = await Promise.all([
        apiRequest('/projects'),
        apiRequest('/projects/types').catch(() => ({ data: DEFAULT_PROJECT_TYPES }))
      ]);

      setItems(resProjects?.data || []);
      if (resTypes?.data && Array.isArray(resTypes.data)) {
        setProjectTypes(resTypes.data);
      }
    } catch (err) {
      toast.showError(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filtered Items
  const filteredProjects = useMemo(() => {
    return items.filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.architect?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchType =
        selectedType === 'ALL' ||
        p.projectType?.toLowerCase() === selectedType.toLowerCase();

      return matchSearch && matchType;
    });
  }, [items, searchQuery, selectedType]);

  // Open Edit Form
  const handleEdit = (p) => {
    setEditingId(p._id || p.id);
    setForm({
      title: p.title || '',
      slug: p.slug || '',
      location: p.location || '',
      year: p.year || '',
      client: p.client || '',
      projectType: p.projectType || 'Residential',
      mainImage: p.mainImage || p.image || '',
      photos: Array.isArray(p.photos) ? p.photos : [],
      architect: p.architect || '',
      terms: p.terms || '',
      strategy: p.strategy || '',
      date: p.date || '',
      videos: Array.isArray(p.videos) ? p.videos : [],
      details: Array.isArray(p.details) ? p.details : [],
      resultDescription: p.resultDescription || '',
      relatedProjects: Array.isArray(p.relatedProjects)
        ? p.relatedProjects.map((r) => (typeof r === 'object' ? r._id : r))
        : [],
      roomSizes: Array.isArray(p.roomSizes) ? p.roomSizes : [],
    });
    setActiveTab('basic');
    setFormOpen(true);
  };

  // Open Create Form
  const handleOpenCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setActiveTab('basic');
    setFormOpen(true);
  };

  // Handle Form Submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.showError('Project Title is required');
      setActiveTab('basic');
      return;
    }

    if (!token) {
      toast.showError('You must be logged in as admin to save projects.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        slug: form.slug.trim(),
        mainImage: form.mainImage || '',
        image: form.mainImage || '',
        details: (form.details || []).filter(Boolean),
        roomSizes: (form.roomSizes || []).filter((r) => r && (r.size || r.label)),
        photos: (form.photos || []).filter(Boolean),
        videos: (form.videos || []).filter(Boolean),
        relatedProjects: (form.relatedProjects || []).filter(Boolean),
      };

      if (editingId) {
        await apiRequest(`/projects/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
          token,
          headers: { 'Content-Type': 'application/json' },
        });
        toast.showSuccess('Project updated successfully!');
      } else {
        await apiRequest('/projects', {
          method: 'POST',
          body: JSON.stringify(payload),
          token,
          headers: { 'Content-Type': 'application/json' },
        });
        toast.showSuccess('Project created successfully!');
      }

      setFormOpen(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      fetchProjects();
    } catch (err) {
      toast.showError(err.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  // Delete Project
  const handleDelete = async (p) => {
    if (!token) {
      toast.showError('You must be logged in as admin to delete projects.');
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete "${p.title}"?`);
    if (!confirmed) return;

    try {
      await apiRequest(`/projects/${p._id || p.id}`, {
        method: 'DELETE',
        token,
      });
      toast.showSuccess('Project deleted successfully');
      fetchProjects();
    } catch (err) {
      toast.showError(err.message || 'Failed to delete project');
    }
  };

  // Details List Helpers
  const addDetailPoint = () => {
    setForm((prev) => ({ ...prev, details: [...prev.details, ''] }));
  };
  const updateDetailPoint = (idx, val) => {
    setForm((prev) => {
      const updated = [...prev.details];
      updated[idx] = val;
      return { ...prev, details: updated };
    });
  };
  const removeDetailPoint = (idx) => {
    setForm((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== idx),
    }));
  };

  // Room Sizes Helpers
  const addRoomSize = () => {
    setForm((prev) => ({
      ...prev,
      roomSizes: [...prev.roomSizes, { size: '30 m²', label: 'Room' }],
    }));
  };
  const updateRoomSize = (idx, field, val) => {
    setForm((prev) => {
      const updated = [...prev.roomSizes];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, roomSizes: updated };
    });
  };
  const removeRoomSize = (idx) => {
    setForm((prev) => ({
      ...prev,
      roomSizes: prev.roomSizes.filter((_, i) => i !== idx),
    }));
  };

  // Video Helpers
  const addVideoUrl = () => {
    setForm((prev) => ({ ...prev, videos: [...prev.videos, ''] }));
  };
  const updateVideoUrl = (idx, val) => {
    setForm((prev) => {
      const updated = [...prev.videos];
      updated[idx] = val;
      return { ...prev, videos: updated };
    });
  };
  const removeVideoUrl = (idx) => {
    setForm((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[var(--text-primary)]">
              Projects Catalog
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--brand-camel)]/20 text-[var(--brand-camel)]">
              {items.length} Total
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Fully control website project showcase, floor dimensions, client specs, and media galleries
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchProjects}
            className="p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            title="Refresh projects"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--brand-camel)] text-white text-xs font-semibold hover:opacity-90 shadow-md transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Create Project</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[var(--surface-card)] p-3 rounded-2xl border border-[var(--border-subtle)]">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by project title, location, client..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <span className="text-[11px] text-[var(--text-muted)] font-medium shrink-0">
            Type:
          </span>
          <button
            type="button"
            onClick={() => setSelectedType('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
              selectedType === 'ALL'
                ? 'bg-[var(--brand-camel)] text-white'
                : 'bg-[var(--surface-ground)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            All ({items.length})
          </button>
          {projectTypes.map((type) => {
            const count = items.filter((p) => p.projectType === type).length;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  selectedType === type
                    ? 'bg-[var(--brand-camel)] text-white'
                    : 'bg-[var(--surface-ground)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {type} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Table / Cards */}
      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw size={28} className="animate-spin mx-auto text-[var(--brand-camel)] mb-3" />
          <p className="text-xs text-[var(--text-muted)]">Loading projects catalog...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-[var(--border-subtle)] rounded-2xl bg-[var(--surface-card)]">
          <Building2 size={36} className="mx-auto text-[var(--text-muted)] mb-3 opacity-60" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            No projects found
          </h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto mt-1 mb-4">
            {searchQuery || selectedType !== 'ALL'
              ? 'Try adjusting your search query or filter.'
              : 'Get started by creating your very first architectural project showcase.'}
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--brand-camel)] text-white text-xs font-semibold hover:opacity-90"
          >
            <Plus size={14} /> Create First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((p) => {
            const coverSrc = getImageUrl(p.mainImage || p.image);
            const photosCount = Array.isArray(p.photos) ? p.photos.length : 0;
            const roomsCount = Array.isArray(p.roomSizes) ? p.roomSizes.length : 0;

            return (
              <div
                key={p._id || p.id}
                className="group relative rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] overflow-hidden shadow-sm hover:shadow-md hover:border-[var(--brand-camel)]/50 transition-all flex flex-col"
              >
                {/* Cover Image Thumbnail */}
                <div className="relative h-48 w-full bg-black/10 overflow-hidden">
                  {coverSrc ? (
                    <img
                      src={coverSrc}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                      <ImageIcon size={32} />
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                      {p.projectType || 'Residential'}
                    </span>
                    {p.year && (
                      <span className="px-2 py-1 rounded-md text-[10px] font-semibold bg-amber-500/80 text-white backdrop-blur-xs">
                        {p.year}
                      </span>
                    )}
                  </div>

                  {/* Quick Preview Lightbox Button */}
                  {coverSrc && (
                    <button
                      type="button"
                      onClick={() => openGallery([coverSrc, ...(p.photos || []).map(getImageUrl)], 0)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                      title="Preview Gallery"
                    >
                      <Maximize2 size={14} />
                    </button>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-camel)] transition-colors line-clamp-1">
                        {p.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setInfoModal({ open: true, project: p })}
                        className="text-[var(--text-muted)] hover:text-blue-400 p-0.5"
                        title="View details popup"
                      >
                        <Info size={15} />
                      </button>
                    </div>

                    {/* Location & Client Specs */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[var(--text-muted)] mt-1.5">
                      {p.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-amber-500" />
                          {p.location}
                        </span>
                      )}
                      {p.client && (
                        <span className="flex items-center gap-1">
                          <User size={12} className="text-blue-400" />
                          {p.client}
                        </span>
                      )}
                    </div>

                    {/* Stats Pills */}
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[var(--border-subtle)]/50">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-elevated)] text-[var(--text-secondary)]">
                        📷 {photosCount} Photos
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-elevated)] text-[var(--text-secondary)]">
                        📐 {roomsCount} Rooms
                      </span>
                      {p.videos?.length > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-elevated)] text-[var(--text-secondary)]">
                          🎥 Video
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] gap-2">
                    <a
                      href={`http://localhost:5173/projects/${p.slug || p._id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--brand-camel)] transition-colors"
                      title="View on Live Website"
                    >
                      <ExternalLink size={13} />
                      <span>Live View</span>
                    </a>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEdit(p)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--brand-camel)] text-[var(--text-primary)] hover:text-white text-xs font-semibold transition-all cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-[var(--surface-card)] rounded-2xl border border-[var(--border-subtle)] shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--surface-elevated)]/50">
              <div>
                <h2 className="text-base font-bold text-[var(--text-primary)]">
                  {editingId ? 'Edit Project' : 'Create New Project'}
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Configure project information according to the live website UI
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 px-6 pt-3 border-b border-[var(--border-subtle)] bg-[var(--surface-ground)] overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`flex items-center gap-1.5 px-4 py-2 border-b-2 text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeTab === 'basic'
                    ? 'border-[var(--brand-camel)] text-[var(--brand-camel)]'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Building2 size={14} /> Basic & Specs
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('media')}
                className={`flex items-center gap-1.5 px-4 py-2 border-b-2 text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeTab === 'media'
                    ? 'border-[var(--brand-camel)] text-[var(--brand-camel)]'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <ImageIcon size={14} /> Cover & Gallery
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`flex items-center gap-1.5 px-4 py-2 border-b-2 text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeTab === 'details'
                    ? 'border-[var(--brand-camel)] text-[var(--brand-camel)]'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <CheckCircle2 size={14} /> Design Details & Room Sizes
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('related')}
                className={`flex items-center gap-1.5 px-4 py-2 border-b-2 text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeTab === 'related'
                    ? 'border-[var(--brand-camel)] text-[var(--brand-camel)]'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Layers size={14} /> Related Projects
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: BASIC & CLIENT SPECS (Matches top 6 items in UI) */}
              {activeTab === 'basic' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[var(--text-primary)]">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm((prev) => ({
                            ...prev,
                            title: val,
                            // Auto-generate slug if not custom
                            slug: prev.slug ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                          }));
                        }}
                        placeholder="e.g. Minimalist Villa Residence"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[var(--text-primary)]">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                        placeholder="minimalist-villa-residence"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)] font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[var(--text-primary)]">
                        Project Type
                      </label>
                      <select
                        value={form.projectType}
                        onChange={(e) => setForm((prev) => ({ ...prev, projectType: e.target.value }))}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                      >
                        {projectTypes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[var(--text-primary)]">
                        Location
                      </label>
                      <input
                        type="text"
                        value={form.location}
                        onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g. Lahore, Pakistan"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[var(--text-primary)]">
                        Year
                      </label>
                      <input
                        type="text"
                        value={form.year}
                        onChange={(e) => setForm((prev) => ({ ...prev, year: e.target.value }))}
                        placeholder="e.g. 2024"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                      />
                    </div>
                  </div>

                  {/* The 6 Top Meta Fields from Website UI */}
                  <div className="pt-4 border-t border-[var(--border-subtle)]">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                        Project Client & Specifications (Website Meta Table)
                      </h4>
                      <span className="text-[10px] text-[var(--text-muted)]">
                        Shown at the top of Project Detail page
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[var(--text-secondary)]">
                          Architect
                        </label>
                        <input
                          type="text"
                          value={form.architect}
                          onChange={(e) => setForm((prev) => ({ ...prev, architect: e.target.value }))}
                          placeholder="e.g. Monda Brothers Studio"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[var(--text-secondary)]">
                          Client
                        </label>
                        <input
                          type="text"
                          value={form.client}
                          onChange={(e) => setForm((prev) => ({ ...prev, client: e.target.value }))}
                          placeholder="e.g. Private Owner / Apex Corp"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[var(--text-secondary)]">
                          Terms (Duration)
                        </label>
                        <input
                          type="text"
                          value={form.terms}
                          onChange={(e) => setForm((prev) => ({ ...prev, terms: e.target.value }))}
                          placeholder="e.g. 6 Months"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[var(--text-secondary)]">
                          Strategy / Style
                        </label>
                        <input
                          type="text"
                          value={form.strategy}
                          onChange={(e) => setForm((prev) => ({ ...prev, strategy: e.target.value }))}
                          placeholder="e.g. Modern Minimalist"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[var(--text-secondary)]">
                          Completion Date
                        </label>
                        <input
                          type="text"
                          value={form.date}
                          onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                          placeholder="e.g. October 2024"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: COVER IMAGE & GALLERY MEDIA */}
              {activeTab === 'media' && (
                <div className="space-y-6">
                  {/* Laptop File Picker for Main Cover Image */}
                  <ProjectImagePicker
                    label="Main Cover Image (Full-width showcase)"
                    value={form.mainImage}
                    onChange={(val) => setForm((prev) => ({ ...prev, mainImage: val }))}
                    token={token}
                    toast={toast}
                  />

                  {/* Result Description Narrative */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-semibold text-[var(--text-primary)]">
                      Project Story / Result Description
                    </label>
                    <textarea
                      rows={3}
                      value={form.resultDescription}
                      onChange={(e) => setForm((prev) => ({ ...prev, resultDescription: e.target.value }))}
                      placeholder="A comprehensive architectural statement detailing the design concept, daylight integration, materials, and living experience..."
                      className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)] leading-relaxed"
                    />
                  </div>

                  {/* Photos Gallery (Laptop Multi-file Picker) */}
                  <div className="pt-4 border-t border-[var(--border-subtle)]">
                    <GalleryPhotosManager
                      photos={form.photos}
                      onChange={(newPhotos) => setForm((prev) => ({ ...prev, photos: newPhotos }))}
                      token={token}
                      toast={toast}
                    />
                  </div>

                  {/* Videos Manager */}
                  <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-semibold text-[var(--text-primary)]">
                          Project Videos
                        </label>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          MP4 URLs or local video paths (e.g. /videos/Sample.mp4)
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addVideoUrl}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand-camel)] hover:underline cursor-pointer"
                      >
                        <Plus size={13} /> Add Video URL
                      </button>
                    </div>

                    {form.videos.map((vid, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Video size={16} className="text-amber-500 shrink-0" />
                        <input
                          type="text"
                          value={vid}
                          onChange={(e) => updateVideoUrl(idx, e.target.value)}
                          placeholder="e.g. /videos/Sample.mp4 or https://..."
                          className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)] font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => removeVideoUrl(idx)}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: DESIGN IN DETAILS & ROOM SIZES (Exact UI Match) */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Design in Details Checklist */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                          Design In Details Checklist
                        </h4>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          Rendered with custom checkmark badges in the 2-column details grid
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addDetailPoint}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--brand-camel)] hover:text-white text-xs font-semibold transition-all cursor-pointer"
                      >
                        <Plus size={14} /> Add Detail Point
                      </button>
                    </div>

                    {form.details.length === 0 ? (
                      <div className="p-4 border border-dashed border-[var(--border-subtle)] rounded-xl text-center text-xs text-[var(--text-muted)]">
                        No detail checklist items yet. Click "Add Detail Point" above.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {form.details.map((point, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[var(--brand-camel)] flex items-center justify-center shrink-0 text-white text-xs">
                              ✓
                            </span>
                            <input
                              type="text"
                              value={point}
                              onChange={(e) => updateDetailPoint(idx, e.target.value)}
                              placeholder="e.g. Bespoke interior and exterior architectural styling"
                              className="flex-1 text-xs px-3 py-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                            />
                            <button
                              type="button"
                              onClick={() => removeDetailPoint(idx)}
                              className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Room Sizes Segmented Bar */}
                  <div className="pt-5 border-t border-[var(--border-subtle)] space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                          Room Sizes (Segmented Rectangle)
                        </h4>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          Shows dimension badges like "55 m² Living Lounge"
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addRoomSize}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--brand-camel)] hover:text-white text-xs font-semibold transition-all cursor-pointer"
                      >
                        <Plus size={14} /> Add Room Spec
                      </button>
                    </div>

                    {form.roomSizes.length === 0 ? (
                      <div className="p-4 border border-dashed border-[var(--border-subtle)] rounded-xl text-center text-xs text-[var(--text-muted)]">
                        No room sizes added. Click "Add Room Spec" above.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {form.roomSizes.map((room, idx) => (
                            <div
                              key={idx}
                              className="relative p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] space-y-2"
                            >
                              <button
                                type="button"
                                onClick={() => removeRoomSize(idx)}
                                className="absolute top-2 right-2 text-red-400 hover:text-red-300"
                                title="Remove room"
                              >
                                <X size={14} />
                              </button>
                              <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">
                                  Size / Measurement
                                </label>
                                <input
                                  type="text"
                                  value={room.size}
                                  onChange={(e) => updateRoomSize(idx, 'size', e.target.value)}
                                  placeholder="e.g. 55 m²"
                                  className="w-full text-xs font-bold px-2 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">
                                  Room Label
                                </label>
                                <input
                                  type="text"
                                  value={room.label}
                                  onChange={(e) => updateRoomSize(idx, 'label', e.target.value)}
                                  placeholder="e.g. Living Lounge"
                                  className="w-full text-xs px-2 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-ground)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-camel)]"
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Live Preview of Segmented UI Rectangle */}
                        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
                          <span className="text-[10px] font-semibold text-[var(--text-muted)] block mb-2">
                            Website UI Live Preview:
                          </span>
                          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white text-black">
                            <div className="flex divide-x divide-gray-300 overflow-x-auto">
                              {form.roomSizes.map((room, idx) => (
                                <div key={idx} className="flex-1 min-w-[100px] py-4 text-center">
                                  <p className="text-xl font-bold text-black mb-1">
                                    {room.size || '0 m²'}
                                  </p>
                                  <p className="text-gray-600 text-xs">
                                    {room.label || 'Room'}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: RELATED PROJECTS */}
              {activeTab === 'related' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                      Select Related Projects
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Displayed in the 3-column carousel at the bottom of the Project Detail page
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto p-1">
                    {items
                      .filter((p) => (p._id || p.id) !== editingId)
                      .map((p) => {
                        const pid = p._id || p.id;
                        const isChecked = form.relatedProjects.includes(pid);

                        return (
                          <label
                            key={pid}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                              isChecked
                                ? 'border-[var(--brand-camel)] bg-[var(--brand-camel)]/10'
                                : 'border-[var(--border-subtle)] bg-[var(--surface-elevated)]/50 hover:border-[var(--brand-camel)]/50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setForm((prev) => ({
                                    ...prev,
                                    relatedProjects: [...prev.relatedProjects, pid],
                                  }));
                                } else {
                                  setForm((prev) => ({
                                    ...prev,
                                    relatedProjects: prev.relatedProjects.filter((id) => id !== pid),
                                  }));
                                }
                              }}
                              className="rounded text-[var(--brand-camel)] focus:ring-[var(--brand-camel)]"
                            />
                            <div className="w-12 h-10 rounded-lg overflow-hidden bg-black/20 shrink-0">
                              <img
                                src={getImageUrl(p.mainImage || p.image)}
                                alt={p.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                                {p.title}
                              </p>
                              <p className="text-[10px] text-[var(--text-muted)] truncate">
                                {p.location || p.projectType || 'Project'}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-between pt-5 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--brand-camel)] text-white text-xs font-bold hover:opacity-90 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Saving Project...</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      <span>{editingId ? 'Update Project' : 'Publish Project'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK INFO MODAL */}
      {infoModal.open && infoModal.project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-[var(--surface-card)] rounded-2xl border border-[var(--border-subtle)] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  {infoModal.project.title}
                </h3>
                <p className="text-xs text-[var(--brand-camel)]">
                  {infoModal.project.projectType} • {infoModal.project.year}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInfoModal({ open: false, project: null })}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-[var(--surface-elevated)]">
                <span className="text-[10px] text-[var(--text-muted)] block">Architect</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {infoModal.project.architect || '—'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--surface-elevated)]">
                <span className="text-[10px] text-[var(--text-muted)] block">Client</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {infoModal.project.client || '—'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--surface-elevated)]">
                <span className="text-[10px] text-[var(--text-muted)] block">Location</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {infoModal.project.location || '—'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--surface-elevated)]">
                <span className="text-[10px] text-[var(--text-muted)] block">Terms</span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {infoModal.project.terms || '—'}
                </span>
              </div>
            </div>

            {infoModal.project.resultDescription && (
              <div className="text-xs text-[var(--text-muted)] leading-relaxed p-3 rounded-lg bg-[var(--surface-ground)]">
                {infoModal.project.resultDescription}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => {
                  const p = infoModal.project;
                  setInfoModal({ open: false, project: null });
                  handleEdit(p);
                }}
                className="px-3 py-1.5 rounded-lg bg-[var(--brand-camel)] text-white text-xs font-semibold"
              >
                Edit in Full Form
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN IMAGE GALLERY LIGHTBOX */}
      <ImageGallery
        open={gallery.open}
        images={gallery.images}
        currentIndex={gallery.idx}
        onClose={closeGallery}
        onPrevious={() =>
          setGallery((g) => ({
            ...g,
            idx: (g.idx - 1 + g.images.length) % g.images.length,
          }))
        }
        onNext={() =>
          setGallery((g) => ({
            ...g,
            idx: (g.idx + 1) % g.images.length,
          }))
        }
      />
    </div>
  );
}
